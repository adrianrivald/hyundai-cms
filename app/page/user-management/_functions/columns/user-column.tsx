import CellText from "@/components/layout/table/data-table-cell";
import { Button } from "@/components/ui/button";
import type { AlbumTypes } from "@/types/PostTypes";
import { Icon } from "@iconify/react/dist/iconify.js";
import type { ColumnDef } from "@tanstack/react-table";

export const dataUserManagementColumn: ColumnDef<AlbumTypes>[] = [
	{
		accessorKey: "no",
		header: "No",
		cell: ({ cell, table }) => {
			//const pageSize = table.getState().pagination.pageSize
			// const pageIndex = table.getState().pagination.pageIndex
			const index = cell.row.index + 1; //+ 1 + pageIndex * pageSize
			return <CellText className="text-left font-light">{index}</CellText>;
		},
		meta: {
			filterComponent: () => {
				return null;
			},
			headerCellProps: {
				style: {
					minWidth: 20,
				},
			},
		},
	},
	{
		accessorKey: "title",
		header: "Username",
		cell: ({ row }) => (
			<CellText className="text-left">{row?.original?.title || "-"}</CellText>
		),
		meta: {
			cellProps: {
				style: {
					minWidth: 120,
					maxWidth: 125,
				},
			},
		},
	},
	{
		accessorKey: "completed",
		header: "Email",
		cell: ({ row }) => <CellText className="">{row.original?.title}</CellText>,
		meta: {
			cellProps: {
				style: {
					minWidth: 170,
					maxWidth: 175,
				},
			},
		},
	},
	{
		accessorKey: "completed",
		header: "Role",
		cell: ({ row }) => <CellText className="">{row.original?.title}</CellText>,
		meta: {
			cellProps: {
				style: {
					minWidth: 190,
					maxWidth: 195,
				},
			},
		},
	},
	{
		accessorKey: "completed",
		header: "Aksi",
		cell: ({ row }) => (
			<div className="flex gap-2">
				<div className="cursor-pointer">
					<Icon
						icon="basil:edit-outline"
						width="24"
						height="24"
						color="#153263"
					/>
				</div>
				<div className="cursor-pointer">
					<Icon icon="mage:trash" width="24" height="24" color="#FF3B30" />
				</div>
			</div>
		),
		meta: {
			cellProps: {
				style: {
					minWidth: 80,
					maxWidth: 85,
				},
			},
		},
	},
	{
		accessorKey: "ACTION_BUTTON",
		header: () => {
			return (
				<Button
					className="bg-amber-500 hover:bg-amber-600 my-2"
					startIcon={<Icon icon="ic:sharp-plus" width="16" height="16" />}
				>
					Tambah
				</Button>
			);
		},

		meta: {
			headerCellProps: {
				style: {
					minWidth: 130,
					maxWidth: 135,
				},
			},
		},
	},
];
