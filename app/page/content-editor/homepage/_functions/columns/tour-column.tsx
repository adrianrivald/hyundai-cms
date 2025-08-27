import CellText from "@/components/layout/table/data-table-cell";
import { Button } from "@/components/ui/button";

import type { AlbumTypes } from "@/types/PostTypes";
import { Icon } from "@iconify/react/dist/iconify.js";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const dataTourColumn: ColumnDef<AlbumTypes>[] = [
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
		header: "Nama Tour",
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
		header: "Peserta",
		cell: ({ row }) => <CellText className="text-left">10 - 40</CellText>,
		meta: {
			cellProps: {
				style: {
					minWidth: 70,
					maxWidth: 70,
				},
			},
		},
	},
	{
		accessorKey: "title",
		header: "Pabrik",
		cell: ({ row }) => <CellText className="text-left">HMMI</CellText>,
		meta: {
			cellProps: {
				style: {
					minWidth: 90,
					maxWidth: 90,
				},
			},
		},
	},
	{
		accessorKey: "title",
		header: "Jml Rute",
		cell: ({ row }) => <CellText className="text-left">5</CellText>,
		meta: {
			cellProps: {
				style: {
					minWidth: 70,
					maxWidth: 70,
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
