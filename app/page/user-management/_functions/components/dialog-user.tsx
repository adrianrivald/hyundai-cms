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
import { enqueueSnackbar } from "notistack";
import { format } from "date-fns";
import { useEffect } from "react";
import { UserSchema } from "../models/user";
import {
	usePostUser,
	usePutUser,
	type PostUserType,
	type UserType,
	useGetRoles,
} from "@/api/user";
import RHFSelect from "@/components/RHForm/RHFSelect";
import type { AxiosError } from "axios";

interface DialogBannerProps {
	open: boolean;
	onClose: () => void;
	data?: UserType;
	refetch?: () => void;
}

const DialogUser = ({ open, onClose, data, refetch }: DialogBannerProps) => {
	const methods = useForm({
		defaultValues: {
			name: "",
			password: "",
			email: "",
			role: "",
		},
		shouldFocusError: false,
		mode: "onChange",
		resolver: yupResolver(UserSchema),
	});

	const { mutate: mutatePost, isPending: pendingPost } = usePostUser();
	const { mutate: mutateEdit, isPending: pendingEdit } = usePutUser();
	const { data: dataRole } = useGetRoles("");

	const onSubmit = () => {
		const form = methods.watch();
		const rawForm: PostUserType = {
			id: data?.id,
			name: form.name || "",
			email: form.email || "",
			role: form.role ? Number(form.role) : 0,
			password: form.password || "",
		};

		const dataForm: Partial<PostUserType> = Object.fromEntries(
			Object.entries(rawForm).filter(([_, value]) => value !== "")
		);
		if (data?.id) {
			// @ts-ignore
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
				onError: (err: any) => {
					enqueueSnackbar(`Error : ${err.response?.data?.message}`, {
						variant: "error",
					});
				},
			});
		} else {
			// @ts-ignore
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
				onError: (err: any) => {
					enqueueSnackbar(`Error : ${err.response?.data?.message}`, {
						variant: "error",
					});
				},
			});
		}
	};

	useEffect(() => {
		if (data && open) {
			methods.reset({
				id: String(data?.id || ""),
				name: data?.name,
				email: data?.email,
				role: String(data?.roles?.[0]?.id || ""),
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
			headerTitle={data?.id ? "Ubah User" : "Tambah User"}
			contentProps="w-[700px] max-h-[750px] overflow-y-scroll"
			content={
				<div className="">
					<FormProvider methods={methods}>
						<Grid container spacing={4}>
							<Grid item xs={12}>
								<RHFTextField
									name="name"
									label="Nama"
									placeholder="Masukan Nama"
									autoFocus={false}
									required
								/>
							</Grid>
							<Grid item xs={12}>
								<RHFTextField
									name="email"
									label="Alamat Email"
									placeholder="Masukan Alamat Email"
									autoFocus={false}
									required
									type="email"
								/>
							</Grid>

							<Grid item xs={12}>
								<RHFTextField
									name="password"
									label="Kata Sandi"
									placeholder="Masukan Kata Sandi"
									autoFocus={false}
									required
									type="password"
								/>
							</Grid>

							<Grid item xs={12}>
								<RHFSelect
									name="role"
									label="Role"
									options={
										dataRole?.data?.map((item) => ({
											id: String(item.id),
											name: item.name,
										})) || []
									}
									placeholder="Pilih Role"
									getOptionLabel={(user) => user.name}
									getOptionValue={(user) => String(user.id)}
									required
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

export default DialogUser;
