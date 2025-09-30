import DialogModal from "@/components/custom/dialog/dialog-modal";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { format, isSameDay } from "date-fns";
import DialogPublicHoliday from "./dialog-public-holiday";
import { useState } from "react";
import DialogDelete from "@/components/custom/dialog/dialog-delete";
import { useDeleteHoliday } from "@/api/public-holiday";
import { enqueueSnackbar } from "notistack";
import { Grid } from "@/components/grid";

interface DialogDetailHolidayProps {
	open: boolean;
	onClose: () => void;
	data: any;
	refetch?: any;
}

const DialogDetailHoliday = ({
	open,
	onClose,
	data,
	refetch,
}: DialogDetailHolidayProps) => {
	const [openEdit, setOpenEdit] = useState(false);
	const [openDelete, setOpenDelete] = useState(false);
	const { mutate } = useDeleteHoliday();

	const onDelete = () => {
		mutate(
			{ id: data?.id || "" },
			{
				onSuccess: () => {
					setOpenDelete(false);
					enqueueSnackbar("Data has been deleted", {
						variant: "success",
					});
					onClose();
					refetch && refetch();
				},
				onError: () => {
					enqueueSnackbar("Error: Failed to delete data", {
						variant: "error",
					});
				},
			}
		);
	};
	return (
		<DialogModal
			open={open}
			onOpenChange={() => {
				onClose();
			}}
			headerTitle={data?.title}
			contentProps="w-[700px] max-h-[750px]"
			content={
				<div className="">
					<Grid container spacing={2}>
						<Grid item xs={6}>
							<Typography className="font-bold">
								{!isSameDay(data?.end, data?.start) ? "Date" : "Start Date"}
							</Typography>
							<Typography>{format(data?.start, "dd-MM-yyyy")}</Typography>
						</Grid>
						{!isSameDay(data?.end, data?.start) && (
							<Grid item xs={6}>
								<Typography className="font-bold">End Date : </Typography>
								<Typography>{format(data?.end, "dd-MM-yyyy")}</Typography>
							</Grid>
						)}
					</Grid>

					<div className="mt-2">
						<Typography className="font-bold">Description : </Typography>
						<Typography>{data?.description}</Typography>
					</div>
					<div className="flex flex-row justify-end mt-5 gap-2">
						<Button
							variant={"hmmiPrimary"}
							onClick={() => {
								setOpenEdit(true);
							}}
						>
							Change
						</Button>
						<Button
							onClick={() => {
								setOpenDelete(true);
							}}
							variant={"hmmiOutline"}
							className="border-red-500 text-red-500"
						>
							Delete
						</Button>
					</div>

					<DialogPublicHoliday
						open={openEdit}
						onClose={() => {
							setOpenEdit(false);
							onClose();
						}}
						data={data}
						refetch={refetch}
						isEdit
					/>

					<DialogDelete
						open={openDelete}
						onClose={() => {
							setOpenDelete(false);
						}}
						onSubmit={() => {
							onDelete();
						}}
					/>
				</div>
			}
		/>
	);
};

export default DialogDetailHoliday;
