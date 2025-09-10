import FormProvider from "@/components/RHForm/FormProvider";
import RHFDatePicker from "@/components/RHForm/RHFDatePicker";
import RHFTextField from "@/components/RHForm/RHFTextField";
import DialogModal from "@/components/custom/dialog/dialog-modal";
import { Grid } from "@/components/grid";
import { Button } from "@/components/ui/button";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { FormCalendarSchema } from "../models/calendar-schema";

interface DialogPublicHolidayProps {
	open: boolean;
	onClose: () => void;
}

const DialogPublicHoliday = ({ open, onClose }: DialogPublicHolidayProps) => {
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
									//minDate={new Date()}
								/>
							</Grid>
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
									//loading={pendingEdit || pendingPost}
									onClick={() => {
										methods.trigger().then((isValid) => {
											if (isValid) {
												//onSubmit();
											}
										});
									}}
								>
									{/* {data?.id ? "Ubah" : "Tambahkan"} */}
									Set hari libur
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
