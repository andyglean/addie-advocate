import { useEffect, useRef } from "react";

export type ChatMessage = { id: string; role: "user" | "assistant"; content: string };

export function MessageList({ messages }: { messages: ChatMessage[] }) {
	const bottomRef = useRef<HTMLDivElement | null>(null);
	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);
	
	return (
		<div className="h-[60vh] overflow-y-auto p-4 bg-gray-50 rounded-lg">
			<div className="space-y-4">
				{messages.map((m) => (
					<div
						key={m.id}
						className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
					>
						<div className={`flex gap-3 max-w-[80%] ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
							{/* Avatar for Addie only */}
							{m.role === "assistant" && (
								<div className="flex-shrink-0">
									<div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white font-semibold">
										A
									</div>
								</div>
							)}
							
							{/* Message bubble */}
							<div className="flex flex-col">
								<div
									className={`px-4 py-3 rounded-2xl ${
										m.role === "user"
											? "bg-blue-600 text-white rounded-tr-sm"
											: "bg-white text-gray-800 rounded-tl-sm shadow-sm"
									}`}
								>
									<div className="whitespace-pre-wrap text-sm leading-relaxed">
										{m.content}
									</div>
								</div>
								{/* Timestamp placeholder - could add real timestamps later */}
							</div>
							
							{/* User icon */}
							{m.role === "user" && (
								<div className="flex-shrink-0">
									<div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white">
										<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
											<path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
										</svg>
									</div>
								</div>
							)}
						</div>
					</div>
				))}
				<div ref={bottomRef} />
			</div>
		</div>
	);
}

