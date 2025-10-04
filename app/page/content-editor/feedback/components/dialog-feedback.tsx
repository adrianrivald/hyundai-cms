import {
	usePostFeedback,
	type FeedbackTypePost,
	usePutFeedback,
} from "@/api/feedback";
import FormProvider from "@/components/RHForm/FormProvider";
import RHFSelect from "@/components/RHForm/RHFSelect";
import RHFTextField from "@/components/RHForm/RHFTextField";
import DialogModal from "@/components/custom/dialog/dialog-modal";
import { Grid } from "@/components/grid";
import { Button } from "@/components/ui/button";
import { yupResolver } from "@hookform/resolvers/yup";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useForm } from "react-hook-form";
import { FeedbackSchema } from "../models/feedback";
import { enqueueSnackbar } from "notistack";

interface DialogFeedbackProps {
	open: boolean;
	onClose: () => void;
	id?: number;
}

const DialogFeedback = ({ open, onClose, id }: DialogFeedbackProps) => {
	const methods = useForm({
		mode: "all",
		defaultValues: {
			name: "",
			description: "-",
			questions: [
				{
					question_id: "",
					question_en: "",
					is_mandatory: true,
					form_type: "",
					answers: [{ answer_id: "", answer_en: "" }],
				},
			],
		},
		resolver: yupResolver(FeedbackSchema),
	});

	const { mutate: mutatePost, isPending: pendingPost } = usePostFeedback();
	const { mutate: mutateEdit, isPending: pendingEdit } = usePutFeedback();

	const onSubmit = () => {
		const form = methods.watch();

		const data: FeedbackTypePost = {
			id: form.id ? Number(form.id) : undefined,
			name: form.name,
			description: form.description,
			questions: form?.questions
				? form?.questions?.map((q: any) => {
						const base = {
							question_id: String(q.question_id),
							question_en: String(q.question_en),
							is_mandatory: String(q.is_mandatory ?? "true"),
							form_type: String(q.form_type),
						};

						if (["radio_button", "checkbox"].includes(q.form_type)) {
							return {
								...base,
								answers: (q.answers ?? []).map((a: any) => ({
									answer_id: a.answer_id ?? "",
									answer_en: a.answer_en ?? "",
								})),
							};
						}

						return base;
					})
				: [],
		};

		if (id) {
			// mutateEdit(
			// 	{ ...postArticle, id: Number(id) || 0 },
			// 	{
			// 		onSuccess: () => {
			// 			methods.reset();
			// 			navigate("/content-editor/article");
			// 			enqueueSnackbar("Data has been changed", { variant: "success" });
			// 		},
			// 		onError: () => {
			// 			enqueueSnackbar("Error: Ubah artikel gagal", { variant: "error" });
			// 		},
			// 	}
			// );
		} else {
			mutatePost(data, {
				onSuccess: () => {
					methods.reset();
					onClose();
					enqueueSnackbar("Data has been added", { variant: "success" });
				},
				onError: (err: any) => {
					enqueueSnackbar(`Error: ${err.response?.data?.message}`, {
						variant: "error",
					});
				},
			});
		}
	};

	return (
		<DialogModal
			open={open}
			onOpenChange={() => {
				onClose();
				methods.clearErrors();
				methods.reset();
			}}
			headerTitle={"Create Feedback"}
			contentProps="w-[800px] max-h-[80%] overflow-y-scroll"
			content={
				<div className="">
					<FormProvider methods={methods}>
						<Grid container spacing={4}>
							<Grid item xs={12}>
								<RHFTextField
									name="name"
									label="Title"
									placeholder="Input title form"
									autoFocus={false}
									required
								/>
							</Grid>
							<Grid item xs={12}>
								{methods.watch("questions")?.map((_, index) => {
									return (
										<Grid container key={index} spacing={4} className="mb-5">
											<Grid item xs={7} className="space-y-3">
												<RHFTextField
													name={`questions.${index}.question_id`}
													label={`Question ${index + 1}`}
													placeholder="Input question ID"
													autoFocus={false}
													required
												/>
											</Grid>
											<Grid item xs={5}>
												<div className="flex flex-row gap-[6px] items-end ">
													<RHFSelect
														name={`questions.${index}.form_type`}
														label="Type of question"
														options={[
															{
																type: "free_text",
																name: "Text",
																icon: "mdi:message-text",
															},
															{
																type: "checkbox",
																name: "Multiple Choice",
																icon: "carbon:checkbox-checked",
															},
															{
																type: "radio_button",
																name: "Choice",
																icon: "ic:baseline-radio-button-checked",
															},
															{
																type: "rating",
																name: "Rating",
																icon: "material-symbols-light:star",
															},
														]}
														className="flex-1"
														placeholder="Choose"
														getOptionLabel={(user) => user.name}
														getOptionValue={(user) => String(user.type)}
														onChange={(text) => {
															methods.setValue(
																`questions.${index}.form_type`,
																text
															);
															// if (text === "radio") {
															methods.setValue(`questions.${index}.answers`, [
																{ answer_id: "", answer_en: "", sort: 1 },
															]);
															//}
														}}
													/>
													{(methods.watch("questions")?.[index]?.answers
														?.length || 0) > 1 && (
														<div
															className="cursor-pointer mb-2"
															onClick={() => {
																const questions =
																	methods.watch("questions") || [];
																const updated = [...questions];
																updated.splice(index, 1);
																methods.setValue("questions", updated, {
																	shouldValidate: true,
																});
															}}
														>
															<Icon
																icon="mage:trash"
																width="24"
																height="24"
																color="#FF3B30"
															/>
														</div>
													)}
												</div>
											</Grid>
											<Grid item xs={7}>
												<RHFTextField
													name={`questions.${index}.question_en`}
													placeholder="Input question EN"
													autoFocus={false}
													required
													className="w-full"
												/>
											</Grid>
											<Grid item xs={5}>
												{(methods.watch(`questions.${index}.form_type`) ===
													"radio_button" ||
													methods.watch(`questions.${index}.form_type`) ===
														"checkbox") && (
													<div className=" flex flex-row justify-end">
														<Button
															onClick={() => {
																const questions =
																	methods.watch("questions") || [];
																const updated = [...questions];
																(updated?.[index]?.answers || []).push({
																	answer_id: "",
																	answer_en: "",
																	sort:
																		(updated[index].answers?.length || 0) + 1,
																});
																methods.setValue("questions", updated);
															}}
															className="hover:bg-transparent"
															variant={"hmmiGhost"}
															startIcon={
																<Icon
																	icon="ic:sharp-plus"
																	width="20"
																	height="20"
																/>
															}
														>
															Add Choice
														</Button>
													</div>
												)}
											</Grid>

											<Grid item xs={12}>
												{methods.watch(`questions.${index}.form_type`) ===
													"checkbox" && (
													<div className="space-y-4">
														{(
															methods.watch(`questions.${index}.answers`) || []
														).map((_, idx) => {
															return (
																<Grid container spacing={4} className="w-full ">
																	<Grid item xs={5}>
																		<RHFTextField
																			name={`questions.${index}.answers.${idx}.answer_id`}
																			//label={`Question ${index + 1}`}
																			placeholder="Input choice ID"
																			autoFocus={false}
																			required
																			startIcon={
																				<Icon
																					icon="carbon:square-outline"
																					width="20"
																					height="20"
																				/>
																			}
																		/>
																	</Grid>
																	<Grid item xs={5}>
																		<RHFTextField
																			name={`questions.${index}.answers.${idx}.answer_en`}
																			//label={`Question ${index + 1}`}
																			placeholder="Input choice EN"
																			autoFocus={false}
																			required
																			startIcon={
																				<Icon
																					icon="carbon:square-outline"
																					width="20"
																					height="20"
																				/>
																			}
																		/>
																	</Grid>
																	{(
																		methods.watch(
																			`questions.${index}.answers`
																		) || []
																	).length > 1 && (
																		<Grid item xs={2} className="">
																			<div
																				className="cursor-pointer mt-2  w-[30px]"
																				onClick={() => {
																					const questions =
																						methods.watch("questions") || [];
																					const updated = [...questions];
																					(
																						updated?.[index]?.answers || []
																					).splice(idx, 1);
																					methods.setValue(
																						"questions",
																						updated
																					);
																				}}
																			>
																				<Icon
																					icon="mage:trash"
																					width="24"
																					height="24"
																					color="#FF3B30"
																				/>
																			</div>
																		</Grid>
																	)}
																</Grid>
															);
														})}
													</div>
												)}

												{methods.watch(`questions.${index}.form_type`) ===
													"radio_button" && (
													<div className="space-y-4">
														{(
															methods.watch(`questions.${index}.answers`) || []
														).map((_, idx) => {
															return (
																<Grid container spacing={4} className="w-full ">
																	<Grid item xs={5}>
																		<RHFTextField
																			name={`questions.${index}.answers.${idx}.answer_id`}
																			//label={`Question ${index + 1}`}
																			placeholder="Input choice ID"
																			autoFocus={false}
																			required
																			startIcon={
																				<Icon
																					icon="carbon:circle-outline"
																					width="20"
																					height="20"
																				/>
																			}
																		/>
																	</Grid>
																	<Grid item xs={5}>
																		<RHFTextField
																			name={`questions.${index}.answers.${idx}.answer_en`}
																			//label={`Question ${index + 1}`}
																			placeholder="Input choice EN"
																			autoFocus={false}
																			required
																			startIcon={
																				<Icon
																					icon="carbon:circle-outline"
																					width="20"
																					height="20"
																				/>
																			}
																		/>
																	</Grid>
																	{(
																		methods.watch(
																			`questions.${index}.answers`
																		) || []
																	).length > 1 && (
																		<Grid item xs={2} className="">
																			<div
																				className="cursor-pointer mt-2  w-[30px]"
																				onClick={() => {
																					const questions =
																						methods.watch("questions") || [];
																					const updated = [...questions];
																					(
																						updated?.[index]?.answers || []
																					).splice(idx, 1);
																					methods.setValue(
																						"questions",
																						updated
																					);
																				}}
																			>
																				<Icon
																					icon="mage:trash"
																					width="24"
																					height="24"
																					color="#FF3B30"
																				/>
																			</div>
																		</Grid>
																	)}
																</Grid>
															);
														})}
													</div>
												)}
											</Grid>
										</Grid>
									);
								})}
							</Grid>
							<Grid item xs={12}>
								<div className="flex flex-row justify-end">
									<Button
										variant={"hmmiGhost"}
										onClick={() => {
											const data = methods.watch("questions");
											if (!data) return;
											data.push({
												question_id: "",
												question_en: "",
												is_mandatory: true,
												form_type: "",
												min_range: 1,
												max_range: 5,
												answers: [],
												sort: data.length + 1,
											});
											methods.setValue("questions", data);
										}}
										className="hover:bg-transparent"
										startIcon={
											<Icon icon="ic:sharp-plus" width="20" height="20" />
										}
									>
										Question
									</Button>
								</div>
							</Grid>
							<Grid item xs={12} className="">
								<div className="flex flex-row justify-end">
									<Button
										className="w-[80px]"
										onClick={() => {
											methods.trigger().then((valid) => {
												if (valid) {
													onSubmit();
												}
											});
										}}
									>
										Save
									</Button>
								</div>
							</Grid>
						</Grid>
					</FormProvider>
				</div>
			}
		/>
	);
};

export default DialogFeedback;
