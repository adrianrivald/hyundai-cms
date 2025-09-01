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
import { SocialMediaSchema } from "../models/social-media";

interface DialogSocialMediaProps {
	open: boolean;
	onClose: () => void;
	data?: any;
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
			max_post: "",
		},
		shouldFocusError: false,
		mode: "onChange",
		resolver: yupResolver(SocialMediaSchema),
	});

	return (
		<DialogModal
			open={open}
			onOpenChange={() => {
				onClose();
				methods.clearErrors();
				methods.reset();
			}}
			headerTitle={data?.id ? "Ubah Social Media" : "Tambah Social Media"}
			contentProps="w-[700px] max-h-[750px] overflow-y-scroll"
			content={
				<div className="">
					<FormProvider methods={methods}>
						<Grid container spacing={4}>
							<Grid item xs={12}>
								<RHFTextField
									name="title"
									label="Judul"
									placeholder="Masukan judul video"
									autoFocus={false}
									required
								/>
							</Grid>
							<Grid item xs={12}>
								<RHFTextField
									name="type"
									label="Tipe Sosial Media"
									placeholder="Masukan tipe sosial media"
									autoFocus={false}
									required
								/>
							</Grid>
							<Grid item xs={12}>
								<RHFTextField
									name="link"
									label="Social Media Link"
									placeholder="Masukan link video"
									autoFocus={false}
									required
								/>
							</Grid>

							<Grid item xs={12} className="flex justify-end">
								<Button
									//loading={pendingEdit || pendingPost}
									onClick={() => {
										methods.trigger().then((isValid) => {
											if (isValid) {
												//onSubmit();
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
