import * as yup from "yup";

export type TopMenuType = {
	id?: string;
	title: string;
	content: string;
	status: string;
};

export const TopMenuSchema = yup.object({
	id: yup.string().nullable().optional(),
	title: yup.string().required("Title is required"),
	content: yup.string().required("Content is required"),
});
