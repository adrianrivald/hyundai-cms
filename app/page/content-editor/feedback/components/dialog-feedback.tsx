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
													onChange={(text) => {
														methods.setValue(`questions.${index}.type`, text);
														// if (text === "radio") {
														methods.setValue(
															`questions.${index}.answer.radio_answer`,
															[{}]
														);
														methods.setValue(
															`questions.${index}.answer.radio_answer_en`,
															[{}]
														);
														//}
														//if (text === "checkbox") {
														methods.setValue(
															`questions.${index}.answer.checkbox_answer`,
															[{}]
														);
														methods.setValue(
															`questions.${index}.answer.checkbox_answer_en`,
															[{}]
														);
														//}
													}}
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
											{(methods.watch(`questions.${index}.type`) === "radio" ||
												methods.watch(`questions.${index}.type`) ===
													"checkbox") && (
												<div className=" flex flex-row justify-end">
													<Button
														onClick={() => {
															if (
																methods.watch(`questions.${index}.type`) === ""
															) {
																return;
															}

															if (
																methods.watch(`questions.${index}.type`) ===
																"radio"
															) {
																const data_id = methods.watch(
																	`questions.${index}.answer.checkbox_answer`
																);
																const data_en = methods.watch(
																	`questions.${index}.answer.checkbox_answer_en`
																);

																data_id.push({});
																data_en.push({});

																methods.setValue(
																	`questions.${index}.answer.checkbox_answer`,
																	data_id
																);
																methods.setValue(
																	`questions.${index}.answer.checkbox_answer_en`,
																	data_en
																);
															} else {
																const data_id = methods.watch(
																	`questions.${index}.answer.checkbox_answer`
																);
																const data_en = methods.watch(
																	`questions.${index}.answer.checkbox_answer_en`
																);

																data_id.push({});
																data_en.push({});

																methods.setValue(
																	`questions.${index}.answer.checkbox_answer`,
																	data_id
																);
																methods.setValue(
																	`questions.${index}.answer.checkbox_answer_en`,
																	data_en
																);
															}
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
											{methods.watch(`questions.${index}.type`) ===
												"checkbox" && (
												<div className="space-y-4">
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
																	{methods.watch(
																		`questions.${index}.answer.checkbox_answer`
																	).length > 1 && (
																		<Grid item xs={2} className="">
																			<div
																				className="cursor-pointer mt-2  w-[30px]"
																				onClick={() => {
																					const answer_id = methods.watch(
																						`questions.${index}.answer.checkbox_answer`
																					);
																					const answer_en = methods.watch(
																						`questions.${index}.answer.checkbox_answer`
																					);
																					const updated = [...answer_id];
																					const updated_en = [...answer_en];
																					updated.splice(index, 1);
																					updated_en.splice(index, 1);
																					methods.setValue(
																						`questions.${index}.answer.checkbox_answer`,
																						updated,
																						{
																							shouldValidate: true,
																						}
																					);
																					methods.setValue(
																						`questions.${index}.answer.checkbox_answer_en`,
																						updated_en,
																						{
																							shouldValidate: true,
																						}
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

											{methods.watch(`questions.${index}.type`) === "radio" && (
												<div className="space-y-4">
													{methods
														.watch(`questions.${index}.answer.radio_answer`)
														.map((idx) => {
															return (
																<Grid container spacing={4} className="w-full ">
																	<Grid item xs={5}>
																		<RHFTextField
																			name={`questions.${index}.answer.radio_answer.${idx}`}
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
																			name={`questions.${index}.answer.radio_answer_en.${idx}`}
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
																	{methods.watch(
																		`questions.${index}.answer.radio_answer`
																	).length > 1 && (
																		<Grid item xs={2} className="">
																			<div
																				className="cursor-pointer mt-2  w-[30px]"
																				onClick={() => {
																					const answer_id = methods.watch(
																						`questions.${index}.answer.radio_answer`
																					);
																					const answer_en = methods.watch(
																						`questions.${index}.answer.radio_answer_en`
																					);
																					const updated = [...answer_id];
																					const updated_en = [...answer_en];
																					updated.splice(index, 1);
																					updated_en.splice(index, 1);
																					methods.setValue(
																						`questions.${index}.answer.radio_answer`,
																						updated,
																						{
																							shouldValidate: true,
																						}
																					);
																					methods.setValue(
																						`questions.${index}.answer.radio_answer_en`,
																						updated_en,
																						{
																							shouldValidate: true,
																						}
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
							<Grid item xs={12} className="">
								<div className="flex flex-row justify-end">
									<Button className="w-[80px]">Save</Button>
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
