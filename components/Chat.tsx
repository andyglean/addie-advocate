"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Composer } from "./Composer";
import { MessageList, type ChatMessage } from "./MessageList";

interface ChatPanelProps {
	language?: string;
	initialMessage?: string;
}

export function ChatPanel({ language = "en", initialMessage }: ChatPanelProps) {
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [isSending, setIsSending] = useState(false);
	const conversationId = useMemo(() => "local", []);
	const hasInitialized = useRef(false);

	// Add initial welcome message when component mounts
	useEffect(() => {
		if (initialMessage && !hasInitialized.current) {
			hasInitialized.current = true;
			const welcomeMessage: ChatMessage = {
				id: crypto.randomUUID(),
				role: "assistant",
				content: initialMessage
			};
			setMessages([welcomeMessage]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const send = useCallback(async (text: string) => {
		const userMessage: ChatMessage = {
			id: crypto.randomUUID(),
			role: "user",
			content: text
		};
		setMessages((m) => [...m, userMessage]);
		setIsSending(true);
		try {
			const res = await fetch("/api/chat", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ conversationId, message: text, language })
			});
			if (!res.ok || !res.body) {
				throw new Error("Chat error");
			}
			const reader = res.body.getReader();
			const decoder = new TextDecoder();
			let assistantContent = "";
			const assistantId = crypto.randomUUID();
			setMessages((m) => [...m, { id: assistantId, role: "assistant", content: "" }]);
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				assistantContent += decoder.decode(value, { stream: true });
				setMessages((m) =>
					m.map((msg) => (msg.id === assistantId ? { ...msg, content: assistantContent } : msg))
				);
			}

			// Check if response should be split into multiple messages
			if (assistantContent.includes('|||SPLIT|||')) {
				const parts = assistantContent.split('|||SPLIT|||');
				const messages: ChatMessage[] = [];
				
				parts.forEach((part, index) => {
					const trimmedPart = part.trim();
					if (trimmedPart) {
						messages.push({
							id: index === 0 ? assistantId : crypto.randomUUID(),
							role: "assistant",
							content: trimmedPart
						});
					}
				});
				
				setMessages((m) => {
					const withoutTemp = m.filter(msg => msg.id !== assistantId);
					return [...withoutTemp, ...messages];
				});
				assistantContent = parts.join('\n\n'); // For notification parsing below
			}

			// Check if response contains lead notification trigger
			if (assistantContent.includes('LEAD_NOTIFICATION:')) {
				const match = assistantContent.match(/LEAD_NOTIFICATION:\s*({[\s\S]*?})/);
				if (match && match[1]) {
					try {
						const leadData = JSON.parse(match[1]);
						// Send notification in background
						fetch('/api/notify-lead', {
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({
								...leadData,
								conversationId
							})
						}).catch(err => console.error('Failed to send lead notification:', err));
						
						// Remove the trigger from displayed message
						const cleanContent = assistantContent.replace(/LEAD_NOTIFICATION:\s*{[\s\S]*?}/, '').trim();
						setMessages((m) =>
							m.map((msg) => (msg.id === assistantId ? { ...msg, content: cleanContent } : msg))
						);
					} catch (e) {
						console.error('Failed to parse lead notification:', e);
					}
				}
			}
		} catch (e) {
			setMessages((m) => [
				...m,
				{ id: crypto.randomUUID(), role: "assistant", content: "Sorry, I had trouble responding." }
			]);
		} finally {
			setIsSending(false);
		}
	}, [conversationId, language]);

	return (
		<div className="space-y-3">
			<MessageList messages={messages} />
			<Composer onSend={send} disabled={isSending} />
		</div>
	);
}

