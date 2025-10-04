import { useGetCalendars } from "@/api/batch";
import FormProvider from "@/components/RHForm/FormProvider";
import RHFSelect from "@/components/RHForm/RHFSelect";
import DialogModal from "@/components/custom/dialog/dialog-modal";
import { Grid } from "@/components/grid";
import { yupResolver } from "@hookform/resolvers/yup";
import { format, isSameDay, isValid } from "date-fns";
import { useForm } from "react-hook-form";
import { FormRescheduleTour } from "../models/reschedule-tour";
import RHFDatePicker from "@/components/RHForm/RHFDatePicker";
import RHFTextArea from "@/components/RHForm/RHFTextArea";
import { Button } from "@/components/ui/button";
import {
	usePostRescheduleRequest,
	type RescheduleRequestType,
} from "@/api/reschedule";
import { enqueueSnackbar } from "notistack";

interface DialogRescheduleProps {
	open: boolean;
	onClose: () => void;
	id: number;
	refetch: () => void;
}

const DialogReschedule = ({
	open,
	onClose,
	id,
	refetch,
}: DialogRescheduleProps) => {
	const methods = useForm({
		defaultValues: {
			date: "",
		},
		resolver: yupResolver(FormRescheduleTour),
	});

	const { mutate, isPending } = usePostRescheduleRequest();

	const {
		data: dataCalendar,
		refetch: refetchCalendar,
		isLoading,
	} = useGetCalendars(
		isValid(new Date(methods.watch("date")))
			? format(new Date(methods.watch("date")), "yyyy-MM")
			: format(new Date(), "yyyy-MM")
	);

	const onSubmit = () => {
		let form = methods.watch();

		let data: RescheduleRequestType = {
			id: String(id),
			tour_date: format(new Date(form.date), "yyyy-MM-dd"),
			slot: form.batch.join(","),
			reschedule_reason: form.reason || "",
		};

		mutate(data, {
			onSuccess: () => {
				onClose();
				methods.clearErrors();
				methods.reset();
				refetch && refetch();
				enqueueSnackbar("Request has been sent", {
					variant: "success",
				});
			},
			onError: (err: any) => {
				enqueueSnackbar(`Error : ${err.response?.data?.message}`, {
					variant: "error",
				});
			},
		});
	};

	return (
		<DialogModal
			open={open}
			onOpenChange={() => {
				onClose();
				methods.reset();
			}}
			headerTitle={"Change Schedule"}
			contentProps="w-[50%] max-h-[70%]"
			content={
				<div>
					<FormProvider methods={methods}>
						<Grid container spacing={4}>
							<Grid item xs={6}>
								<RHFDatePicker
									className=""
									name="date"
									label="Select Visit Date"
									required
									placeholder="Select Visit Date"
									format="dd/MM/yyyy"
									minDate={new Date()}
									onChange={(date) => {
										if (date) {
											// setTimeout(() => {
											refetchCalendar();
											methods.setValue("date", date.toISOString());
											methods.setValue("batch", []);
											methods.clearErrors("date");
										}
									}}
								/>
							</Grid>
							<Grid item xs={6}>
								<RHFSelect
									className="space-y-0"
									name={`batch.${0}`}
									label="Batch"
									disabled={
										isLoading ||
										(dataCalendar?.data || [])
											?.filter((item) =>
												isSameDay(item.date, methods.watch("date"))
											)?.[0]
											?.slot?.filter((item) => item.time_range !== "-")
											?.map((item) => ({
												id: item.batch_time,
												name: item.time_range,
												disabled: item.tour !== null,
											}))?.length === 0 ||
										!methods.watch("date")
									}
									options={
										(dataCalendar?.data || [])
											?.filter((item) =>
												isSameDay(item.date, methods.watch("date"))
											)?.[0]
											?.slot?.filter((item) => item.time_range !== "-") //?.filter((item) => item.tour === null)
											?.map((item) => ({
												id: item.batch_time,
												name: item.time_range,
												disabled: item.tour !== null,
											})) || []
									}
									placeholder={
										(dataCalendar?.data || [])
											?.filter((item) =>
												isSameDay(item.date, methods.watch("date"))
											)?.[0]
											?.slot //?.filter((item) => item.tour === null)
											?.map((item) => ({
												id: item.batch_time,
												name: item.time_range,
											})).length === 0
											? "No Batch"
											: "Choose batch"
									}
									getOptionLabel={(user) => user.name}
									getOptionValue={(user) => String(user.id)}
									required
									onChange={(text) => methods.setValue(`batch.${0}`, text)}
								/>
							</Grid>
							<Grid item xs={12}>
								<RHFTextArea
									className=""
									name="reason"
									label="Reason"
									required
									placeholder="Reason"
									maxLength={200}
								/>
							</Grid>

							<Grid item xs={12} className="flex flex-row justify-end">
								<Button
									className="w-[100px]"
									disabled={isPending}
									onClick={() => {
										methods.trigger().then((isValid) => {
											if (isValid) {
												onSubmit();
											}
										});
									}}
								>
									Save
								</Button>
							</Grid>
						</Grid>
					</FormProvider>
				</div>
			}
		/>
	);
};

export default DialogReschedule;
