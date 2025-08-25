import { TableBody, TableRow } from "@/components/ui/table";
import type { Row, RowData, Table, TableMeta } from "@tanstack/react-table";
import { useMemo } from "react";
import { DataTableBodyCell } from "./data-table-body-cell";
import { DataTableBodyCellEmpty } from "./data-table-body-cell-empty";
import { DataTableCellSkeleton } from "./data-table-cell-skeleton";

const EmptyRows = <TData extends RowData>({
	table,
	emptyRows,
	emptyState,
}: {
	emptyRows: number;
	emptyState: TableMeta<TData> &
		{ emptyState: { label: string } }["emptyState"];
	table: Table<TData>;
}) => {
	const rows = table.getRowModel().rows;
	const headerGroups = table.getHeaderGroups();

	return (
		<TableRow>
			<DataTableBodyCellEmpty emptyRows={emptyRows} headerGroups={headerGroups}>
				{rows.length === 0 ? emptyState?.label : null}
			</DataTableBodyCellEmpty>
		</TableRow>
	);
};

const LoadingRows = <TData extends RowData>({
	emptyRows,
	table,
}: {
	emptyRows: number;
	table: Table<TData>;
}) => {
	const pageSize = table.getState().pagination.pageSize;
	const headerGroups = table.getHeaderGroups();

	return [...new Array(Math.max(emptyRows, pageSize))].map((_, i) => (
		<TableRow key={i}>
			<DataTableCellSkeleton
				cellLength={Number(headerGroups[0].headers.length)}
			/>
		</TableRow>
	));
};

export function DataTableBody<T extends RowData>({
	table,
	onRowClick,
}: {
	table: Table<T>;
	onRowClick?: (row: T) => void;
}) {
	const rows = table.getRowModel().rows;
	const pageSize = table.getState().pagination.pageSize;
	const { isLoading, emptyState } = (table.options.meta as {
		isLoading: boolean;
		emptyState: { label: string };
	}) ?? {
		emptyState: { label: "No Data" },
	};

	const rowProps = useMemo(() => {
		const { meta } = table.options as {
			meta?: TableMeta<T> & { rowProps: (row: Row<T>) => void };
		};

		return (row: Row<T>) => {
			const rowMeta =
				typeof meta?.rowProps === "function"
					? meta.rowProps(row)
					: (meta?.rowProps ?? {});

			return rowMeta;
		};
	}, [table.options]);

	const emptyRows =
		rows.length === 0 ? 10 : pageSize - Math.min(pageSize, pageSize);

	if (isLoading) {
		return (
			<TableBody>
				<LoadingRows emptyRows={emptyRows} table={table} />
			</TableBody>
		);
	}

	if (rows.length === 0) {
		return (
			<TableBody>
				<EmptyRows
					emptyState={emptyState}
					emptyRows={emptyRows}
					table={table}
				/>
			</TableBody>
		);
	}

	return (
		<TableBody>
			{rows.map((row, i) => (
				<TableRow
					key={i}
					{...rowProps(row)}
					className={`${onRowClick ? "cursor-pointer hover:bg-gray-200" : ""} `}
				>
					{row.getVisibleCells().map((cell) => {
						return (
							<DataTableBodyCell
								key={cell.id}
								cell={cell}
								onRowClick={() => {
									onRowClick?.(row.original);
								}}
							/>
						);
					})}
				</TableRow>
			))}
			{emptyRows > 0 ? (
				<EmptyRows
					emptyState={emptyState}
					emptyRows={emptyRows}
					table={table}
				/>
			) : null}
		</TableBody>
	);
}
