import { cn } from "@/lib/utils";
import React from "react";

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
	container?: boolean;
	item?: boolean;
	spacing?: number;
	xs?: number;
	sm?: number;
	md?: number;
	lg?: number;
	xl?: number;
	direction?: "row" | "row-reverse" | "column" | "column-reverse";
	justifyContent?:
		| "start"
		| "end"
		| "center"
		| "stretch"
		| "space-between"
		| "space-around"
		| "space-evenly";
	alignItems?: "start" | "end" | "center" | "stretch" | "baseline";
}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
	(
		{
			container,
			item,
			spacing = 0,
			xs,
			sm,
			md,
			lg,
			xl,
			direction,
			justifyContent,
			alignItems,
			className,
			children,
			...props
		},
		ref
	) => {
		const gridClasses = cn(
			// Container styles
			container && [
				"grid grid-cols-12",
				direction === "row-reverse" && "grid-flow-dense",
				direction?.includes("column") && "grid-flow-col",
				justifyContent && `justify-${justifyContent}`,
				alignItems && `items-${alignItems}`,
				spacing > 0 && `gap-${spacing}`,
			],
			// Item styles with proper responsive classes
			item && [
				//"col-span-12", // Default full width
				xs && `col-span-${xs || 12}`,
				sm && `sm:col-span-${sm}`,
				md && `md:col-span-${md}`,
				lg && `lg:col-span-${lg}`,
				xl && `xl:col-span-${xl}`,
			],
			className
		);

		return (
			<div ref={ref} className={gridClasses} {...props}>
				{children}
			</div>
		);
	}
);

Grid.displayName = "Grid";
