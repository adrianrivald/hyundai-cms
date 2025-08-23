import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface CellTextProps {
	color?: string;
	children?: ReactNode;
	className?: string;
}

const CellText = ({ color = "black", children, className }: CellTextProps) => {
	return (
		<div
			className={cn(
				"text-[12px] font-medium text-left py-2 overflow-hidden text-ellipsis font-sans",
				"line-clamp-2",
				className
			)}
			style={{ color }}
		>
			{children}
		</div>
	);
};

export default CellText;
