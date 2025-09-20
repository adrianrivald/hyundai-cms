import * as yup from "yup";

export type ArticleContentType = {
	id?: string;
	title: string;
	author: string;
	image: string;
	content: string;
};

export const ArticleContentSchema = yup.object({
	id: yup.string().nullable().optional(),
	title: yup.string().required("Title is required"),
	author: yup.string().required("Author is required"),
	image: yup.string().required("Image is required"),
	content: yup.string().required("Content is required"),
});
