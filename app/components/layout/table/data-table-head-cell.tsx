import { TableHead } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { flexRender, type Header, type RowData } from "@tanstack/react-table";
import { useMemo } from "react";

export default function DataTableHeadCell<T extends RowData>({
	header,
	index,
	totalHeaders,
}: {
	header: Header<T, unknown>;
	index: number;
	totalHeaders: number;
}) {
	const { column } = header;
	const { meta } = header.column.columnDef as any;

	const cellStyles = useMemo(() => {
		const { style, ...cellMeta } =
			typeof meta?.headerCellProps === "function"
				? meta.headerCellProps(header.getContext())
				: (meta?.headerCellProps ?? { style: {} });

		const baseClasses = cn(
			"text-left",
			index === 0 && "rounded-tl-lg",
			index === totalHeaders - 1 && "rounded-tr-lg",
			style
		);

		return {
			className: baseClasses,
			style,
			...cellMeta,
		};
	}, [header, index, totalHeaders, column, meta]);

	return (
		<TableHead
			{...cellStyles}
			style={{
				//@ts-ignore
				...header.column.columnDef.meta?.headerCellProps?.style,
				//...getCommonPinningStyles(header.column),
			}}
		>
			<div className="flex flex-col justify-between items-stretch font-sans font-bold">
				{flexRender(header.column.columnDef.header, header.getContext())}
			</div>
		</TableHead>
	);
}
