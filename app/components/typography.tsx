import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

export function H1({ children, className, ...props }: ComponentProps<"h1">) {
	return (
		<h1
			className={cn("scroll-m-20 text-2xl font-bold tracking-tight", className)}
			{...props}
		>
			{children}
		</h1>
	);
}

export function H2({ children, className, ...props }: ComponentProps<"h2">) {
	return (
		<h2
			className={cn(
				"scroll-m-20 pb-2 text-xl font-semibold tracking-tight first:mt-0",
				className
			)}
			{...props}
		>
			{children}
		</h2>
	);
}

export function H3({ children, className, ...props }: ComponentProps<"h3">) {
	return (
		<h3
			className={cn(
				"scroll-m-20 text-lg font-semibold tracking-tight",
				className
			)}
			{...props}
		>
			{children}
		</h3>
	);
}

export function H4({ children, className, ...props }: ComponentProps<"h4">) {
	return (
		<h4
			className={cn(
				"scroll-m-20 text-base font-semibold tracking-tight",
				className
			)}
			{...props}
		>
			{children}
		</h4>
	);
}

export function P({ children, className, ...props }: ComponentProps<"p">) {
	return (
		<p
			className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
			{...props}
		>
			{children}
		</p>
	);
}

export function Blackquote({
	children,
	className,
	...props
}: ComponentProps<"blockquote">) {
	return (
		<blockquote
			className={cn("mt-6 border-l-2 pl-6 italic", className)}
			{...props}
		>
			"{children}"
		</blockquote>
	);
}

export function Code({
	children,
	className,
	...props
}: ComponentProps<"code">) {
	return (
		<code
			className={cn(
				"relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
				className
			)}
			{...props}
		>
			{children}
		</code>
	);
}

export function Lead({ children, className, ...props }: ComponentProps<"p">) {
	return (
		<p className={cn("text-xl text-muted-foreground", className)} {...props}>
			{children}
		</p>
	);
}

export function Large({
	children,
	className,
	...props
}: ComponentProps<"div">) {
	return (
		<div className={cn("text-lg font-semibold", className)} {...props}>
			{children}
		</div>
	);
}

export function Small({
	children,
	className,
	...props
}: ComponentProps<"small">) {
	return (
		<small
			className={cn("text-sm font-medium leading-none", className)}
			{...props}
		>
			{children}
		</small>
	);
}

export function Muted({ children, className, ...props }: ComponentProps<"p">) {
	return (
		<p className={cn("text-sm text-muted-foreground", className)} {...props}>
			{children}
		</p>
	);
}

export function Typography({
	children,
	className,
	...props
}: ComponentProps<"div">) {
	return (
		<div className={cn("text-md font-sans font-normal", className)} {...props}>
			{children}
		</div>
	);
}
