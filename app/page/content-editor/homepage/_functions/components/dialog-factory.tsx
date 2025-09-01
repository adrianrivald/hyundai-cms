import FormProvider from "@/components/RHForm/FormProvider";
import RHFUploadFile from "@/components/RHForm/RHFUploadFile";
import DialogModal from "@/components/custom/dialog/dialog-modal";
import { Grid } from "@/components/grid";
import { Button } from "@/components/ui/button";
import { yupResolver } from "@hookform/resolvers/yup";

import { useForm } from "react-hook-form";
import { FactorySchema } from "../models/factory";
import RHFTextField from "@/components/RHForm/RHFTextField";
import RHFTextArea from "@/components/RHForm/RHFTextArea";
import { usePostFactory, usePutFactory, type FactoryType } from "@/api/factory";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";

interface DialogFactoryProps {
	open: boolean;
	onClose: () => void;
	data?: FactoryType;
	refetch?: () => void;
}

const DialogFactory = ({
	open,
	onClose,
	data,
	refetch,
}: DialogFactoryProps) => {
	const methods = useForm({
		defaultValues: {
			id: "",
			image: "",
			factory_name: "",
			description: "",
		},
		shouldFocusError: false,
		mode: "onChange",
		resolver: yupResolver(FactorySchema),
	});

	const { mutate: mutatePost, isPending: pendingPost } = usePostFactory();
	const { mutate: mutateEdit, isPending: pendingEdit } = usePutFactory();

	const onSubmit = () => {
		const form = methods.watch();
		const dataForm: FactoryType = {
			id: data?.id,
			image_path: form.image,
			name: form.factory_name,
			description: form.description,
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
		if (open && data) {
			methods.reset({
				factory_name: data?.name,
				id: data?.id,
				image: data?.image_path,
				description: data?.description,
			});
		}
	}, [open, data]);

	return (
		<DialogModal
			open={open}
			onOpenChange={() => {
				onClose();
				methods.clearErrors();
				methods.reset();
			}}
			headerTitle={data?.id ? "Ubah Pabrik" : "Tambah Pabrik"}
			contentProps="w-[700px] max-h-[750px] overflow-y-scroll"
			content={
				<div className="">
					<FormProvider methods={methods}>
						<Grid container spacing={4}>
							<Grid item xs={12}>
								<RHFUploadFile name="image" slug="factory" required />
							</Grid>
							<Grid item xs={12}>
								<RHFTextField
									name="factory_name"
									label="Nama Pabrik"
									placeholder="Masukan nama pabrik"
									autoFocus={false}
									required
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

export default DialogFactory;
