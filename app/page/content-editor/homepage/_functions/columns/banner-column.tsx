import CellText from "@/components/layout/table/data-table-cell";
import { Button } from "@/components/ui/button";

import type { AlbumTypes } from "@/types/PostTypes";
import { Icon } from "@iconify/react/dist/iconify.js";
import type { ColumnDef, Row, Table } from "@tanstack/react-table";
import { format } from "date-fns";
import DialogBanner from "../components/dialog-banner";
import { useState } from "react";
import type { BannerType } from "../models/banner";
import DialogDelete from "@/components/custom/dialog/dialog-delete";
import { useDeleteBanner } from "@/api/banner";
import { enqueueSnackbar } from "notistack";

export const dataBannerColumn: ColumnDef<BannerType>[] = [
	{
		accessorKey: "title",
		header: "Gambar",
		cell: ({ row }) => (
			<CellText className="text-left">
				<img
					src={row?.original?.image_path || "-"}
					className="h-[30px] w-[85px] object-cover"
				/>
			</CellText>
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
		cell: ({ row }) => <CellText className="">{row.original?.name}</CellText>,
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
			<CellText className="text-left">
				{row?.original?.description || "-"}
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
		accessorKey: "title",
		header: "Tanggal Terbit",
		cell: ({ row }) => (
			<CellText className="text-left">
				{format(row.original?.published_at, "dd/MM/yyyy")}
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
						className="bg-amber-500 hover:bg-amber-600 my-2 w-[120px]"
						startIcon={<Icon icon="ic:sharp-plus" width="16" height="16" />}
					>
						Tambah
					</Button>

					<DialogBanner
						open={open}
						onClose={() => setOpen(false)}
						refetch={() => {
							table.resetPageIndex();
						}}
					/>
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
	row: Row<BannerType>;
	table: Table<BannerType>;
}) => {
	const [openDelete, setOpenDelete] = useState(false);
	const [openUpdate, setOpenUpdate] = useState(false);
	const { mutate: mutateDelete } = useDeleteBanner();

	const onDelete = () => {
		mutateDelete(
			{ id: row.original.id || "" },
			{
				onSuccess: () => {
					setOpenDelete(false);
					enqueueSnackbar("Data telah diubah", {
						variant: "success",
					});
					table.resetPageIndex();
				},
				onError: () => {
					enqueueSnackbar("Error: Hapus banner gagal", {
						variant: "error",
					});
					table.resetPageIndex();
				},
			}
		);
	};

	return (
		<div className="flex gap-2">
			<div
				className="cursor-pointer"
				onClick={() => {
					setOpenUpdate(true);
				}}
			>
				<Icon
					icon="basil:edit-outline"
					width="24"
					height="24"
					color="#153263"
				/>
			</div>
			<div className="cursor-pointer" onClick={() => setOpenDelete(true)}>
				<Icon icon="mage:trash" width="24" height="24" color="#FF3B30" />
			</div>

			<DialogDelete
				open={openDelete}
				onClose={() => {
					setOpenDelete(false);
				}}
				onSubmit={() => {
					onDelete();
				}}
			/>
			<DialogBanner
				open={openUpdate}
				onClose={() => setOpenUpdate(false)}
				refetch={() => {
					table.resetPageIndex();
				}}
				data={row.original}
			/>
		</div>
	);
};
