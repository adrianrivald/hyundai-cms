import CellText from "@/components/layout/table/data-table-cell";
import { Typography } from "@/components/typography";
import type { ColumnDef } from "@tanstack/react-table";
import type { RescheduleApprovalType } from "@/api/reschedule";
import { format, isValid } from "date-fns";
import { useState } from "react";
import DialogRescheduleDetail from "../components/dialog-reschedule-detail";

export const dataRescheduleApproval: ColumnDef<RescheduleApprovalType>[] = [
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
		accessorKey: "group_name",
		header: "Group Name",
		cell: ({ row }) => {
			return (
				<CellText className="text-left font-light">
					{row?.original?.name}
				</CellText>
			);
		},
		meta: {
			filterComponent: () => {
				return null;
			},
			headerCellProps: {
				style: {
					minWidth: 200,
				},
			},
		},
	},
	{
		accessorKey: "old_schedule",
		header: "Old Schedule",
		cell: ({ row }) => {
			return (
				<CellText className="text-left font-light">
					{row.original.old_data?.tour_date &&
					isValid(new Date(row.original.old_data?.tour_date))
						? format(row.original.old_data?.tour_date, "dd/MM/yyyy")
						: "-"}
				</CellText>
			);
		},
		meta: {
			filterComponent: () => {
				return null;
			},
			headerCellProps: {
				style: {
					minWidth: 200,
				},
			},
		},
	},
	{
		accessorKey: "new_schedule",
		header: "New Schedule",
		cell: ({ row }) => {
			return (
				<CellText className="text-left font-light">
					{row.original.tour_date && isValid(new Date(row.original.tour_date))
						? format(row.original.tour_date, "dd/MM/yyyy")
						: "-"}
				</CellText>
			);
		},
		meta: {
			filterComponent: () => {
				return null;
			},
			headerCellProps: {
				style: {
					minWidth: 200,
				},
			},
		},
	},
	{
		accessorKey: "reason",
		header: "Reschedule Reason",
		cell: ({ row }) => {
			return (
				<CellText className="text-left font-light">
					{row.original.reschedule_reason}
				</CellText>
			);
		},
		meta: {
			filterComponent: () => {
				return null;
			},
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

					<DialogRescheduleDetail
						open={openDetail}
						onClose={() => setOpenDetail(false)}
						data={row.original}
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
