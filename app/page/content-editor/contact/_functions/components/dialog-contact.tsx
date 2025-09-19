import FormProvider from "@/components/RHForm/FormProvider";
import DialogModal from "@/components/custom/dialog/dialog-modal";
import { Grid } from "@/components/grid";
import { Button } from "@/components/ui/button";
import { yupResolver } from "@hookform/resolvers/yup";

import { useForm } from "react-hook-form";
import RHFTextField from "@/components/RHForm/RHFTextField";
import {
	usePostGlobalVariable,
	usePutGlobalVariable,
} from "@/api/global-variable";
import { ContactSchema, type ContactType } from "../models/contact";
import type { GlobalVariableTypes } from "@/types/GlobalVariableTypes";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";

interface DialogSocialMediaProps {
	open: boolean;
	onClose: () => void;
	data?: ContactType;
	refetch?: () => void;
	isEditMode?: boolean;
}

const DialogContact = ({
	open,
	onClose,
	data,
	refetch,
	isEditMode,
}: DialogSocialMediaProps) => {
	const methods = useForm({
		defaultValues: {
			id: "",
			address: "",
			contact: [
				{ id: "", phone: "", email: "" },
				{ id: "", phone: "", email: "" },
				{ id: "", phone: "", email: "" },
			],
		},
		shouldFocusError: false,
		mode: "onChange",
		//resolver: yupResolver(ContactSchema),
	});

	const { mutate: mutatePost, isPending: pendingPost } =
		usePostGlobalVariable();
	const { mutate: mutateEdit, isPending: pendingEdit } = usePutGlobalVariable();

	const onSubmit = () => {
		const form = methods.watch();

		const dataForm: GlobalVariableTypes = {
			id: data?.id || "",
			name: "contact",
			description: "The contact on microsite",
			is_active: true,
			var_value: JSON.stringify(form),
		};

		if (data?.id) {
			mutateEdit(dataForm, {
				onSuccess: () => {
					onClose();
					methods.clearErrors();
					methods.reset();
					refetch && refetch();
					enqueueSnackbar("Data has been changed", {
						variant: "success",
					});
				},
				onError: () => {
					enqueueSnackbar("Error: Failed to change data", {
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
					enqueueSnackbar("Data has been added", {
						variant: "success",
					});
				},
				onError: () => {
					enqueueSnackbar("Error: Failed to create data", {
						variant: "error",
					});
				},
			});
		}
	};

	useEffect(() => {
		if (open && data) {
			methods.reset(data);
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
			headerTitle={
				isEditMode ? "Lihat Kontak" : data?.id ? "Ubah Kontak" : "Tambah Kontak"
			}
			contentProps="w-[780px] max-h-[800px] overflow-y-scroll"
			content={
				<div className="">
					<FormProvider methods={methods}>
						<Grid container spacing={4}>
							<Grid item xs={4}>
								<RHFTextField
									disabled={isEditMode}
									name="contact.0.phone"
									label="Nomor Telpon 1"
									placeholder="Masukan Nomor Telfon"
									autoFocus={false}
									//required={!isEditMode}
									type="number"
								/>
							</Grid>
							<Grid item xs={4}>
								<RHFTextField
									disabled={isEditMode}
									name="contact.1.phone"
									label="Nomor Telpon 2"
									placeholder="Masukan Nomor Telfon"
									autoFocus={false}
									//required={!isEditMode}
									type="number"
								/>
							</Grid>
							<Grid item xs={4}>
								<RHFTextField
									disabled={isEditMode}
									name="contact.2.phone"
									label="Nomor Telpon 3"
									placeholder="Masukan Nomor Telfon"
									autoFocus={false}
									//required={!isEditMode}
									type="number"
								/>
							</Grid>
							<Grid item xs={4}>
								<RHFTextField
									disabled={isEditMode}
									name="contact.0.email"
									label="Alamat Email 1"
									placeholder="Masukan Alamat Email"
									autoFocus={false}
									//required={!isEditMode}
									type="email"
								/>
							</Grid>
							<Grid item xs={4}>
								<RHFTextField
									disabled={isEditMode}
									name="contact.1.email"
									label="Alamat Email 2"
									placeholder="Masukan Alamat Email"
									autoFocus={false}
									//required={!isEditMode}
									type="email"
								/>
							</Grid>
							<Grid item xs={4}>
								<RHFTextField
									disabled={isEditMode}
									name="contact.2.email"
									label="Alamat Email 3"
									placeholder="Masukan Alamat Email"
									autoFocus={false}
									//required={!isEditMode}
									type="email"
								/>
							</Grid>

							<Grid item xs={12}>
								<RHFTextField
									disabled={isEditMode}
									name="address"
									label="Alamat"
									placeholder="Masukan alamat"
									autoFocus={false}
									required={!isEditMode}
								/>
							</Grid>

							<Grid item xs={12} className="flex justify-end">
								<Button
									disabled={isEditMode}
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

export default DialogContact;
