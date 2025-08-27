import CellText from "@/components/layout/table/data-table-cell";
import { Button } from "@/components/ui/button";

import type { AlbumTypes } from "@/types/PostTypes";
import { Icon } from "@iconify/react/dist/iconify.js";
import type { ColumnDef, Row, Table } from "@tanstack/react-table";
import { format } from "date-fns";
import DialogBanner from "../components/dialog-banner";
import { useState } from "react";

export const dataBannerColumn: ColumnDef<AlbumTypes>[] = [
	{
		accessorKey: "title",
		header: "Gambar",
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
		header: "Judul",
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
		accessorKey: "title",
		header: "Deskripsi",
		cell: ({ row }) => (
			<CellText className="text-left">{row?.original?.title || "-"}</CellText>
		),
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
		accessorKey: "title",
		header: "Tanggal Terbit",
		cell: ({ row }) => (
			<CellText className="text-left">
				{format(new Date(), "dd/MM/yyyy")}
			</CellText>
		),
		meta: {
			cellProps: {
				style: {
					minWidth: 100,
					maxWidth: 105,
				},
			},
		},
	},
	{
		accessorKey: "completed",
		header: "Aksi",
		cell: ({ row, table }) => <ActionCell row={row} table={table} />,
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
		header: ({ table }) => {
			const [open, setOpen] = useState(false);

			return (
				<div>
					<Button
						onClick={() => setOpen(true)}
						className="bg-amber-500 hover:bg-amber-600 my-2"
						startIcon={<Icon icon="ic:sharp-plus" width="16" height="16" />}
					>
						Tambah
					</Button>

					<DialogBanner open={open} onClose={() => setOpen(false)} />
				</div>
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

const ActionCell = ({
	row,
	table,
}: {
	row: Row<AlbumTypes>;
	table: Table<AlbumTypes>;
}) => {
	return (
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
	);
};
