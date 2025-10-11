import type { VisitorType } from "@/api/report";
import CellText from "@/components/layout/table/data-table-cell";
import { Typography } from "@/components/typography";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useState } from "react";

export const dataReportVisitor: ColumnDef<VisitorType>[] = [
	{
		accessorKey: "no",
		header: "No",
		cell: ({ cell, table }) => {
			const pageSize = 10;
			const pageIndex = table.getState().pagination.pageIndex;
			const index = cell.row.index + 1 + pageIndex * pageSize;
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
		accessorKey: "name",
		header: "Visitor Name",
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
		accessorKey: "email",
		header: "Email",
		cell: ({ row }) => {
			return (
				<CellText className="text-left font-light">
					{row?.original?.email}
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
		accessorKey: "email",
		header: "Phone Number",
		cell: ({ row }) => {
			return (
				<CellText className="text-left font-light">
					{row?.original?.phone_number}
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
		accessorKey: "verification_code",
		header: "Code",
		cell: ({ row }) => {
			return (
				<CellText className="text-left font-light">
					{row?.original?.verification_code}
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
		accessorKey: "last_check_in",
		header: "Last Check In",
		cell: ({ row }) => {
			return (
				<CellText className="text-left font-light">
					{row?.original?.attended_at
						? format(row.original?.attended_at, "dd/MM/yyyy")
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
		accessorKey: "ACTION_BUTTON",
		header: "Action",
		cell: ({ row }) => {
			const [openDetail, setOpenDetail] = useState(false);
			return (
				<div className="flex gap-2 text-center">
					<Typography
						className="text-blue-500 underline cursor-pointer"
						onClick={() => {
							setOpenDetail(true);
						}}
					>
						View Details
					</Typography>

					{/* <DialogDetailArticle
						open={openDetail}
						onClose={() => setOpenDetail(false)}
						data={row.original}
					/> */}
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
