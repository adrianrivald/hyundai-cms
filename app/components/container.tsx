import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
	className?: string;
}

const Container = ({ children, className, ...props }: ContainerProps) => {
	return (
		<div className={cn("py-3 my-5 h-full", className)} {...props}>
			{children}
		</div>
	);
};

export default Container;
