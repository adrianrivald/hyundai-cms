import { Table } from "@/components/ui/table";
import type { RowData, Table as TableType } from "@tanstack/react-table";
import DataTableHead from "./data-table-head";
import { DataTableBody } from "./data-table-body";
import { DataTablePagination } from "./data-table-pagination";

export type PaginationProps = {
	hidePagination?: boolean;
	hidePageNavigation?: boolean;
	hidePageSizeOptions?: boolean;
	hasNextPage?: boolean;
	hasPreviousPage?: boolean;
	nextPageNumber?: number;
	pageSize?: number;
	previousPageNumber?: number;
	pageSizeOptions?: number[];
	totalItems?: number;
	totalPages?: number;
	allItemCount?: number;
};

type Props<T extends RowData> = {
	table: TableType<T>;
	pagination?: PaginationProps;
	onRowClick?: (row: T) => void;
	showPagination?: boolean;
};

export function DataTable<T extends RowData>({
	table,
	pagination,
	onRowClick,
	showPagination = true,
}: Props<T>) {
	return (
		<div className="">
			<Table className="">
				<DataTableHead headerGroups={table.getHeaderGroups()} />
				<DataTableBody table={table} onRowClick={onRowClick} />
			</Table>
			{showPagination && (
				<DataTablePagination table={table} pagination={pagination} />
			)}
		</div>
	);
}
