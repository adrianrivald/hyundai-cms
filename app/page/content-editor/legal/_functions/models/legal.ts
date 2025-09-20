import * as yup from "yup";

export type LegalContentType = {
	id: string;
	title: string;
	language: string;
	content: string;
};

export const LegalContentSchema = yup.object({
	id: yup.string().nullable().optional(),
	data: yup
		.array()
		.of(
			yup.object({
				title: yup.string().required("Title is required"),
				language: yup.string().required("Language is required"),
				content: yup.string().required("Content is required"),
			})
		)
		.optional()
		.nullable(),
});
