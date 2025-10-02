import FormProvider from "@/components/RHForm/FormProvider";
import RHFCheckboxGroup from "@/components/RHForm/RHFCheckboxGroup";
import RHFSelect from "@/components/RHForm/RHFSelect";
import RHFTextField from "@/components/RHForm/RHFTextField";
import DialogModal from "@/components/custom/dialog/dialog-modal";
import { Grid } from "@/components/grid";
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
					type: "",
					answer: {
						text_answer: "",
						radio_answer: [{}],
						checkbox_answer: [{}],
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
										<Grid item xs={7}>
											<RHFTextField
												name={`questions.${index}.question`}
												label={`Question ${index + 1}`}
												placeholder="Input question"
												autoFocus={false}
												required
											/>
										</Grid>
										<Grid item xs={5}>
											<RHFSelect
												name={`questions.${index}.type`}
												label="Type of question"
												options={[
													{
														type: "text",
														name: "Text",
													},
													{
														type: "checkbox",
														name: "Multiple Choice",
													},
													{
														type: "radio",
														name: "Choice",
													},
												]}
												placeholder="Choose"
												getOptionLabel={(user) => user.name}
												getOptionValue={(user) => String(user.type)}
											/>
										</Grid>
										{console.log("type", methods.watch("questions"))}
										<Grid item xs={12}>
											{methods.watch(`questions.${index}.type`) ===
												"checkbox" && (
												<Grid container spacing={4}>
													<Grid item xs={11}>
														<RHFTextField
															name={`question.${index}.question`}
															//label={`Question ${index + 1}`}
															placeholder="Input choice"
															autoFocus={false}
															required
															startIcon={
																<Icon
																	icon="carbon:square-outline"
																	width="22"
																	height="22"
																/>
															}
														/>
													</Grid>
												</Grid>
											)}
										</Grid>
									</>
								);
							})}
						</Grid>
					</FormProvider>
				</div>
			}
		/>
	);
};

export default DialogFeedback;
