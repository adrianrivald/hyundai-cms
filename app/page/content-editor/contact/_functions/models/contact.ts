import * as yup from "yup";

export type ContactType = {
	id?: string;
	contact: { id: string; phone: string; email: string }[];
	address: string;

	phone?: string;
	email?: string;
};

export const ContactSchema = yup.object({
	id: yup.string().nullable().optional(),
	contact: yup
		.array()
		.of(
			yup.object({
				id: yup.string().nullable().optional(),
				phone: yup
					.string()
					.required("Phone Number is required")
					.max(13, "Phone number must not be more than 13 characters")
					.min(11, "Phone number must not be less than 11 characters"),
				email: yup
					.string()
					.matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, "Email must be valid ")
					.required("Email is required"),
			})
		)
		.required("Contact is required")
		.min(1, "Minimum 1 contact must be filled"),

	address: yup.string().required("Address is required"),
});
