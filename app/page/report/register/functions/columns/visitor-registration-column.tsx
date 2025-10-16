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
import DialogDetailsVisitor from "@/page/calendar/functions/components/dialog-details-visitor";
import { Typography } from "@/components/typography";

export const VisitorRegistrationColumn: ColumnDef<ParticipantsType>[] = [
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
		header: "Special Needs?",
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

		cell: ({ row }) => {
			const [open, setOpen] = useState(false);
			return (
				<div className="flex gap-2">
					<Typography
						className="text-blue-500 underline cursor-pointer"
						onClick={() => {
							setOpen(true);
						}}
					>
						View Details
					</Typography>

					<DialogDetailsVisitor
						open={open}
						onClose={() => setOpen(false)}
						data={row.original}
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
