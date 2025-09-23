import * as yup from "yup";

export type SocialMediaType = {
	id?: string;
	title: string;
	type: string;
	link: string;
	max_post: string;
};

export const SocialMediaSchema = yup.object({
	title: yup.string().required("Title is required"),
	type: yup.string().required("Social media type is required"),
	link: yup.string().url("Link must be valid").required("Link is required"),
	max_post: yup.string().required("Maximum post is required"),
});
