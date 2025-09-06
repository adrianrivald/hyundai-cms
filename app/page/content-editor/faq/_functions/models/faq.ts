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
			question_en: yup.string().required("Question EN harus di isi"),
			question_id: yup.string().required("Question ID harus di isi"),
			answer_id: yup.string().required("Answer ID harus di isi"),
			answer_en: yup.string().required("Answer EN harus di isi"),
		})
	),
});
