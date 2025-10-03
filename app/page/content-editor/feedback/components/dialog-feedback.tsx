import FormProvider from "@/components/RHForm/FormProvider";
import RHFCheckboxGroup from "@/components/RHForm/RHFCheckboxGroup";
import RHFSelect from "@/components/RHForm/RHFSelect";
import RHFTextField from "@/components/RHForm/RHFTextField";
import DialogModal from "@/components/custom/dialog/dialog-modal";
import { Grid } from "@/components/grid";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useForm } from "react-hook-form";

interface DialogFeedbackProps {
	open: boolean;
	onClose: () => void;
}

const DialogFeedback = ({ open, onClose }: DialogFeedbackProps) => {
	const methods = useForm({
		mode: "all",
		defaultValues: {
			title: "",
			questions: [
				{
					question: "",
					question_en: "",
					type: "",
					answer: {
						radio_answer: [{}],
						radio_answer_en: [{}],
						checkbox_answer: [{}],
						checkbox_answer_en: [{}],
					},
				},
			],
		},
	});

	return (
		<DialogModal
			open={open}
			onOpenChange={() => {
				onClose();
				methods.clearErrors();
				methods.reset();
			}}
			headerTitle={"Create Feedback"}
			contentProps="w-[700px] max-h-[80%] overflow-y-scroll"
			content={
				<div className="">
					<FormProvider methods={methods}>
						<Grid container spacing={4}>
							<Grid item xs={12}>
								<RHFTextField
									name="title"
									label="Title"
									placeholder="Input title form"
									autoFocus={false}
									required
								/>
							</Grid>

							{methods.watch("questions").map((_, index) => {
								return (
									<>
										<Grid item xs={7} className="space-y-3">
											<RHFTextField
												name={`questions.${index}.question`}
												label={`Question ${index + 1}`}
												placeholder="Input question ID"
												autoFocus={false}
												required
											/>
											<RHFTextField
												name={`questions.${index}.question_en`}
												placeholder="Input question EN"
												autoFocus={false}
												required
											/>
										</Grid>
										<Grid item xs={5}>
											<div className="flex flex-row gap-[6px] items-end ">
												<RHFSelect
													name={`questions.${index}.type`}
													label="Type of question"
													options={[
														{
															type: "text",
															name: "Text",
															icon: "mdi:message-text",
														},
														{
															type: "checkbox",
															name: "Multiple Choice",
															icon: "carbon:checkbox-checked",
														},
														{
															type: "radio",
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
												/>
												{methods.watch("questions")?.length > 1 && (
													<div
														className="cursor-pointer mb-2"
														onClick={() => {
															const questions = methods.watch("questions");
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

										<Grid item xs={12}>
											{methods.watch(`questions.${index}.type`) ===
												"checkbox" && (
												<div>
													{methods
														.watch(`questions.${index}.answer.checkbox_answer`)
														.map((idx) => {
															return (
																<Grid container spacing={4} className="w-full ">
																	<Grid item xs={5}>
																		<RHFTextField
																			name={`questions.${index}.answer.checkbox_answer.${idx}`}
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
																			name={`questions.${index}.answer.checkbox_answer_en.${idx}`}
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
																</Grid>
															);
														})}
												</div>
											)}

											{methods.watch(`questions.${index}.type`) === "radio" && (
												<div>
													{methods
														.watch(`questions.${index}.answer.checkbox_answer`)
														.map((idx) => {
															return (
																<Grid container spacing={4} className="w-full ">
																	<Grid item xs={5}>
																		<RHFTextField
																			name={`questions.${index}.answer.checkbox_answer.${idx}`}
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
																			name={`questions.${index}.answer.checkbox_answer_en.${idx}`}
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
																</Grid>
															);
														})}
												</div>
											)}
										</Grid>
									</>
								);
							})}
							<Grid item xs={12}>
								<div className="flex flex-row justify-end">
									<Button
										variant={"hmmiGhost"}
										onClick={() => {
											const data = methods.watch("questions");
											data.push({
												question: "",
												question_en: "",
												type: "",
												answer: {
													radio_answer: [{}],
													radio_answer_en: [{}],
													checkbox_answer: [{}],
													checkbox_answer_en: [{}],
												},
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
						</Grid>
					</FormProvider>
				</div>
			}
		/>
	);
};

export default DialogFeedback;
