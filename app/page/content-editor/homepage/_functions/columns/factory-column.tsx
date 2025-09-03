import CellText from "@/components/layout/table/data-table-cell";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import type { ColumnDef, Row, Table } from "@tanstack/react-table";
import { useState } from "react";
import DialogFactory from "../components/dialog-factory";
import { useDeleteFactory, type FactoryType } from "@/api/factory";
import DialogDelete from "@/components/custom/dialog/dialog-delete";
import { enqueueSnackbar } from "notistack";

export const dataFactoryColumn: ColumnDef<FactoryType>[] = [
	{
		accessorKey: "image_path",
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
		accessorKey: "name",
		header: "Nama Pabrik",
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
		accessorKey: "description",
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
					<DialogFactory
						open={open}
						onClose={() => setOpen(false)}
						refetch={() => {
							table.resetPageIndex();
						}}
					/>
				</>
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
	row: Row<FactoryType>;
	table: Table<FactoryType>;
}) => {
	const [openDelete, setOpenDelete] = useState(false);
	const [openUpdate, setOpenUpdate] = useState(false);
	const { mutate: mutateDelete } = useDeleteFactory();

	const onDelete = () => {
		mutateDelete(
			{ id: row.original.id || "" },
			{
				onSuccess: () => {
					setOpenDelete(false);
					enqueueSnackbar("Data telah dihapus", {
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
			<DialogFactory
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
