import * as yup from "yup";

export const FeedbackSchema = yup.object({
	id: yup.string().nullable().optional(),
	title: yup.string().required("Title is required"),
	questions: yup.array().of(
		yup.object({
			question: yup.string().required("Question is required"),
			type: yup.string().required("Type is required"),
			answer: yup.object({
				text_answer: yup.string().optional(),
				radio_answer: yup.array().of(yup.string().optional()),
				checkbox_answer: yup.array().of(yup.string().optional()),
			}),
		})
	),
});
