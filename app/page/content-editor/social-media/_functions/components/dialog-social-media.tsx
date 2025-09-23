import FormProvider from "@/components/RHForm/FormProvider";
import DialogModal from "@/components/custom/dialog/dialog-modal";
import { Grid } from "@/components/grid";
import { Button } from "@/components/ui/button";
import { yupResolver } from "@hookform/resolvers/yup";

import { useForm } from "react-hook-form";
import RHFTextField from "@/components/RHForm/RHFTextField";
import {
	SocialMediaSchema,
	type SocialMediaGlobal,
} from "../models/social-media";
import RHFSelect from "@/components/RHForm/RHFSelect";
import {
	useGetGlobalVariables,
	usePostGlobalVariable,
	usePutGlobalVariable,
} from "@/api/global-variable";
import type { GlobalVariableTypes } from "@/types/GlobalVariableTypes";
import { getUnixTime } from "date-fns";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";

interface DialogSocialMediaProps {
	open: boolean;
	onClose: () => void;
	data?: SocialMediaGlobal;
	refetch?: () => void;
}

const DialogSocialMedia = ({
	open,
	onClose,
	data,
	refetch,
}: DialogSocialMediaProps) => {
	const methods = useForm({
		defaultValues: {
			title: "",
			type: "",
			link: "",
		},
		shouldFocusError: false,
		mode: "onChange",
		resolver: yupResolver(SocialMediaSchema),
	});

	const { mutate: mutatePost, isPending: pendingPost } =
		usePostGlobalVariable();
	const { mutate: mutateEdit, isPending: pendingEdit } = usePutGlobalVariable();
	const { data: dataSocialMedia } = useGetGlobalVariables({
		queryKey: ["global-variable-social-media"],
		staleTime: 5 * 60 * 1000,
	});

	const onSubmit = () => {
		const form = methods.watch();

		// parse existing social media
		const dataSocmed =
			(
				dataSocialMedia?.data
					.filter((item) => item.name === "social_media")
					.filter((item) => !!item.var_value) as GlobalVariableTypes[]
			)?.map((item) => JSON.parse(item.var_value))?.[0] ?? [];

		// build new/updated item
		const newItem = {
			id: data?.id ?? getUnixTime(new Date()), // if editing, keep old id
			title: form.title,
			social_media: form.type,
			profile: form.link,
		};

		// if editing, replace the item by id; otherwise append
		const dataVar = data
			? dataSocmed.map((item: any) =>
					item.id === data.id ? { ...item, ...newItem } : item
				)
			: [...dataSocmed, newItem];

		// payload
		const dataForm: GlobalVariableTypes = {
			id:
				dataSocialMedia?.data?.filter(
					(item) => item.name === "social_media"
				)?.[0]?.id || "",
			name: "social_media",
			description: "Social media accounts shown in microsite",
			is_active: false,
			var_value: JSON.stringify(dataVar),
		};

		// if record exists in backend, update, otherwise create
		if (dataSocmed.length > 0) {
			mutateEdit(dataForm, {
				onSuccess: () => {
					onClose();
					methods.clearErrors();
					methods.reset();
					refetch && refetch();
					enqueueSnackbar("Data has been changed", { variant: "success" });
				},
				onError: () => {
					enqueueSnackbar("Error: Failed to change data", { variant: "error" });
				},
			});
		} else {
			mutatePost(dataForm, {
				onSuccess: () => {
					onClose();
					methods.clearErrors();
					methods.reset();
					refetch && refetch();
					enqueueSnackbar("Data has been added", { variant: "success" });
				},
				onError: () => {
					enqueueSnackbar("Error: Failed to create data", { variant: "error" });
				},
			});
		}
	};

	useEffect(() => {
		if (data && open) {
			methods.reset({
				id: String(data?.id),
				title: data?.title,
				type: data?.social_media,
				link: data?.profile,
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
			headerTitle={data?.id ? "Ubah Sosial Media" : "Tambah Sosial Media"}
			contentProps="w-[700px] max-h-[750px] overflow-y-scroll"
			content={
				<div className="">
					<FormProvider methods={methods}>
						<Grid container spacing={4}>
							<Grid item xs={12}>
								<RHFTextField
									name="title"
									label="Judul"
									placeholder="Masukan judul sosial media"
									autoFocus={false}
									required
								/>
							</Grid>
							<Grid item xs={12}>
								<RHFSelect
									name="type"
									label="Tipe Sosial Media"
									options={[
										{ id: "Instagram", name: "Instagram" },
										{ id: "YouTube", name: "YouTube" },
										{ id: "Tiktok", name: "Tiktok" },
										{ id: "Linkedin", name: "Linkedin" },
										{ id: "Facebook", name: "Facebook" },
										{ id: "Twitter (X)", name: "Twitter(X)" },
									]}
									placeholder="Pilih tipe sosial media"
									getOptionLabel={(user) => user.id}
									getOptionValue={(user) => String(user.id)}
									required
								/>
							</Grid>
							<Grid item xs={12}>
								<RHFTextField
									name="link"
									label="Social Media Link"
									placeholder="Masukan social media link"
									autoFocus={false}
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

export default DialogSocialMedia;
