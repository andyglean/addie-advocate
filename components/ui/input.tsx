import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/utils";

type Props = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
	{ className, ...props },
	ref
) {
	return (
		<input
			ref={ref}
			className={cn(
				"flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30",
				className
			)}
			{...props}
		/>
	);
});

