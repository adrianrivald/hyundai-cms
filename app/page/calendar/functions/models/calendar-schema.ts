import * as yup from "yup";

export const FormCalendarSchema = yup.object({
	id: yup.string().nullable().optional(),
	start_date: yup.string().required("Start date is required"),
	end_date: yup.string().required("End date is required"),
	title: yup.string().required("Title is required"),
	description: yup.string().required("Description is required"),
});

export type FormCalendarTypes = {
	id?: string;
	start_date: string;
	end_date: string;
	title: string;
	description: string;
};
