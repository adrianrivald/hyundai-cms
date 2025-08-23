import CellText from "@/components/layout/table/data-table-cell";
import type { AlbumTypes } from "@/types/PostTypes";
import type { ColumnDef } from "@tanstack/react-table";

export const dataAlbumColumn: ColumnDef<AlbumTypes>[] = [
	{
		accessorKey: "no",
		header: "No",
		cell: ({ cell, table }) => {
			//const pageSize = table.getState().pagination.pageSize
			// const pageIndex = table.getState().pagination.pageIndex
			const index = cell.row.index; //+ 1 + pageIndex * pageSize
			return index;
		},
		meta: {
			filterComponent: () => {
				return null;
			},
			headerCellProps: {
				style: {
					minWidth: 80,
				},
			},
		},
	},
	{
		accessorKey: "title",
		header: "Title",
		cell: ({ row }) => (
			<CellText className="text-left">{row?.original?.title || "-"}</CellText>
		),
		meta: {
			headerCellProps: {
				style: {
					minWidth: 200,
				},
			},
		},
	},
	{
		accessorKey: "completed",
		header: "Completed",
		cell: ({ row }) => (
			<CellText className="text-left">
				{row?.original?.completed || "-"}
			</CellText>
		),
		meta: {
			headerCellProps: {
				style: {
					minWidth: 100,
				},
			},
		},
	},
];
