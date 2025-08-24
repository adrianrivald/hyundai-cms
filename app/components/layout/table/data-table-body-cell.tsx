import { TableCell } from "@/components/ui/table";
//import {getCommonPinningStyles} from '@/lib/table-pinning-styles'
import { cn } from "@/lib/utils";
import { type Cell, type RowData, flexRender } from "@tanstack/react-table";
import { useMemo } from "react";

export function DataTableBodyCell<T extends RowData>({
	cell,
	onRowClick,
}: {
	cell: Cell<T, unknown>;
	onRowClick: () => void;
}) {
	const { column } = cell;
	const { meta } = column.columnDef as any;

	const cellProps = useMemo(() => {
		const {
			style = {},
			className = "",
			...restMeta
		} = typeof meta?.cellProps === "function"
			? meta.cellProps(cell.getContext())
			: (meta?.cellProps ?? {});

		const classes = cn("text-foreground font-medium py-2", className);

		return {
			className: classes,
			style,
			...restMeta,
		};
	}, [cell, column, meta]);

	return (
		<TableCell
			{...cellProps}
			style={{
				//@ts-ignore
				...cell.column.columnDef.meta?.headerCellProps?.style,
				//...getCommonPinningStyles(cell.column),
				backgroundColor:
					// @ts-ignore
					cell?.row?.original?.isDisable === true ? "#D3D3D3" : "white",
			}}
			onClick={() => {
				if (cell.column.id !== "ID_ACTION_COLUMN") {
					onRowClick();
				}
			}}
		>
			{flexRender(cell.column.columnDef.cell, cell.getContext())}
		</TableCell>
	);
}
