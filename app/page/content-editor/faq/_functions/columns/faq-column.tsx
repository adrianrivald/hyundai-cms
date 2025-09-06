import CellText from "@/components/layout/table/data-table-cell";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import type { ColumnDef, Row, Table } from "@tanstack/react-table";
import DialogContact from "../components/dialog-faq";
import { useState } from "react";
import { useDeleteGlobalVariable } from "@/api/global-variable";
import DialogDelete from "@/components/custom/dialog/dialog-delete";
import { enqueueSnackbar } from "notistack";
import { useDeleteFaq, type FAQType } from "@/api/faq";

export const dataContactColumn: ColumnDef<FAQType>[] = [
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
		accessorKey: "question",
		header: "Question",
		cell: ({ row }) => (
			<div>
				<div>
					<Typography>{row?.original?.question_id}</Typography>
				</div>
				<div className="mt-3">
					<Typography>{row?.original?.question_en}</Typography>
				</div>
			</div>
		),
		meta: {
			cellProps: {
				style: {
					minWidth: 200,
					maxWidth: 205,
				},
			},
		},
	},
	{
		accessorKey: "answer",
		header: "Answer",
		cell: ({ row }) => (
			<div>
				<div>
					<Typography>{row?.original?.answer_id}</Typography>
				</div>
				<div className="mt-3">
					<Typography>{row?.original?.answer_en}</Typography>
				</div>
			</div>
		),
		meta: {
			cellProps: {
				style: {
					minWidth: 200,
					maxWidth: 205,
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

			return (
				<>
					<Button
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

		meta: {
			headerCellProps: {
				style: {
					minWidth: 80,
					maxWidth: 80,
				},
			},
		},
	},
];

const ActionCell = ({
	row,
	table,
}: {
	row: Row<FAQType>;
	table: Table<FAQType>;
}) => {
	const [openDelete, setOpenDelete] = useState(false);
	const [openUpdate, setOpenUpdate] = useState(false);
	const { mutate: mutateDelete } = useDeleteFaq();

	const onDelete = () => {
		mutateDelete(
			{ id: String(row.original.id) || "" },
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
				data={row.original}
			/>
		</div>
	);
};
