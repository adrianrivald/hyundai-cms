import * as yup from "yup";

export type SocialMediaType = {
	id?: string;
	title: string;
	type: string;
	link: string;
};

export const SocialMediaSchema = yup.object({
	id: yup.string().optional().nullable(),
	title: yup.string().required("Judul harus di isi"),
	type: yup.string().required("Tipe sosial media harus di isi"),
	link: yup.string().url("Link harus valid").required("Link harus di isi"),
});

export type SocialMediaGlobal = {
	id?: number;
	title: string;
	profile: string;
	social_media: string;
};
