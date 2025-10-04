import CellText from "@/components/layout/table/data-table-cell";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import type { ColumnDef, Row, Table } from "@tanstack/react-table";
import { useState } from "react";
import DialogDelete from "@/components/custom/dialog/dialog-delete";
import { enqueueSnackbar } from "notistack";
import { format, isValid } from "date-fns";
import DialogFeedback from "../components/dialog-feedback";
import { useDeleteFeedback } from "@/api/feedback";

export type FeedbackColumnType = {
	name: string;
	uri: string;
	is_publish: number;
	published_at: string;
	id: number;
};

export const dataFeedbackColumn: ColumnDef<FeedbackColumnType>[] = [
	{
		accessorKey: "name",
		header: "Name",
		cell: ({ row }) => <CellText className="">{row.original?.name}</CellText>,
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
		accessorKey: "published_at",
		header: "Publish Date",
		cell: ({ row }) => (
			<CellText>
				{row?.original?.published_at &&
				isValid(new Date(row.original?.published_at))
					? format(row.original?.published_at, "dd/MM/yyyy")
					: "-"}
			</CellText>
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
		header: "Action",
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
						Add
					</Button>
					<DialogFeedback
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
					minWidth: 90,
					maxWidth: 95,
				},
			},
		},
	},
];

const ActionCell = ({
	row,
	table,
}: {
	row: Row<FeedbackColumnType>;
	table: Table<FeedbackColumnType>;
}) => {
	const [openDelete, setOpenDelete] = useState(false);
	const [openUpdate, setOpenUpdate] = useState(false);
	const { mutate: mutateDelete } = useDeleteFeedback();

	const onDelete = () => {
		mutateDelete(
			{ id: String(row.original.id) || "" },
			{
				onSuccess: () => {
					setOpenDelete(false);
					enqueueSnackbar("Data has been deleted", {
						variant: "success",
					});
					table.resetPageIndex();
				},
				onError: (err: any) => {
					enqueueSnackbar(`Error : ${err.response?.data?.message}`, {
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
			<DialogFeedback
				open={openUpdate}
				onClose={() => setOpenUpdate(false)}
				id={row?.original?.id}
				refetch={() => {
					table.resetPageIndex();
				}}
			/>
		</div>
	);
};
