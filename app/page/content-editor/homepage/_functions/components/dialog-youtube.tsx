import FormProvider from "@/components/RHForm/FormProvider";
import DialogModal from "@/components/custom/dialog/dialog-modal";
import { Grid } from "@/components/grid";
import { Button } from "@/components/ui/button";
import { yupResolver } from "@hookform/resolvers/yup";

import { useForm } from "react-hook-form";
import RHFTextField from "@/components/RHForm/RHFTextField";
import { YoutubeSchema } from "../models/youtube";
import ReactPlayer from "react-player";
import {
	usePostGlobalVariable,
	usePutGlobalVariable,
} from "@/api/global-variable";
import { enqueueSnackbar } from "notistack";
import type { GlobalVariableTypes } from "@/types/GlobalVariableTypes";
import { useEffect } from "react";

interface DialogYoutubeProps {
	open: boolean;
	onClose: () => void;
	data?: GlobalVariableTypes;
	refetch?: () => void;
}

const DialogYoutube = ({
	open,
	onClose,
	data,
	refetch,
}: DialogYoutubeProps) => {
	const methods = useForm({
		defaultValues: {
			title: "",
			link: "",
		},
		shouldFocusError: false,
		mode: "onChange",
		resolver: yupResolver(YoutubeSchema),
	});

	const { mutate: mutatePost, isPending: pendingPost } =
		usePostGlobalVariable();
	const { mutate: mutateEdit, isPending: pendingEdit } = usePutGlobalVariable();

	const onSubmit = () => {
		const form = methods.watch();
		const dataForm: GlobalVariableTypes = {
			id: data?.id || "",
			name: "ytb_link_video",
			description: form?.title,
			is_active: true,
			var_value: form?.link,
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
		if (data && open) {
			methods.reset({
				title: data?.description,
				link: data?.var_value,
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
			headerTitle={data?.id ? "Change YouTube Video" : "Add YouTube Video"}
			contentProps="w-[700px] max-h-[750px] overflow-y-scroll"
			content={
				<div className="">
					<FormProvider methods={methods}>
						<Grid container spacing={4}>
							<Grid item xs={12}>
								<RHFTextField
									name="title"
									label="Title"
									placeholder="Input Title"
									autoFocus={false}
									required
								/>
							</Grid>
							<Grid item xs={12}>
								<RHFTextField
									name="link"
									label="Link Video"
									placeholder="Input link video"
									autoFocus={false}
									required
								/>
							</Grid>

							{methods.watch("link") &&
								!methods?.formState?.errors?.["link"]?.message && (
									<Grid item xs={12} className="rounded-lg">
										<ReactPlayer
											style={{ borderRadius: 20 }}
											width={"100%"}
											height={300}
											src={methods.watch("link")}
											onError={(e) => {
												methods.setError("link", {
													type: "manual",
													message:
														"The video cannot be played. Check the YouTube link.",
												});
											}}
										/>
									</Grid>
								)}

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
									{data?.id ? "Edit" : "Add"}
								</Button>
							</Grid>
						</Grid>
					</FormProvider>
				</div>
			}
		/>
	);
};

export default DialogYoutube;
