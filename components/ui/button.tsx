import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/utils";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: "default" | "outline" | "ghost";
	size?: "sm" | "md" | "lg";
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
	{ className, variant = "default", size = "md", ...props },
	ref
) {
	const variantClasses =
		variant === "default"
			? "bg-primary text-white hover:opacity-90"
			: variant === "outline"
			? "border border-slate-200 hover:bg-slate-50"
			: "hover:bg-slate-100";
	const sizeClasses =
		size === "sm" ? "h-8 px-3 text-sm" : size === "lg" ? "h-12 px-5" : "h-10 px-4";
	return (
		<button
			ref={ref}
			className={cn(
				"inline-flex items-center justify-center rounded-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed",
				variantClasses,
				sizeClasses,
				className
			)}
			{...props}
		/>
	);
});

