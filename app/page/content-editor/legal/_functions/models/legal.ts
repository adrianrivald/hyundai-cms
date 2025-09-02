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
				title: yup.string().required("Title harus di isi"),
				language: yup.string().required("Language harus di isi"),
				content: yup.string().required("Content harus di isi"),
			})
		)
		.optional()
		.nullable(),
});
