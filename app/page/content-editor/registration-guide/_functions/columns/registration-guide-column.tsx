import CellText from "@/components/layout/table/data-table-cell";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";

import { Icon } from "@iconify/react/dist/iconify.js";
import type { ColumnDef, Row, Table } from "@tanstack/react-table";
import { useState } from "react";
import {
	useGetGlobalVariables,
	usePutGlobalVariable,
} from "@/api/global-variable";
import DialogDelete from "@/components/custom/dialog/dialog-delete";
import { enqueueSnackbar } from "notistack";
import type { GlobalVariableTypes } from "@/types/GlobalVariableTypes";
import DialogDetailContent from "@/components/custom/dialog/dialog-detail";

import type { LegalContentType } from "@/page/content-editor/legal/_functions/models/legal";
import DialogAboutUs from "../components/dialog-registration-guide";

export const dataAboutUsColumn: ColumnDef<LegalContentType>[] = [
	{
		accessorKey: "language",
		header: "Language",
		cell: ({ row }) => (
			<CellText className="text-left">
				{row?.original?.language === "en" ? "English" : "Indonesia" || "-"}
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
		accessorKey: "title",
		header: "Title",
		cell: ({ row }) => (
			<CellText className="text-left">{row?.original?.title || "-"}</CellText>
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
		accessorKey: "content",
		header: "Main Content",
		cell: ({ row }) => (
			<CellText className="text-pretty line-clamp-none">
				<div
					dangerouslySetInnerHTML={{ __html: row.original?.content || "-" }}
				/>
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
		accessorKey: "completed",
		header: "Action",
		cell: ({ row, table }) => <ActionCell table={table} row={row} />,
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
			const hasVarValue = table
				.getRowModel()
				.rows.map((row) => row.original.language);
			return (
				<>
					<Button
						onClick={() => {
							setOpen(true);
						}}
						disabled={hasVarValue.length === 2}
						className="bg-amber-500 hover:bg-amber-600 my-2 w-[120px]"
						startIcon={<Icon icon="ic:sharp-plus" width="16" height="16" />}
					>
						Add
					</Button>

					<DialogAboutUs
						open={open}
						onClose={() => setOpen(false)}
						refetch={() => table.resetPageIndex()}
					/>
				</>
			);
		},
		cell: ({ row }) => {
			const [open, setOpen] = useState(false);
			return (
				<div className="flex gap-2">
					{row.original?.content && row.original?.title && (
						<Typography
							className="text-blue-500 underline cursor-pointer"
							onClick={() => {
								setOpen(true);
							}}
						>
							View Details
						</Typography>
					)}

					<DialogDetailContent
						open={open}
						onClose={() => {
							setOpen(false);
						}}
						title={row.original.title}
						content={row.original.content}
						language={row.original.language}
						type={"Legal"}
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

const ActionCell = ({
	row,
	table,
}: {
	row: Row<LegalContentType>;
	table: Table<LegalContentType>;
}) => {
	const { data } = useGetGlobalVariables({
		queryKey: ["global-variable-legal"],
		staleTime: 5 * 60 * 1000,
	});
	const [openDelete, setOpenDelete] = useState(false);
	const [openUpdate, setOpenUpdate] = useState(false);
	const { mutate: mutateEdit } = usePutGlobalVariable();
	//const { mutate: mutateDelete } = useDeleteGlobalVariable();

	const dataLegal =
		(data?.data
			.filter((item) => item.name === "registration_guide")
			.filter((item) => item.var_value !== "" && item.var_value !== null)
			.flatMap((item) => {
				try {
					const parsed = JSON.parse(item.var_value) as any;
					return parsed.map((itm: any) => ({ ...itm, id: String(item.id) }));
				} catch {
					return [];
				}
			}) as LegalContentType[]) ?? [];

	const onDelete = () => {
		let legalRemove = dataLegal
			//.filter((item) => item.language !== row.original.language)
			.map((item) => ({
				language: item.language,
				title: item.language === row.original.language ? "" : item.title,
				content: item.language === row.original.language ? "" : item.content,
			}));

		const dataForm: GlobalVariableTypes = {
			id: row?.original?.id || "",
			name: "registration_guide",
			description: "The legal on microsite",
			is_active: true,
			var_value: JSON.stringify(legalRemove),
		};

		mutateEdit(dataForm, {
			onSuccess: () => {
				enqueueSnackbar("Data has been deleted", {
					variant: "success",
				});
				setOpenDelete(false);
				table.resetPageIndex();
			},
			onError: (err: any) => {
				enqueueSnackbar(`Error : ${err.response?.data?.message}`, {
					variant: "error",
				});
				setOpenDelete(false);
				table.resetPageIndex();
			},
		});
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
			{/* {row.original?.content && row.original?.title && (
				<div className="cursor-pointer " onClick={() => setOpenDelete(true)}>
					<Icon icon="mage:trash" width="24" height="24" color="#FF3B30" />
				</div>
			)} */}

			<DialogDelete
				open={openDelete}
				onClose={() => {
					setOpenDelete(false);
				}}
				onSubmit={() => {
					onDelete();
				}}
			/>
			<DialogAboutUs
				open={openUpdate}
				onClose={() => setOpenUpdate(false)}
				refetch={() => {
					table.resetPageIndex();
				}}
				data={dataLegal}
			/>
		</div>
	);
};
