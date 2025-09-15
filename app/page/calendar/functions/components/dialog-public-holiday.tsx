import FormProvider from "@/components/RHForm/FormProvider";
import RHFDatePicker from "@/components/RHForm/RHFDatePicker";
import RHFTextField from "@/components/RHForm/RHFTextField";
import DialogModal from "@/components/custom/dialog/dialog-modal";
import { Grid } from "@/components/grid";
import { Button } from "@/components/ui/button";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { FormCalendarSchema } from "../models/calendar-schema";
import { type PublicHolidayType, useSaveHoliday } from "@/api/public-holiday";
import { enqueueSnackbar } from "notistack";
import { eachDayOfInterval, format } from "date-fns";
import { useEffect } from "react";

interface DialogPublicHolidayProps {
	open: boolean;
	onClose: () => void;
	data?: any;
	refetch?: () => void;
	isEdit?: boolean;
}

const DialogPublicHoliday = ({
	open,
	onClose,
	data,
	refetch,
	isEdit,
}: DialogPublicHolidayProps) => {
	const methods = useForm({
		defaultValues: {
			id: "",
			start_date: "",
			end_date: "",
			title: "",
			description: "",
		},
		resolver: yupResolver(FormCalendarSchema),
	});

	const { mutate, isPending } = useSaveHoliday();

	const onSubmit = () => {
		const form = methods.watch();

		const dateRange = eachDayOfInterval({
			start: new Date(form.start_date),
			end: isEdit ? new Date(form.start_date) : new Date(form?.end_date || ""),
		});

		const dataForm: PublicHolidayType[] = dateRange.map((date) => ({
			id: data?.id,
			holiday_name: form.title,
			start_date: format(date, "yyyy-MM-dd"),
			description: form.description,
		}));

		mutate(dataForm, {
			onSuccess: () => {
				onClose();
				refetch && refetch();
				methods.clearErrors();
				methods.reset();

				enqueueSnackbar(`Data telah ${isEdit ? "diubah" : "ditambahkan"}`, {
					variant: "success",
				});
			},
			onError: () => {
				enqueueSnackbar("Error: Pembuatan holiday gagal", {
					variant: "error",
				});
			},
		});
	};

	useEffect(() => {
		if (data && open) {
			methods.reset({
				id: String(data?.id || ""),
				description: data?.description,
				title: data?.title,
				start_date: data?.start,
				end_date: data?.start,
			});
		}
	}, [data, open]);

	return (
		<DialogModal
			open={open}
			onOpenChange={() => {
				onClose();
				methods.clearErrors();
				methods.reset();
			}}
			//headerTitle={methods.watch("id") ? "Ubah About Us" : "Tambah About Us"}
			contentProps="w-[700px] max-h-[750px] overflow-y-scroll"
			content={
				<div className="">
					<FormProvider methods={methods}>
						<Grid container className="mt-5" spacing={4}>
							{!isEdit && (
								<>
									<Grid item xs={6}>
										<RHFDatePicker
											name="start_date"
											label="Tanggal dimulai"
											required
											placeholder="Pilih Tanggal Mulai"
											format="dd/MM/yyyy"
											onChange={(date) => {
												if (date) {
													methods.setValue("start_date", date.toISOString());
													methods.clearErrors("start_date");
													methods.setValue("end_date", "");
												}
											}}
											//minDate={new Date()}
										/>
									</Grid>
									<Grid item xs={6}>
										<RHFDatePicker
											name="end_date"
											label="Tanggal berakhir"
											required
											placeholder="Pilih Tanggal Akhir"
											format="dd/MM/yyyy"
											onChange={(date) => {
												if (date) {
													methods.setValue("end_date", date.toISOString());
													methods.clearErrors("end_date");
												}
											}}
											minDate={new Date(methods.watch("start_date"))}
										/>
									</Grid>
								</>
							)}

							{isEdit && (
								<Grid item xs={12}>
									<RHFDatePicker
										name="start_date"
										label="Tanggal"
										required
										placeholder="Pilih Tanggal"
										format="dd/MM/yyyy"
										onChange={(date) => {
											if (date) {
												methods.setValue("start_date", date.toISOString());
												methods.clearErrors("start_date");
											}
										}}
										//minDate={new Date()}
									/>
								</Grid>
							)}

							<Grid item xs={6}>
								<RHFTextField
									name="title"
									label="Judul"
									placeholder="Masukan judul"
									autoFocus={false}
									required
								/>
							</Grid>
							<Grid item xs={6}>
								<RHFTextField
									name="description"
									label="Deskripsi"
									placeholder="Masukan deskripsi"
									autoFocus={false}
									required
								/>
							</Grid>
							<Grid item xs={12} className="flex justify-end">
								<Button
									variant={"hmmiOutline"}
									loading={isPending}
									onClick={() => {
										methods.trigger().then((isValid) => {
											if (isValid) {
												onSubmit();
											}
										});
									}}
								>
									{data?.id ? "Ubah hari libur" : "Set hari libur"}
								</Button>
							</Grid>
						</Grid>
					</FormProvider>
				</div>
			}
		/>
	);
};

export default DialogPublicHoliday;
