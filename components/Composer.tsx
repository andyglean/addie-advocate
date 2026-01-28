import { FormEvent, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function Composer({ onSend, disabled }: { onSend: (text: string) => void; disabled?: boolean }) {
	const [text, setText] = useState("");
	function submit(e: FormEvent) {
		e.preventDefault();
		const t = text.trim();
		if (!t) return;
		onSend(t);
		setText("");
	}
	return (
		<form onSubmit={submit} className="flex gap-2">
			<Input
				placeholder="Ask about Texas auto accidents..."
				value={text}
				onChange={(e) => setText(e.target.value)}
				disabled={!!disabled}
			/>
			<Button type="submit" disabled={!!disabled}>
				Send
			</Button>
		</form>
	);
}

