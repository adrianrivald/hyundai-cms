import CellText from "@/components/layout/table/data-table-cell";
import type { ColumnDef } from "@tanstack/react-table";

export const dataVehicleColumn: ColumnDef<{
	vehicle_type: string;
	vehicle_plate_number: string;
	id: string;
}>[] = [
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
		accessorKey: "vehicle_type",
		header: "Vehicle Type",
		cell: ({ row }) => (
			<CellText className="text-left flex flex-row justify-between">
				{(row.original?.vehicle_type ? "Private Car" : "Tour Bus") || "-"}
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
		accessorKey: "vehicle_plate_number",
		header: "Plate Number",
		cell: ({ row }) => (
			<CellText className="text-left">
				{row?.original?.vehicle_plate_number || "-"}
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
];
