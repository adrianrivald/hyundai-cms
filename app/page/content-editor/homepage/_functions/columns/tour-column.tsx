import CellText from "@/components/layout/table/data-table-cell";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import type { ColumnDef, Row, Table } from "@tanstack/react-table";

import DialogTour from "../components/dialog-tour";
import { useState } from "react";
import { useDeleteTourPackage, type TourPackageType } from "@/api/tour-package";
import { Typography } from "@/components/typography";
import DialogDelete from "@/components/custom/dialog/dialog-delete";
import { enqueueSnackbar } from "notistack";

export const dataTourColumn: ColumnDef<TourPackageType>[] = [
	{
		accessorKey: "title",
		header: "Image",
		cell: ({ row }) => (
			<CellText className="text-left">
				{row.original?.image_path ? (
					<img
						src={row?.original?.image_path || "-"}
						className="h-[30px] w-[85px] object-cover"
					/>
				) : (
					"-"
				)}
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
		accessorKey: "name",
		header: "Tour Name",
		cell: ({ row }) => <CellText className="">{row.original?.name}</CellText>,
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
		accessorKey: "description",
		header: "Description",
		cell: ({ row }) => (
			<CellText className="text-left">
				{row?.original?.description || "-"}
			</CellText>
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
		accessorKey: "participant",
		header: "Participant",
		cell: ({ row }) => (
			<CellText className="text-left">
				{row.original.minimum_participant} - {row.original.maximum_participant}
			</CellText>
		),
		meta: {
			cellProps: {
				style: {
					minWidth: 70,
					maxWidth: 70,
				},
			},
		},
	},
	{
		accessorKey: "factories",
		header: "Factory",
		cell: ({ row }) => (
			<CellText className="text-left line-clamp-none">
				{row.original.factories.map((item, index) => {
					return <Typography key={index}>- {item.name}</Typography>;
				})}
			</CellText>
		),
		meta: {
			cellProps: {
				style: {
					minWidth: 500,
				},
			},
		},
	},
	{
		accessorKey: "routes",
		header: "Total Routes",
		cell: ({ row }) => (
			<CellText className="text-left">{row.original.routes.length}</CellText>
		),
		meta: {
			cellProps: {
				style: {
					minWidth: 70,
					maxWidth: 70,
				},
			},
		},
	},
	{
		accessorKey: "completed",
		header: "Action",
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
			const [open, setOpen] = useState(false);
			return (
				<div className="mr-5">
					<Button
						onClick={() => setOpen(true)}
						className="bg-amber-500 hover:bg-amber-600 my-2"
						startIcon={<Icon icon="ic:sharp-plus" width="16" height="16" />}
					>
						Add
					</Button>
					<DialogTour
						open={open}
						onClose={() => setOpen(false)}
						refetch={() => table.resetPageIndex()}
					/>
				</div>
			);
		},

		meta: {
			headerCellProps: {
				style: {
					minWidth: 160,
					maxWidth: 160,
				},
			},
		},
	},
];

const ActionCell = ({
	row,
	table,
}: {
	row: Row<TourPackageType>;
	table: Table<TourPackageType>;
}) => {
	const [openDelete, setOpenDelete] = useState(false);
	const [openUpdate, setOpenUpdate] = useState(false);
	const { mutate: mutateDelete } = useDeleteTourPackage();

	const onDelete = () => {
		mutateDelete(
			{ id: row.original.id || "" },
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

			<DialogTour
				open={openUpdate}
				onClose={() => setOpenUpdate(false)}
				refetch={() => table.resetPageIndex()}
				data={row.original}
			/>
		</div>
	);
};
