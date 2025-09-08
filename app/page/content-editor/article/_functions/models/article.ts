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
	title: yup.string().required("Judul harus di isi"),
	author: yup.string().required("Penulis harus di isi"),
	image: yup.string().required("Gambar harus di isi"),
	content: yup.string().required("Konten harus di isi"),
});
