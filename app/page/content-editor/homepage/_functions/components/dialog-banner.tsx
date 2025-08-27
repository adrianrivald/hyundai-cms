import FormProvider from "@/components/RHForm/FormProvider";
import RHFDatePicker from "@/components/RHForm/RHFDatePicker";
import RHFTextArea from "@/components/RHForm/RHFTextArea";
import RHFTextField from "@/components/RHForm/RHFTextField";
import DialogModal from "@/components/custom/dialog/dialog-modal";
import { Grid } from "@/components/grid";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface DialogBannerProps {
	open: boolean;
	onClose: () => void;
	data?: any;
}

const DialogBanner = ({ open, onClose, data }: DialogBannerProps) => {
	const methods = useForm({
		defaultValues: {
			image: {
				file: {},
				file_url: "",
			},
			title: "",
			description: "",
			date: "",
		},
		shouldFocusError: false,
		mode: "onChange",
	});
	return (
		<DialogModal
			open={open}
			onOpenChange={onClose}
			headerTitle={data?.id ? "Edit Banner" : "Tambah Banner"}
			contentProps="w-[800px]"
			content={
				<div className="">
					<FormProvider methods={methods}>
						<Grid container spacing={4}>
							<Grid item xs={12}>
								<RHFTextField
									name="title"
									label="Judul Banner"
									placeholder="Masukan judul banner"
									autoFocus={false}
								/>
							</Grid>
							<Grid item xs={12}>
								<RHFTextArea
									name="description"
									label="Deskripsi"
									placeholder="Masukan deskripsi"
									rows={5}
								/>
							</Grid>
							<Grid item xs={12}>
								<RHFDatePicker
									name="date"
									label="Tanggal Terbit"
									required
									placeholder="Pilih Tanggal Terbit"
									format="dd/MM/yyyy"
									onChange={(date) => {
										if (date) {
											methods.setValue("date", date.toISOString());
										}
									}}
								/>
							</Grid>
							<Grid item xs={12} className="flex justify-end">
								<Button>Tambahkan</Button>
							</Grid>
						</Grid>
					</FormProvider>
				</div>
			}
		/>
	);
};

export default DialogBanner;
