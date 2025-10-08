import type { FeedbackListTypes } from "@/api/feedback";
import CellText from "@/components/layout/table/data-table-cell";
import { Typography } from "@/components/typography";
import { cn } from "@/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";
import { format, isValid } from "date-fns";
import { useState } from "react";
import DialogDetailFeedback from "../components/dialog-detail-feedback";

export const dataFeedbackColumn: ColumnDef<FeedbackListTypes>[] = [
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
		accessorKey: "tour_name",
		header: "Tour Name",
		cell: ({ row }) => (
			<CellText className="text-left flex flex-row justify-between">
				{row?.original?.tour_name}
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
		accessorKey: "participant_name",
		header: "Participant Name",
		cell: ({ row }) => (
			<CellText className="text-left">
				{row?.original?.participant_name || "-"}
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
		accessorKey: "created_at",
		header: "Created At",
		cell: ({ row }) => (
			<CellText className="text-left">
				{row.original.created_at && isValid(new Date(row.original.created_at))
					? format(row.original.created_at, "dd/MM/yyyy")
					: "-"}
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
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => (
			<CellText
				color={row.original.is_publish === 0 ? "red-500" : "white"}
				className={cn(
					"text-center rounded-sm font-bold text-sm px-2",
					row.original.is_publish === 0 &&
						"border-[1px] border-[#FF3B30] text-red-500",
					row.original.is_publish === 1 && "bg-[#00A30E]"
				)}
			>
				{row.original.is_publish === 0 ? "Unpublished" : "Published"}
			</CellText>
		),
		meta: {
			cellProps: {
				style: {
					minWidth: 200,
					maxWidth: 200,
				},
			},
		},
	},
	{
		accessorKey: "ACTION_BUTTON",
		header: () => {
			return <CellText>Action</CellText>;
		},
		cell: ({ row, table }) => {
			const [openDetail, setOpenDetail] = useState(false);
			return (
				<div className="flex gap-2">
					<Typography
						className="text-blue-500 underline cursor-pointer"
						onClick={() => {
							setOpenDetail(true);
						}}
					>
						View Details
					</Typography>

					<DialogDetailFeedback
						open={openDetail}
						onClose={() => setOpenDetail(false)}
						id={row.original?.id}
						refetch={() => {
							table.resetPageIndex();
						}}
					/>
				</div>
			);
		},
		minSize: 130,
		meta: {
			headerCellProps: {
				style: {
					minWidth: 130,
				},
			},
		},
	},
];
