import {
	useDeleteParticipantTourGroup,
	type ParticipantsType,
} from "@/api/tour";
import CellText from "@/components/layout/table/data-table-cell";
import type { ColumnDef, Row, Table } from "@tanstack/react-table";
import { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import DialogDelete from "@/components/custom/dialog/dialog-delete";
import { enqueueSnackbar } from "notistack";
import DialogDetailsVisitor from "../components/dialog-details-visitor";
import DialogFormVisitor from "../components/dialog-form-visitor";

export const dataParticipantsColumn: ColumnDef<ParticipantsType>[] = [
	{
		accessorKey: "no",
		header: "No",
		cell: ({ cell }) => {
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
					minWidth: 80,
				},
			},
		},
	},
	{
		accessorKey: "name",
		header: "Full Name",
		cell: ({ row }) => (
			<CellText className="text-left flex flex-row justify-between">
				{row?.original?.name || "-"}{" "}
				{row?.original?.is_leader && (
					<div className="bg-red-500 px-2 text-xs py-1 text-white rounded-sm">
						Leader
					</div>
				)}
			</CellText>
		),
		meta: {
			headerCellProps: {
				style: {
					minWidth: 200,
				},
			},
		},
	},
	{
		accessorKey: "phone",
		header: "Phone Number",
		cell: ({ row }) => (
			<CellText className="text-left">
				{row?.original?.phone_number || "-"}
			</CellText>
		),
		meta: {
			headerCellProps: {
				style: {
					minWidth: 200,
				},
			},
		},
	},
	{
		accessorKey: "email",
		header: "Email Address",
		cell: ({ row }) => (
			<CellText className="text-left flex flex-row gap-2 items-center">
				{row?.original?.email || "-"}{" "}
				{row?.original?.verified_at && (
					<Icon icon="gg:check-o" width="16" height="16" color="green" />
				)}
			</CellText>
		),
		meta: {
			headerCellProps: {
				style: {
					minWidth: 200,
				},
			},
		},
	},
	{
		accessorKey: "difabel",
		header: "Special Needs",
		cell: ({ row }) => (
			<CellText className="text-left">
				{row?.original?.is_special_need ? "Yes" : "No"}
			</CellText>
		),
		meta: {
			headerCellProps: {
				style: {
					minWidth: 200,
				},
			},
		},
	},
	{
		accessorKey: "ACTION_BUTTON",
		header: "Action",

		cell: ({ row, table }) => <ActionCell row={row} table={table} />,

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
	row: Row<ParticipantsType>;
	table: Table<ParticipantsType>;
}) => {
	const [openDelete, setOpenDelete] = useState(false);
	const [openUpdate, setOpenUpdate] = useState(false);
	const { mutate: mutateDelete } = useDeleteParticipantTourGroup();

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
			{/* <DialogDetailsVisitor
				open={openUpdate}
				onClose={() => {
					setOpenUpdate(false);
				}}
				data={row.original}
				// isDisabled={}
			/> */}

			<DialogFormVisitor
				open={openUpdate}
				onClose={() => {
					setOpenUpdate(false);
				}}
				refetch={() => {
					table.resetPageIndex();
				}}
				data={row.original}
			/>
			{/* <DialogBanner
				open={openUpdate}
				onClose={() => setOpenUpdate(false)}
				refetch={() => {
					table.resetPageIndex();
				}}
				data={row.original}
			/> */}
		</div>
	);
};
