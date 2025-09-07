import * as yup from "yup";

export const UserSchema = yup.object({
	id: yup.string().nullable().optional(),

	name: yup.string().when("id", {
		is: (val: unknown) => !!val, // if id exists
		then: (schema) => schema.optional().nullable(),
		otherwise: (schema) => schema.required("Nama harus di isi"),
	}),

	email: yup.string().when("id", {
		is: (val: unknown) => !!val,
		then: (schema) => schema.optional().nullable().email("Email tidak valid"),
		otherwise: (schema) =>
			schema.required("Email harus di isi").email("Email tidak valid"),
	}),

	role: yup.string().when("id", {
		is: (val: unknown) => !!val,
		then: (schema) => schema.optional().nullable(),
		otherwise: (schema) => schema.required("Role harus di isi"),
	}),

	password: yup.string().when("id", {
		is: (val: unknown) => !!val,
		then: (schema) => schema.optional().nullable(),
		otherwise: (schema) => schema.required("Password harus di isi"),
	}),
});
