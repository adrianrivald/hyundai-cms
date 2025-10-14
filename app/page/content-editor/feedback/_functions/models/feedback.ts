import * as yup from "yup";

export const FeedbackSchema = yup.object({
	id: yup.string().nullable().optional(),
	name: yup.string().required("Title is required"),
	description: yup.string().required("Description is required").default("-"),
	questions: yup.array().of(
		yup.object({
			id: yup.number().optional(),
			delete: yup.string().optional(),
			question_id: yup.string().required("Question is required"),
			question_en: yup.string().required("Question is required"),
			is_mandatory: yup.boolean().optional().default(true),
			form_type: yup.string().required("Form type is required"),
			answers: yup
				.array()
				.of(
					yup.object({
						id: yup.number().optional(),
						delete: yup.string().optional(),
						sort: yup.number().optional().default(1),
						answer_id: yup.string().when("$form_type", {
							is: (val: string) => ["radio_button", "checkbox"].includes(val),
							then: (schema) => schema.required("Answer is required"),
							otherwise: (schema) => schema.optional(),
						}),
						answer_en: yup.string().when("$form_type", {
							is: (val: string) => ["radio_button", "checkbox"].includes(val),
							then: (schema) => schema.required("Answer is required"),
							otherwise: (schema) => schema.optional(),
						}),
					})
				)
				.when("form_type", {
					is: (val: string) => ["radio_button", "checkbox"].includes(val),
					then: (schema) =>
						schema
							.min(1, "At least one answer is required for this form type")
							.required(),
					otherwise: (schema) => schema.optional(),
				}),
			min_range: yup.number().optional().default(1),
			max_range: yup.number().optional().default(5),
			sort: yup.number().optional().default(1),
		})
	),
});
