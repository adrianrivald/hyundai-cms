import { TableCell } from "@/components/ui/table";
import { pxToVw } from "@/lib/px-to-viewport";
import { cn } from "@/lib/utils";
import type { HeaderGroup, RowData } from "@tanstack/react-table";
import type { ReactNode } from "react";

type DataTableBodyCellEmptyProps<T> = {
	emptyRows: number;
	headerGroups: HeaderGroup<T>[];
	children: ReactNode;
};

const ROW_HEIGHT = 32;

export function DataTableBodyCellEmpty<T extends RowData>({
	children,
	emptyRows,
	headerGroups,
}: DataTableBodyCellEmptyProps<T>) {
	return (
		<TableCell
			colSpan={Number(headerGroups[0].headers.length)}
			style={{
				height: pxToVw(ROW_HEIGHT * emptyRows),
			}}
			className={cn(
				"bg-white text-center text-base font-semibold",
				emptyRows > 0 && `h-[${pxToVw(ROW_HEIGHT * emptyRows)}]`
			)}
		>
			{children}
		</TableCell>
	);
}
