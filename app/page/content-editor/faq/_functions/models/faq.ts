import * as yup from "yup";

export type FaqType = {
	id?: string;
	question_en: string;
	question_id: string;
	answer_id: string;
	answer_en: string;
};

export const FAQSchema = yup.object({
	faq: yup.array().of(
		yup.object({
			id: yup.string().nullable().optional(),
			question_en: yup.string().required("Question EN is required"),
			question_id: yup.string().required("Question ID is required"),
			answer_id: yup.string().required("Answer ID is required"),
			answer_en: yup.string().required("Answer EN is required"),
		})
	),
});
