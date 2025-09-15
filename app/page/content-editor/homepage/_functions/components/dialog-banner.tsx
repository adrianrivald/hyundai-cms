import FormProvider from "@/components/RHForm/FormProvider";
import RHFDatePicker from "@/components/RHForm/RHFDatePicker";
import RHFTextArea from "@/components/RHForm/RHFTextArea";
import RHFTextField from "@/components/RHForm/RHFTextField";
import RHFUploadFile from "@/components/RHForm/RHFUploadFile";
import DialogModal from "@/components/custom/dialog/dialog-modal";
import { Grid } from "@/components/grid";
import { Button } from "@/components/ui/button";
import { yupResolver } from "@hookform/resolvers/yup";

import { useForm } from "react-hook-form";
import { BannerSchema, type BannerType } from "../models/banner";
import { usePostBanner, usePutBanner } from "@/api/banner";
import { enqueueSnackbar } from "notistack";
import { format } from "date-fns";
import { useEffect } from "react";

interface DialogBannerProps {
	open: boolean;
	onClose: () => void;
	data?: BannerType;
	refetch?: () => void;
}

const DialogBanner = ({ open, onClose, data, refetch }: DialogBannerProps) => {
	const methods = useForm({
		defaultValues: {
			image: "",
			title: "",
			description: "",
			date: "",
			link: "",
		},
		shouldFocusError: false,
		mode: "onChange",
		resolver: yupResolver(BannerSchema),
	});

	const { mutate: mutatePost, isPending: pendingPost } = usePostBanner();
	const { mutate: mutateEdit, isPending: pendingEdit } = usePutBanner();

	const onSubmit = () => {
		const form = methods.watch();
		const dataForm: BannerType = {
			id: data?.id,
			name: form.title || "",
			description: form.description || "",
			image_path: form.image,
			link_url: form.link || "",
			is_active: false,
			published_at: format(new Date(form.date), "yyyy/MM/dd"),
		};
		if (data?.id) {
			mutateEdit(dataForm, {
				onSuccess: () => {
					onClose();
					methods.clearErrors();
					methods.reset();
					refetch && refetch();
					enqueueSnackbar("Data telah diubah", {
						variant: "success",
					});
				},
				onError: () => {
					enqueueSnackbar("Error: Ubah banner gagal", {
						variant: "error",
					});
				},
			});
		} else {
			mutatePost(dataForm, {
				onSuccess: () => {
					onClose();
					methods.clearErrors();
					methods.reset();
					refetch && refetch();
					enqueueSnackbar("Data telah ditambahkan", {
						variant: "success",
					});
				},
				onError: () => {
					enqueueSnackbar("Error: Pembuatan banner gagal", {
						variant: "error",
					});
				},
			});
		}
	};

	useEffect(() => {
		if (data && open) {
			methods.reset({
				image: data?.image_path,
				title: data?.name,
				link: data?.link_url,
				date: data?.published_at,
				description: data?.description,
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
			headerTitle={data?.id ? "Ubah Banner" : "Tambah Banner"}
			contentProps="w-[700px] max-h-[750px] overflow-y-scroll"
			content={
				<div className="">
					<FormProvider methods={methods}>
						<Grid container spacing={4}>
							<Grid item xs={12}>
								<RHFUploadFile name="image" slug="banner" required />
							</Grid>
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
							<Grid item xs={7}>
								<RHFDatePicker
									name="date"
									label="Tanggal Terbit"
									required
									placeholder="Pilih Tanggal Terbit"
									format="dd/MM/yyyy"
									onChange={(date) => {
										if (date) {
											methods.setValue("date", date.toISOString());
											methods.clearErrors("date");
										}
									}}
									minDate={new Date()}
								/>
							</Grid>
							<Grid item xs={12}>
								<RHFTextField
									name="link"
									label="Link URL"
									placeholder="Masukan link url"
									autoFocus={false}
								/>
							</Grid>
							<Grid item xs={12} className="flex justify-end">
								<Button
									loading={pendingEdit || pendingPost}
									onClick={() => {
										methods.trigger().then((isValid) => {
											if (isValid) {
												onSubmit();
											}
										});
									}}
								>
									{data?.id ? "Ubah" : "Tambahkan"}
								</Button>
							</Grid>
						</Grid>
					</FormProvider>
				</div>
			}
		/>
	);
};

export default DialogBanner;
