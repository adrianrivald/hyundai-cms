import * as yup from "yup";

const answerItem = (requiresAnswers: boolean) =>
	yup.object({
		id: yup.number().optional(),
		delete: yup.string().optional(),
		sort: yup.number().optional().default(1),
		answer_id: requiresAnswers
			? yup.string().required("Answer (ID) is required")
			: yup.string().optional(),
		answer_en: requiresAnswers
			? yup.string().required("Answer (EN) is required")
			: yup.string().optional(),
	});

export const FeedbackSchema = yup.object({
	id: yup.string().nullable().optional(),
	name: yup.string().required("Title is required"),
	description: yup.string().required("Description is required").default("-"),
	questions: yup
		.array()
		.of(
			// create a schema per question depending on its form_type
			yup.lazy((questionValue) => {
				// safe-guard: questionValue might be undefined during schema creation
				const formType = questionValue && questionValue.form_type;
				const requiresAnswers = ["radio_button", "checkbox"].includes(formType);

				return yup.object({
					id: yup.number().optional(),
					delete: yup.string().optional(),
					question_id: yup.string().required("Question is required"),
					question_en: yup.string().required("Question is required"),
					is_mandatory: yup.boolean().optional().default(true),
					form_type: yup.string().required("Form type is required"),
					answers: yup
						.array()
						.of(answerItem(requiresAnswers))
						.nullable()
						.transform((v) => (v === null ? [] : v))
						.test(
							"answers-required-for-form-type",
							"At least one answer is required for this form type",
							function (answers) {
								// When the question requires answers, ensure answers array has at least one
								if (requiresAnswers) {
									return Array.isArray(answers) && answers.length > 0;
								}
								return true;
							}
						),
					min_range: yup.number().optional().default(1),
					max_range: yup.number().optional().default(5),
					sort: yup.number().optional().default(1),
				});
			})
		)
		.required(),
});
