import * as yup from "yup";

export const FormRescheduleTour = yup.object({
	date: yup.string().required("Visit date is required"),
	batch: yup
		.array()
		.of(yup.string())
		.min(1, "At least one batch number is required")
		.required("Batch number is required"),
	reason: yup.string().required("Reason is required"),
});
