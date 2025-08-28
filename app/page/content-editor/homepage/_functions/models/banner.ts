import * as yup from "yup";

export type BannerType = {
	id?: string;
	name: string;
	description: string;
	image_path: string;
	link_url: string;
	is_active: boolean;
	published_at: string;
};

export const BannerSchema = yup.object({
	title: yup.string().required("Nama banner harus di isi"),
	description: yup.string().required("Deskripsi banner harus di isi"),
	image: yup.string().required("Image banner harus di isi"),
	date: yup.string().required("Tanggal terbit harus di isi"),
	link: yup
		.string()
		.url("Link harus berupa URL yang valid")
		.required("Link harus di isi"),
	is_active: yup.string().optional().nullable(),
});
