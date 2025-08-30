import * as yup from "yup";

export type SocialMediaType = {
	id?: string;
	title: string;
	type: string;
	link: string;
	max_post: string;
};

export const SocialMediaSchema = yup.object({
	title: yup.string().required("Judul harus di isi"),
	type: yup.string().required("Tipe sosial media harus di isi"),
	link: yup.string().url("Link harus valid").required("Link harus di isi"),
	max_post: yup.string().required("Maksimum post harus di isi"),
});
