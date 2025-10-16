import { useDeleteArticle, type ArticleType } from "@/api/article";
import { useDeleteTopMenu, type TopMenuTypePost } from "@/api/top-menu";
import DialogDelete from "@/components/custom/dialog/dialog-delete";
import DialogDetailArticle from "@/components/custom/dialog/dialog-detail-article";
import DialogDetailTopMenu from "@/components/custom/dialog/dialog-detail-top-menu";
import CellText from "@/components/layout/table/data-table-cell";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react/dist/iconify.js";
import type { ColumnDef, Row, Table } from "@tanstack/react-table";
import { format, isValid } from "date-fns";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import { useNavigate } from "react-router";

export const dataTopMenuList: ColumnDef<TopMenuTypePost>[] = [
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
		header: "Title",
		cell: ({ row }) => <CellText className="">{row.original?.name}</CellText>,
		meta: {
			cellProps: {
				style: {
					minWidth: 240,
					maxWidth: 245,
				},
			},
		},
	},
	{
		accessorKey: "content",
		header: "Content",
		cell: ({ row }) => (
			<CellText className="text-pretty line-clamp-none">
				<div dangerouslySetInnerHTML={{ __html: row.original?.blurb || "-" }} />
			</CellText>
		),
		meta: {
			cellProps: {
				style: {
					minWidth: 240,
					maxWidth: 245,
				},
			},
		},
	},

	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => (
			<CellText
				color={row.original.status == "draft" ? "red-500" : "white"}
				className={cn(
					"text-center rounded-sm font-bold text-sm px-2",
					row.original.status == "draft" &&
						"border-[1px] border-[#FF3B30] text-red-500",
					row.original.status === "published" && "bg-[#00A30E]"
				)}
			>
				{row.original?.status === "draft" ? "Draft" : "Published"}
			</CellText>
		),
		meta: {
			cellProps: {
				style: {
					minWidth: 140,
					maxWidth: 140,
				},
			},
		},
	},

	{
		accessorKey: "action",
		header: "Action",

		cell: ({ row, table }) => <ActionCell row={row} table={table} />,
		meta: {
			cellProps: {
				style: {
					minWidth: 100,
				},
			},
		},
	},
	{
		accessorKey: "ACTION_BUTTON",
		header: ({ table }) => {
			const navigate = useNavigate();

			return (
				<Button
					onClick={() => {
						navigate("/content-editor/top-menu/create");
					}}
					//disabled={table.getRowCount() >= 2}
					className="bg-amber-500 hover:bg-amber-600 my-2 w-[120px]"
					startIcon={<Icon icon="ic:sharp-plus" width="16" height="16" />}
				>
					Add
				</Button>
			);
		},
		cell: ({ row }) => {
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

					<DialogDetailTopMenu
						open={openDetail}
						onClose={() => setOpenDetail(false)}
						data={row.original}
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

const ActionCell = ({
	row,
	table,
}: {
	row: Row<TopMenuTypePost>;
	table: Table<TopMenuTypePost>;
}) => {
	const [openDelete, setOpenDelete] = useState(false);
	const navigate = useNavigate();
	const { mutate: mutateDelete } = useDeleteTopMenu();

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
					navigate(`/content-editor/top-menu/update/${row.original.id}`);
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

			{/* <DialogTour
				open={openUpdate}
				onClose={() => setOpenUpdate(false)}
				refetch={() => table.resetPageIndex()}
				data={row.original}
			/> */}
		</div>
	);
};
