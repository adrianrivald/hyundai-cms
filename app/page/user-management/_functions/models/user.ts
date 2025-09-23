import * as yup from "yup";

export const UserSchema = yup.object({
	id: yup.string().nullable().optional(),

	name: yup.string().when("id", {
		is: (val: unknown) => !!val, // if id exists
		then: (schema) => schema.optional().nullable(),
		otherwise: (schema) => schema.required("Name is required"),
	}),

	email: yup.string().when("id", {
		is: (val: unknown) => !!val,
		then: (schema) =>
			schema
				.optional()
				.nullable()
				.matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, "Email must be valid"),
		otherwise: (schema) =>
			schema
				.required("Email is required")
				.matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, "Email must be valid"),
	}),

	role: yup.string().when("id", {
		is: (val: unknown) => !!val,
		then: (schema) => schema.optional().nullable(),
		otherwise: (schema) => schema.required("Role is required"),
	}),

	password: yup.string().when("id", {
		is: (val: unknown) => !!val,
		then: (schema) => schema.optional().nullable(),
		otherwise: (schema) => schema.required("Password is required"),
	}),
});
