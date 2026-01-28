import { supabaseAdmin } from "./supabase";
import { openai } from "./openai";

export async function embedText(text: string): Promise<number[]> {
	const res = await openai.embeddings.create({
		model: "text-embedding-3-small",
		input: text
	});
	return res.data[0].embedding as unknown as number[];
}

export async function searchKnowledge(query: string, topK = 5) {
	const embedding = await embedText(query);
	// Using cosine similarity via pgvector <-> operator
	const { data, error } = await supabaseAdmin.rpc("match_knowledge", {
		query_embedding: embedding,
		similarity_threshold: 0.2,
		match_count: topK
	});
	if (error) {
		// Fallback to naive fetch if RPC not created yet
		const { data: naive } = await supabaseAdmin
			.from("knowledge_chunks")
			.select("id, source, chunk")
			.limit(topK);
		return naive ?? [];
	}
	return data ?? [];
}

export function buildContext(chunks: Array<{ source: string; chunk: string }>) {
	return chunks
		.map((c) => `Source: ${c.source}\n---\n${c.chunk}`)
		.join("\n\n");
}


