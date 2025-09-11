import FormProvider from "@/components/RHForm/FormProvider";
import DialogModal from "@/components/custom/dialog/dialog-modal";
import { Grid } from "@/components/grid";
import { Button } from "@/components/ui/button";
import { yupResolver } from "@hookform/resolvers/yup";

import { useForm } from "react-hook-form";
import RHFTextField from "@/components/RHForm/RHFTextField";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";
import { FAQSchema } from "../models/faq";
import { type FAQType, useSaveFaq } from "@/api/faq";
import RHFTextArea from "@/components/RHForm/RHFTextArea";
import { Typography } from "@/components/typography";
import { Icon } from "@iconify/react/dist/iconify.js";

interface DialogSocialMediaProps {
	open: boolean;
	onClose: () => void;
	data?: FAQType;
	refetch?: () => void;
	isEditMode?: boolean;
}

const DialogFaq = ({
	open,
	onClose,
	data,
	refetch,
	isEditMode,
}: DialogSocialMediaProps) => {
	const methods = useForm({
		defaultValues: {
			faq: [
				{
					id: "",
					question_en: "",
					question_id: "",
					answer_id: "",
					answer_en: "",
				},
			],
		},
		shouldFocusError: false,
		mode: "onChange",
		resolver: yupResolver(FAQSchema),
	});

	const { mutate, isPending: pendingPost } = useSaveFaq();

	const onSubmit = () => {
		const form: any = methods.watch("faq")?.map((item) => item);

		mutate(form, {
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
				enqueueSnackbar("Error: Ubah data gagal", {
					variant: "error",
				});
			},
		});
	};

	useEffect(() => {
		if (open && data) {
			methods.reset({
				faq: [
					{
						id: String(data?.id),
						question_en: data?.question_en,
						question_id: data?.question_id,
						answer_en: data?.answer_en,
						answer_id: data?.answer_id,
					},
				],
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
					? "Lihat Pertanyaan"
					: data?.id
						? "Ubah Pertanyaan"
						: "Tambah Pertanyaan"
			}
			contentProps="w-[850px] max-h-[750px] overflow-y-scroll"
			content={
				<div className="">
					<FormProvider methods={methods}>
						<Grid container spacing={4}>
							{methods.watch("faq")?.map((_, index) => {
								return (
									<>
										<Grid
											item
											xs={12}
											className="flex flex-row justify-between items-center"
										>
											<Typography className="font-medium">
												Pertanyaan {index + 1}
											</Typography>

											{(methods?.watch("faq") || [])?.length > 1 && (
												<div
													className="cursor-pointer"
													onClick={() => {
														const data = methods.watch("faq") || [];
														const newData = data.filter((_, i) => i !== index);
														methods.setValue("faq", newData);
													}}
												>
													<Icon
														icon="mage:trash"
														width="22"
														height="22"
														color={"#FF3B30"}
													/>
												</div>
											)}
										</Grid>
										<Grid item xs={6}>
											<RHFTextField
												disabled={isEditMode}
												name={`faq.${index}.question_id`}
												label="Pertanyaan"
												placeholder="Masukan Pertanyaan"
												autoFocus={false}
												required
											/>
										</Grid>
										<Grid item xs={6}>
											<RHFTextField
												disabled={isEditMode}
												name={`faq.${index}.question_en`}
												label="Question"
												placeholder="Input Question"
												autoFocus={false}
												required
											/>
										</Grid>
										<Grid item xs={6}>
											<RHFTextArea
												disabled={isEditMode}
												name={`faq.${index}.answer_id`}
												label="Jawaban"
												placeholder="Masukan Jawaban"
												required
												rows={5}
											/>
										</Grid>
										<Grid item xs={6}>
											<RHFTextArea
												disabled={isEditMode}
												name={`faq.${index}.answer_en`}
												label="Answer"
												placeholder="Input Answer"
												required
												rows={5}
											/>
										</Grid>
									</>
								);
							})}
							{!data && (
								<Grid item xs={12}>
									<div
										className="mt-5 flex-row flex items-center justify-start cursor-pointer gap-1"
										onClick={() => {
											let data = methods.watch("faq");
											methods.setValue("faq", [
												...(data || []),
												{
													id: "",
													question_en: "",
													question_id: "",
													answer_en: "",
													answer_id: "",
												},
											]);
										}}
									>
										<Icon icon="ic:outline-plus" width="24" height="24" />
										<Typography className="font-bold">
											Tambah Pertanyaan
										</Typography>
									</div>
								</Grid>
							)}

							<Grid item xs={12} className="flex justify-end">
								<Button
									disabled={isEditMode}
									loading={pendingPost}
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

export default DialogFaq;
