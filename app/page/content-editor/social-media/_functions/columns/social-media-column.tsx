import CellText from "@/components/layout/table/data-table-cell";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import type { ColumnDef, Row, Table } from "@tanstack/react-table";
import DialogSocialMedia from "../components/dialog-social-media";
import { useState } from "react";
import type { SocialMediaGlobal } from "../models/social-media";
import {
	useGetGlobalVariables,
	usePutGlobalVariable,
} from "@/api/global-variable";
import DialogDelete from "@/components/custom/dialog/dialog-delete";
import type { GlobalVariableTypes } from "@/types/GlobalVariableTypes";
import { enqueueSnackbar } from "notistack";

export const dataSocmedColumn: ColumnDef<SocialMediaGlobal>[] = [
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
		accessorKey: "social_media",
		header: "Social Media Type",
		cell: ({ row }) => (
			<CellText className="">{row.original?.social_media}</CellText>
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
		accessorKey: "profile",
		header: "Social Media Link",
		cell: ({ row }) => (
			<CellText className="">{row.original?.profile}</CellText>
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
		cell: ({ row, table }) => <ActionCell row={row} table={table} />,
		meta: {
			cellProps: {
				style: {
					minWidth: 130,
					maxWidth: 135,
				},
			},
		},
	},
	{
		accessorKey: "ACTION_BUTTON",
		header: ({ table }) => {
			const [open, setOpen] = useState(false);
			return (
				<div>
					<Button
						onClick={() => setOpen(true)}
						className="bg-amber-500 hover:bg-amber-600 my-2 w-[120px]"
						startIcon={<Icon icon="ic:sharp-plus" width="16" height="16" />}
					>
						Add
					</Button>
					<DialogSocialMedia
						open={open}
						onClose={() => setOpen(false)}
						refetch={() => {
							table.resetPageIndex();
						}}
					/>
				</div>
			);
		},

		meta: {
			cellProps: {
				style: {
					minWidth: 80,
					maxWidth: 85,
				},
			},
		},
	},
];

const ActionCell = ({
	row,
	table,
}: {
	row: Row<SocialMediaGlobal>;
	table: Table<SocialMediaGlobal>;
}) => {
	const [openDelete, setOpenDelete] = useState(false);
	const [openUpdate, setOpenUpdate] = useState(false);

	const { data: dataSocialMedia } = useGetGlobalVariables({
		queryKey: ["global-variable-social-media"],
		staleTime: 5 * 60 * 1000,
	});

	const { mutate: mutateEdit, isPending: pendingEdit } = usePutGlobalVariable();

	const onDelete = () => {
		const dataSocmed =
			(
				dataSocialMedia?.data
					.filter((item) => item.name === "social_media")
					.filter((item) => !!item.var_value) as GlobalVariableTypes[]
			)?.map((item) => JSON.parse(item.var_value))?.[0] ?? [];

		const updatedSocmed = dataSocmed.filter(
			(item: any) => item.id !== row.original.id
		);

		const dataForm: GlobalVariableTypes = {
			id:
				dataSocialMedia?.data?.find((item) => item.name === "social_media")
					?.id || "",
			name: "social_media",
			description: "Social media accounts shown in microsite",
			is_active: false,
			var_value: JSON.stringify(updatedSocmed),
		};

		mutateEdit(dataForm, {
			onSuccess: () => {
				setOpenDelete(false);
				enqueueSnackbar("Data has been deleted", { variant: "success" });
				table.resetPageIndex();
			},
			onError: (err: any) => {
				enqueueSnackbar(`Error: ${err.response?.data?.message}`, {
					variant: "error",
				});
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
			<div className="cursor-pointer" onClick={() => setOpenDelete(true)}>
				<Icon icon="mage:trash" width="24" height="24" color="#FF3B30" />
			</div>

			<DialogDelete
				open={openDelete}
				onClose={() => setOpenDelete(false)}
				onSubmit={onDelete}
			/>
			<DialogSocialMedia
				open={openUpdate}
				onClose={() => setOpenUpdate(false)}
				refetch={() => table.resetPageIndex()}
				data={row.original}
			/>
		</div>
	);
};
