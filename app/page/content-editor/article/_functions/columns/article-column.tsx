import type { ArticleType } from "@/api/article";
import CellText from "@/components/layout/table/data-table-cell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react/dist/iconify.js";
import type { ColumnDef } from "@tanstack/react-table";
import { format, isValid } from "date-fns";

export const dataArticleList: ColumnDef<ArticleType>[] = [
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
		accessorKey: "image_path",
		header: "Gambar",
		cell: ({ row }) => (
			<CellText className="text-left">
				<img
					src={row?.original?.image_path || "-"}
					className="h-[30px] w-[85px] object-cover"
				/>
			</CellText>
		),
		meta: {
			cellProps: {
				style: {
					minWidth: 130,
					maxWidth: 130,
				},
			},
		},
	},
	{
		accessorKey: "name",
		header: "Judul",
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
		accessorKey: "blurb",
		header: "Konten",
		cell: ({ row }) => (
			<CellText className="">
				<div dangerouslySetInnerHTML={{ __html: row.original?.blurb || "" }} />
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
		accessorKey: "author",
		header: "Author",
		cell: ({ row }) => <CellText className="">{row.original?.author}</CellText>,
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
		accessorKey: "completed",
		header: "Tanggal Terbit",
		cell: ({ row }) => (
			<CellText className="">
				{row.original.published_at &&
				isValid(new Date(row.original.published_at))
					? format(row.original.published_at, "dd/MM/yyyy")
					: "-"}
			</CellText>
		),
		meta: {
			cellProps: {
				style: {
					minWidth: 150,
					maxWidth: 155,
				},
			},
		},
	},
	{
		accessorKey: "completed",
		header: "Aksi",

		cell: ({ row }) => (
			<div className="flex gap-2">
				<div className="cursor-pointer">
					<Icon
						icon="basil:edit-outline"
						width="24"
						height="24"
						color="#153263"
					/>
				</div>
				<div className="cursor-pointer">
					<Icon icon="mage:trash" width="24" height="24" color="#FF3B30" />
				</div>
			</div>
		),
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
		header: () => {
			return (
				<Button
					className="bg-amber-500 hover:bg-amber-600 my-2 w-[120px]"
					startIcon={<Icon icon="ic:sharp-plus" width="16" height="16" />}
				>
					Tambah
				</Button>
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
