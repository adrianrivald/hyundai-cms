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

import type { GlobalVariableTypes } from "@/types/GlobalVariableTypes";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";

import { QuillEditor } from "@/components/RHForm/RHFQuillEditor";
import { Typography } from "@/components/typography";
import { cn } from "@/lib/utils";
import { type LegalContentType } from "../models/legal";

interface DialogSocialMediaProps {
	open: boolean;
	onClose: () => void;
	data?: LegalContentType[];
	refetch?: () => void;
	isEditMode?: boolean;
}

const DialogLegal = ({
	open,
	onClose,
	data,
	refetch,
	isEditMode,
}: DialogSocialMediaProps) => {
	const [tab, setTabs] = useState("id");
	const methods = useForm({
		defaultValues: {
			id: "",
			data: [
				{ title: "", language: "id", content: "" },
				{ title: "", language: "en", content: "" },
			],
		},
		shouldFocusError: false,
		mode: "onChange",
		//resolver: yupResolver(LegalContentSchema),
	});

	const { mutate: mutatePost, isPending: pendingPost } =
		usePostGlobalVariable();
	const { mutate: mutateEdit, isPending: pendingEdit } = usePutGlobalVariable();

	const onSubmit = () => {
		const form = methods.watch();
		const dataForm: GlobalVariableTypes = {
			id: form?.id || "",
			name: "legal",
			description: "The contact on microsite",
			is_active: true,
			var_value: JSON.stringify(form.data),
		};
		if (form?.id) {
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
			methods.reset({
				id: data?.[0].id,
				data: data,
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
			headerTitle={
				isEditMode
					? "Lihat Legal"
					: methods.watch("id")
						? "Ubah Legal"
						: "Tambah Legal"
			}
			contentProps="w-[700px] max-h-[750px] overflow-y-scroll"
			content={
				<div className="">
					<FormProvider methods={methods}>
						<Grid container className="mb-5">
							<Grid
								item
								xs={6}
								onClick={() => {
									setTabs("id");
								}}
								className={cn(
									"py-4 px-5 cursor-pointer",
									tab === "id" ? "bg-[#153263]" : "bg-[#1532630D]"
								)}
							>
								<Typography
									className={cn(tab !== "id" ? "text-[#6B8BC1]" : "text-white")}
								>
									Indonesia
								</Typography>
							</Grid>
							<Grid
								item
								xs={6}
								onClick={() => {
									setTabs("en");
								}}
								className={cn(
									"py-4 px-5 cursor-pointer",
									tab === "en" ? "bg-[#153263]" : "bg-[#1532630D]"
								)}
							>
								<Typography
									className={cn(tab !== "en" ? "text-[#6B8BC1]" : "text-white")}
								>
									English
								</Typography>
							</Grid>
						</Grid>
						<Grid container spacing={4}>
							{tab === "id" && (
								<>
									<Grid item xs={12}>
										<RHFTextField
											disabled={isEditMode}
											name="data.0.title"
											label="Judul"
											placeholder="Masukan Judul"
											autoFocus={false}
											required
										/>
									</Grid>

									<Grid item xs={12}>
										<QuillEditor
											name="data.0.content"
											control={methods.control}
											placeholder={"Masukan isi konten"}
										/>
									</Grid>
								</>
							)}

							{tab === "en" && (
								<>
									<Grid item xs={12}>
										<RHFTextField
											disabled={isEditMode}
											name="data.1.title"
											label="Judul"
											placeholder="Masukan Judul"
											autoFocus={false}
											required
										/>
									</Grid>

									<Grid item xs={12}>
										<QuillEditor
											name="data.1.content"
											control={methods.control}
											placeholder={"Masukan isi konten"}
										/>
									</Grid>
								</>
							)}

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
									{methods.watch("id") ? "Ubah" : "Tambahkan"}
								</Button>
							</Grid>
						</Grid>
					</FormProvider>
				</div>
			}
		/>
	);
};

export default DialogLegal;
