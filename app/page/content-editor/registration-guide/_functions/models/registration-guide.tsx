import * as yup from "yup";

export type AboutContentType = {
	id?: string;
	data: { title: string; language: string; content: string }[];
};

export const AboutContentSchema = yup.object({
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
