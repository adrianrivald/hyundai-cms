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

	const formatPhone = (value: string) => {
		if (!value) return "";
		const cleaned = value.replace(/\D/g, ""); // keep only digits
		return cleaned.replace(/(\d{3})(?=\d)/g, "$1 ");
	};

	const isValid = () => {
		const form = methods.watch();
		const firstContact = form.contact?.[0];

		if (!firstContact) return false;

		if (!firstContact.email) {
			methods.setError(`contact.0.email`, { message: "Email is required" });
		} else {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
			if (!emailRegex.test(firstContact.email)) {
				methods.setError(`contact.0.email`, { message: "Email must be valid" });
			}
		}

		if (!firstContact.phone) {
			methods.setError(`contact.0.phone`, {
				message: "Phone number is required",
			});
		}

		return Object.keys(methods.formState.errors).length === 0;
	};

	const onSubmit = () => {
		if (!isValid()) return;
		const form = methods.watch();

		const formattedContacts = form.contact.map((c: any) => ({
			...c,
			phone: formatPhone(c.phone),
		}));

		const dataForm: GlobalVariableTypes = {
			id: data?.id || "",
			name: "contact",
			description: "The contact on microsite",
			is_active: true,
			var_value: JSON.stringify({
				...form,
				contact: formattedContacts,
			}),
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
				onError: (err: any) => {
					enqueueSnackbar(`Error : ${err.response?.data?.message}`, {
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
				onError: (err: any) => {
					enqueueSnackbar(`Error : ${err.response?.data?.message}`, {
						variant: "error",
					});
				},
			});
		}
	};

	useEffect(() => {
		if (open && data) {
			methods.reset({
				id: data.id || "",
				address: data.address || "",
				contact: (data.contact || []).map((c: any) => ({
					id: c.id || "",
					phone: (c.phone || "").replace(/\s/g, ""), // remove spaces
					email: c.email || "",
				})),
			});
		}
	}, [open, data, methods]);

	return (
		<DialogModal
			open={open}
			onOpenChange={() => {
				onClose();
				methods.clearErrors();
				methods.reset();
			}}
			headerTitle={
				isEditMode ? "View Contacts" : data?.id ? "Edit Contact" : "Add Contact"
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
									label="Phone Number 1"
									placeholder={isEditMode ? "" : "Input Phone Number"}
									autoFocus={false}
									required={!isEditMode}
									type="number"
									className="disabled:opacity-100 disabled:bg-white"
								/>
							</Grid>
							<Grid item xs={4}>
								<RHFTextField
									disabled={isEditMode}
									name="contact.1.phone"
									label="Phone Number 2"
									placeholder={isEditMode ? "" : "Input Phone Number"}
									autoFocus={false}
									//required={!isEditMode}
									type="number"
									className="disabled:opacity-100 disabled:bg-white"
								/>
							</Grid>
							<Grid item xs={4}>
								<RHFTextField
									disabled={isEditMode}
									name="contact.2.phone"
									label="Phone Number 3"
									placeholder={isEditMode ? "" : "Input Phone Number"}
									autoFocus={false}
									//required={!isEditMode}
									type="number"
									className="disabled:opacity-100 disabled:bg-white"
								/>
							</Grid>
							<Grid item xs={4}>
								<RHFTextField
									disabled={isEditMode}
									name="contact.0.email"
									label="Email Address 1"
									placeholder={isEditMode ? "" : "Input Email Address"}
									autoFocus={false}
									required={!isEditMode}
									type="email"
									className="disabled:opacity-100 disabled:bg-white"
								/>
							</Grid>
							<Grid item xs={4}>
								<RHFTextField
									disabled={isEditMode}
									name="contact.1.email"
									label="Email Address 2"
									placeholder={isEditMode ? "" : "Input Email Address"}
									autoFocus={false}
									//required={!isEditMode}
									type="email"
									className="disabled:opacity-100 disabled:bg-white"
								/>
							</Grid>
							<Grid item xs={4}>
								<RHFTextField
									disabled={isEditMode}
									name="contact.2.email"
									label="Email Address 3"
									placeholder={isEditMode ? "" : "Input Email Address"}
									autoFocus={false}
									//required={!isEditMode}
									type="email"
									className="disabled:opacity-100 disabled:bg-white"
								/>
							</Grid>

							<Grid item xs={12}>
								<RHFTextField
									disabled={isEditMode}
									name="address"
									label="Address"
									placeholder="Input Address"
									autoFocus={false}
									required={!isEditMode}
									className="disabled:opacity-100 disabled:bg-white"
								/>
							</Grid>

							<Grid item xs={12} className="flex justify-end">
								<Button
									disabled={isEditMode}
									loading={pendingEdit || pendingPost}
									onClick={() => {
										// methods.trigger().then((isValid) => {
										// 	if (isValid) {
										onSubmit();
										//}
										//});
									}}
								>
									{data?.id ? "Edit" : "Save"}
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
