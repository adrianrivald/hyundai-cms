import type { RegistrationType } from "@/api/report";
import CellText from "@/components/layout/table/data-table-cell";
import { Typography } from "@/components/typography";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useNavigate } from "react-router";

export const dataReportRegistration: ColumnDef<RegistrationType>[] = [
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
		accessorKey: "participants_count",
		header: "Participant Count",
		cell: ({ row }) => {
			return (
				<CellText className="text-left font-light">
					{row?.original?.participants_count}
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
		accessorKey: "tour_packages_type",
		header: "Type Tour",
		cell: ({ row }) => {
			return (
				<CellText className="text-left font-light">
					{row?.original?.tour_packages_type === "vip"
						? "VIP"
						: row?.original?.tour_packages_type === "general-course"
							? "General Tour"
							: "Student Tour"}
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
		accessorKey: "group_type",
		header: "Group Type",
		cell: ({ row }) => {
			return (
				<CellText className="text-left font-light">
					{row?.original?.group_type || "-"}
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
		accessorKey: "verified_status",
		header: "Verified Status",
		cell: ({ row }) => {
			return (
				<CellText
					className={`text-left font-light ${row?.original?.verified_status ? "text-black" : "text-red-500"}`}
				>
					{row?.original?.verified_status ? "Verified" : "Unverified"}
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
		accessorKey: "registration_date",
		header: "Registration Date",
		cell: ({ row }) => {
			return (
				<CellText className={`text-left font-light `}>
					{row?.original?.registration_date
						? format(row.original?.registration_date, "dd/MM/yyyy")
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
			const navigate = useNavigate();
			return (
				<div className="flex gap-2 text-center">
					<Typography
						className="text-blue-500 underline cursor-pointer"
						onClick={() => {
							navigate(
								`/report/registration-report/detail/${row?.original?.id}`
							);
						}}
					>
						View Details
					</Typography>
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
