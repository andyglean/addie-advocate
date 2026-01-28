import { NextRequest } from "next/server";
import { openai } from "../../../lib/openai";
import { searchKnowledge, buildContext } from "../../../lib/rag";
import { ALLIE_SYSTEM_PROMPT } from "../../../lib/prompts/allieSystem";
import { supabaseAdmin } from "../../../lib/supabase";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
	try {
		const { conversationId, message, language = "en" } = await req.json();
		if (!message || typeof message !== "string") {
			return new Response("Invalid message", { status: 400 });
		}

		// Persist user message
		let convId = conversationId;
		if (!convId) {
			const { data: conv } = await supabaseAdmin.from("conversations").insert({}).select("id").single();
			convId = conv?.id;
		}
		await supabaseAdmin.from("messages").insert({
			conversation_id: convId,
			role: "user",
			content: message
		});

		// Get conversation history for context
		const { data: history } = await supabaseAdmin
			.from("messages")
			.select("role, content")
			.eq("conversation_id", convId)
			.order("created_at", { ascending: true })
			.limit(20);

		// RAG retrieve
		const results = await searchKnowledge(message, 5);
		const context = buildContext(results as any);
		
		// Build language-aware system prompt
		const languageInstruction = language === "es" 
			? "\n\nIMPORTANT: Respond in Mexican Spanish (español mexicano). Be fluent, natural, and culturally appropriate for Mexican Spanish speakers. When the user says 'Hola' as their FIRST message, greet them warmly as Addie and ask how you can help with their auto accident situation."
			: "\n\nIMPORTANT: Respond in English. When the user says 'Hello' as their FIRST message, greet them warmly as Addie and ask how you can help with their auto accident situation.";
		
		const system = `${ALLIE_SYSTEM_PROMPT}${languageInstruction}\n\nKnowledge context (may be partial):\n${context}`;

		// Build messages array with history
		const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
			{ role: "system", content: system }
		];
		
		// Add conversation history (excluding the current message which is already added)
		if (history && history.length > 0) {
			history.slice(0, -1).forEach((msg: any) => {
				if (msg.role === "user" || msg.role === "assistant") {
					messages.push({ role: msg.role, content: msg.content });
				}
			});
		}
		
		// Add current user message
		messages.push({ role: "user", content: message });

		const streamRes = await openai.chat.completions.create({
			model: "gpt-4o-mini",
			messages,
			temperature: 0.3,
			stream: true
		});

		const encoder = new TextEncoder();
		const readable = new ReadableStream({
			async start(controller) {
				let assistantText = "";
				for await (const chunk of streamRes) {
					const delta = chunk.choices?.[0]?.delta?.content ?? "";
					if (delta) {
						assistantText += delta;
						controller.enqueue(encoder.encode(delta));
					}
				}
				// Persist assistant message
				await supabaseAdmin.from("messages").insert({
					conversation_id: convId,
					role: "assistant",
					content: assistantText
				});
				controller.close();
			}
		});
		return new Response(readable, {
			headers: { "Content-Type": "text/plain; charset=utf-8" }
		});
	} catch (e) {
		return new Response("Chat error", { status: 500 });
	}
}


