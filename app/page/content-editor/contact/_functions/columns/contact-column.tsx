import CellText from "@/components/layout/table/data-table-cell";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import type { AlbumTypes } from "@/types/PostTypes";
import { Icon } from "@iconify/react/dist/iconify.js";
import type { ColumnDef, Row, Table } from "@tanstack/react-table";
import DialogContact from "../components/dialog-contact";
import { useState } from "react";
import type { ContactType } from "../models/contact";
import { useDeleteGlobalVariable } from "@/api/global-variable";
import DialogDelete from "@/components/custom/dialog/dialog-delete";
import DialogYoutube from "@/page/content-editor/homepage/_functions/components/dialog-youtube";
import type { GlobalVariableTypes } from "@/types/GlobalVariableTypes";
import { enqueueSnackbar } from "notistack";

export const dataContactColumn: ColumnDef<ContactType>[] = [
	{
		accessorKey: "title",
		header: "Phone",
		cell: ({ row }) => (
			<CellText className="text-left">{row?.original?.phone}</CellText>
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
		accessorKey: "email",
		header: "Email",
		cell: ({ row }) => <CellText className="">{row?.original?.email}</CellText>,
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
		accessorKey: "address",
		header: "Alamat",
		cell: ({ row }) => (
			<CellText className="">{row?.original?.address}</CellText>
		),
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
		cell: ({ row, table }) => <ActionCell table={table} row={row} />,
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
			const hasVarValue = table
				.getRowModel()
				.rows.some((row) => !!row.original.contact);
			return (
				<>
					<Button
						disabled={hasVarValue}
						onClick={() => setOpen(true)}
						className="bg-amber-500 hover:bg-amber-600 my-2 w-[120px]"
						startIcon={<Icon icon="ic:sharp-plus" width="16" height="16" />}
					>
						Tambah
					</Button>
					<DialogContact
						open={open}
						onClose={() => setOpen(false)}
						refetch={() => {
							table.resetPageIndex();
						}}
					/>
				</>
			);
		},
		cell: ({ row }) => {
			const [openUpdate, setOpenUpdate] = useState(false);
			let data: ContactType = {
				address: row.original?.address,
				id: row.original?.id,
				contact: row.original?.contact,
			};
			return (
				<div className="flex gap-2">
					<Typography
						className="text-blue-500 underline cursor-pointer"
						onClick={() => {
							setOpenUpdate(true);
						}}
					>
						Lihat Detail
					</Typography>

					<DialogContact
						open={openUpdate}
						onClose={() => setOpenUpdate(false)}
						isEditMode={true}
						data={data}
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
	row: Row<ContactType>;
	table: Table<ContactType>;
}) => {
	const [openDelete, setOpenDelete] = useState(false);
	const [openUpdate, setOpenUpdate] = useState(false);
	const { mutate: mutateDelete } = useDeleteGlobalVariable();

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
					enqueueSnackbar("Error: Hapus data gagal", {
						variant: "error",
					});
				},
			}
		);
	};

	let data: ContactType = {
		address: row.original?.address,
		id: row.original?.id,
		contact: row.original?.contact,
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
			<DialogContact
				open={openUpdate}
				onClose={() => setOpenUpdate(false)}
				refetch={() => {
					table.resetPageIndex();
				}}
				data={data}
			/>
		</div>
	);
};
