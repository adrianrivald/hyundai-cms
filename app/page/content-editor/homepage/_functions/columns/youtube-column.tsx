import CellText from "@/components/layout/table/data-table-cell";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import type { ColumnDef, Row, Table } from "@tanstack/react-table";
import { useState } from "react";
import DialogYoutube from "../components/dialog-youtube";
import type { GlobalVariableTypes } from "@/types/GlobalVariableTypes";
import DialogDelete from "@/components/custom/dialog/dialog-delete";
import { enqueueSnackbar } from "notistack";
import { useDeleteGlobalVariable } from "@/api/global-variable";

export const dataYoutubeColumn: ColumnDef<GlobalVariableTypes>[] = [
	{
		accessorKey: "title",
		header: "Judul",
		cell: ({ row }) => (
			<CellText className="text-left">
				{row?.original?.description || "-"}
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
		accessorKey: "link",
		header: "Youtube Link",
		cell: ({ row }) => (
			<CellText className="">{row?.original?.var_value || "-"}</CellText>
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
			const [openYoutube, setOpenYoutube] = useState(false);

			const hasVarValue = table
				.getRowModel()
				.rows.some((row) => !!row.original.var_value);
			return (
				<>
					<Button
						disabled={hasVarValue}
						onClick={() => {
							setOpenYoutube(true);
						}}
						className="bg-amber-500 hover:bg-amber-600 my-2  w-[120px]"
						startIcon={<Icon icon="ic:sharp-plus" width="16" height="16" />}
					>
						Tambah
					</Button>

					<DialogYoutube
						open={openYoutube}
						onClose={() => setOpenYoutube(false)}
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
	row: Row<GlobalVariableTypes>;
	table: Table<GlobalVariableTypes>;
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
					enqueueSnackbar("Data telah diubah", {
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
			<DialogYoutube
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
