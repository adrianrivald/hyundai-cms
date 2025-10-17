import * as yup from "yup";

export type ArticleContentType = {
	id?: string;
	title: string;
	title_en: string;
	author: string;
	image: string;
	content: string;
	content_en: string;
};

export const ArticleContentSchema = yup.object({
	id: yup.string().nullable().optional(),
	title: yup.string().required("Title is required"),
	title_en: yup.string().required("Title is required"),
	author: yup.string().required("Author is required"),
	image: yup.string().required("Image is required"),
	content: yup.string().required("Content is required"),
	content_en: yup.string().required("Content is required"),
});
