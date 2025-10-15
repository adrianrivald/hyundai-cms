import {
	usePostRescheduleApproval,
	type RescheduleApprovalType,
} from "@/api/reschedule";
import FormProvider from "@/components/RHForm/FormProvider";
import RHFTextField from "@/components/RHForm/RHFTextField";
import DialogApproval from "@/components/custom/dialog/dialog-approval";
import DialogModal from "@/components/custom/dialog/dialog-modal";
import { Grid } from "@/components/grid";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface DialogRescheduleDetailProps {
	open: boolean;
	onClose: () => void;
	data: RescheduleApprovalType;
	refetch: () => void;
}

const DialogRescheduleDetail = ({
	open,
	onClose,
	data,
	refetch,
}: DialogRescheduleDetailProps) => {
	const [approval, setApproval] = useState({
		approve: null as any,
		isOpen: false,
	});
	const { mutate } = usePostRescheduleApproval();
	const methods = useForm({
		defaultValues: {
			instanceName: "",
			scheduleDate: "",
			time: "",

			newScheduleDate: "",
			newScheduleTime: "",
			newReason: "",
		},
	});

	useEffect(() => {
		if (open && data) {
			methods.reset({
				instanceName: data?.name,
				scheduleDate: format(new Date(data?.old_data?.tour_date), "dd/MM/yyyy"),
				time: data?.old_data?.slot,

				newScheduleDate: format(new Date(data?.tour_date), "dd/MM/yyyy"),
				newScheduleTime: data?.slot,
				newReason: data?.reschedule_reason,
			});
		}
	}, [open, data]);

	const onSubmit = () => {
		mutate(
			{ tour_id: String(data?.id), approve: approval.approve },
			{
				onSuccess: () => {
					onClose();
					setApproval({ isOpen: false, approve: false });
					methods.clearErrors();
					methods.reset();
					refetch && refetch();
					enqueueSnackbar("Data has been changed", {
						variant: "success",
					});
				},
				onError: (err: any) => {
					enqueueSnackbar(`Error : ${err.response?.data?.message}`, {
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
			headerTitle={"Schedule Information"}
			contentProps="w-[700px] max-h-[750px] overflow-y-scroll"
			content={
				<div className="">
					<FormProvider methods={methods}>
						<Grid container spacing={3}>
							<Grid item xs={12}>
								<Typography className="font-medium">
									Registered Information
								</Typography>
							</Grid>
							<Grid item xs={6} md={4}>
								<RHFTextField
									name="instanceName"
									label="Group Name"
									placeholder="Group Name"
									disabled
								/>
							</Grid>
							<Grid item xs={6} md={4}>
								<RHFTextField
									name="scheduleDate"
									label="Schedule Date "
									placeholder="Group Name"
									disabled
								/>
							</Grid>
							<Grid item xs={6} md={4}>
								<RHFTextField
									name="time"
									label="Time "
									placeholder="Group Name"
									disabled
								/>
							</Grid>
						</Grid>
						<Grid container spacing={3} className="bg-[#153263] mt-5 p-5">
							<Grid item xs={12}>
								<Typography className="text-white font-medium">
									Reschedule Information
								</Typography>
							</Grid>
							<Grid item xs={6} md={4}>
								<RHFTextField
									name="newScheduleDate"
									label="New Schedule Date"
									placeholder="New Schedule"
									disabled
									variant="default"
									className="text-black disabled:bg-white disabled:opacity-100"
									labelClass="text-white"
								/>
							</Grid>
							<Grid item xs={6} md={4}>
								<RHFTextField
									name="newScheduleTime"
									label="New Schedule Time"
									placeholder="Schedule Time"
									disabled
									variant="default"
									className="text-black disabled:bg-white disabled:opacity-100"
									labelClass="text-white"
								/>
							</Grid>
							<Grid item xs={6} md={4}>
								<RHFTextField
									name="newReason"
									label="Reschedule Reason"
									placeholder="Reschedule Reason"
									disabled
									variant="default"
									className="text-black disabled:bg-white disabled:opacity-100"
									labelClass="text-white"
								/>
							</Grid>
						</Grid>
						<div className="mt-5 flex flex-row gap-4 justify-end">
							<Button
								onClick={() => {
									setApproval({ isOpen: true, approve: false });
								}}
								variant={"hmmiOutline"}
								className="border-red-500 text-red-500"
							>
								Reject
							</Button>
							<Button
								onClick={() => {
									setApproval({ isOpen: true, approve: true });
								}}
							>
								Approve
							</Button>
						</div>
					</FormProvider>
					<DialogApproval
						approval={approval.approve ? "Menyetujui" : "Menolak"}
						open={approval.isOpen}
						onClose={() => {
							setApproval({ isOpen: false, approve: null });
						}}
						onSubmit={() => {
							onSubmit();
						}}
					/>
				</div>
			}
		/>
	);
};

export default DialogRescheduleDetail;
