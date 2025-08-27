import { cn } from "@/lib/utils";
import type { ClassValue } from "clsx";
import { type ReactNode } from "react";

export const TabsList = ({
	children,
	className,
}: {
	children: ReactNode;
	className?: ClassValue;
}) => {
	return (
		<div
			className={cn(
				`flex w-full rounded-sm overflow-hidden bg-white border-b-3 `,
				className
			)}
		>
			{children}
		</div>
	);
};
