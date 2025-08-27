import CellText from "@/components/layout/table/data-table-cell";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import type { AlbumTypes } from "@/types/PostTypes";
import { Icon } from "@iconify/react/dist/iconify.js";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const dataWhistleblower: ColumnDef<AlbumTypes>[] = [
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
		header: "Kode Laporan",
		cell: ({ row }) => (
			<CellText className="text-left">{row?.original?.title || "-"}</CellText>
		),
		meta: {
			cellProps: {
				style: {
					minWidth: 150,
					maxWidth: 155,
				},
			},
		},
	},
	{
		accessorKey: "completed",
		header: "Lampiran",
		cell: ({ row }) => <CellText className="">{row.original?.title}</CellText>,
		meta: {
			cellProps: {
				style: {
					minWidth: 80,
					maxWidth: 80,
				},
			},
		},
	},
	{
		accessorKey: "completed",
		header: "Jenis Pelanggaran",
		cell: ({ row }) => <CellText className="">{row.original?.title}</CellText>,
		meta: {
			cellProps: {
				style: {
					minWidth: 115,
					maxWidth: 120,
				},
			},
		},
	},
	{
		accessorKey: "completed",
		header: "Departemen",
		cell: ({ row }) => <CellText className="">{row.original?.title}</CellText>,
		meta: {
			cellProps: {
				style: {
					minWidth: 140,
					maxWidth: 145,
				},
			},
		},
	},
	{
		accessorKey: "completed",
		header: "Uraian Pengaduan",
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
		header: "Alat Bukti",
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
		header: "Kontak Pelapor",
		cell: ({ row }) => <CellText className="">{row.original?.title}</CellText>,
		meta: {
			cellProps: {
				style: {
					minWidth: 230,
					maxWidth: 240,
				},
			},
		},
	},
	{
		accessorKey: "completed",
		header: "Tanggal Pembuatan",
		cell: ({ row }) => (
			<CellText className="">{format(new Date(), "dd/MM/yyyy")}</CellText>
		),
		meta: {
			cellProps: {
				style: {
					minWidth: 150,
					maxWidth: 155,
				},
			},
		},
	},
	{
		accessorKey: "completed",
		header: "Status",
		cell: ({ row }) => <CellText className="">{row.original?.title}</CellText>,
		meta: {
			cellProps: {
				style: {
					minWidth: 140,
					maxWidth: 145,
				},
			},
		},
	},

	{
		accessorKey: "completed",
		header: "Aksi",
		cell: ({ row }) => (
			<div className="flex gap-2">
				<Typography className="text-blue-500 underline cursor-pointer">
					Lihat Detail
				</Typography>
			</div>
		),
		meta: {
			cellProps: {
				style: {
					minWidth: 140,
				},
			},
		},
	},
];
