import * as yup from "yup";

export type BannerType = {
	id?: string;
	name: string;
	name_en: string;
	description: string;
	description_en: string;
	image_path: string;
	link_url: string;
	is_active: boolean;
	published_at: string;
};

export const BannerSchema = yup.object({
	title: yup.string().optional().nullable(),
	title_en: yup.string().optional().nullable(),
	description: yup.string().optional().nullable(),
	description_en: yup.string().optional().nullable(),
	image: yup.string().required("Image banner is required"),
	date: yup.string().required("Publish date is required"),
	link: yup.string().url("Link must be valid url").optional().nullable(),
	is_active: yup.string().optional().nullable(),
});
