import CellText from "@/components/layout/table/data-table-cell";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import type { AlbumTypes } from "@/types/PostTypes";
import { Icon } from "@iconify/react/dist/iconify.js";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import DialogLegal from "../components/dialog-legal";

export const dataLegalColumn: ColumnDef<AlbumTypes>[] = [
	{
		accessorKey: "title",
		header: "Judul",
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
		header: "Main Content",
		cell: ({ row }) => (
			<CellText className="text-pretty line-clamp-none">
				{row.original?.title} lorem ipsum dolor sit amet lorem ipsum dolor sit
				amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum
				dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet
				lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor
				sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem
				ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit
				amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum
				dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet{" "}
				lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor
				sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem
				ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit
				amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum
				dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet
				lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor
				sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem
				ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit
				amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum
				dolor sit amet{" "}
			</CellText>
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
		header: ({ table }) => {
			const [open, setOpen] = useState(false);

			return (
				<>
					<Button
						onClick={() => {
							setOpen(true);
						}}
						className="bg-amber-500 hover:bg-amber-600 my-2 w-[120px]"
						startIcon={<Icon icon="ic:sharp-plus" width="16" height="16" />}
					>
						Tambah
					</Button>

					<DialogLegal
						open={open}
						onClose={() => setOpen(false)}
						refetch={() => table.resetPageIndex()}
					/>
				</>
			);
		},
		cell: ({ row }) => (
			<div className="flex gap-2">
				<Typography className="text-blue-500 underline cursor-pointer">
					Lihat Detail
				</Typography>
			</div>
		),

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
