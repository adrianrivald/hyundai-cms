import * as yup from "yup";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const FormRegisterTourSchema = yup.object({
	step: yup.string().required("Step is required"),

	date: yup.string().when("step", {
		is: "info_dasar",
		then: (schema) => schema.required("Visit date is required"),
		otherwise: (schema) => schema.required("Visit date is required"),
	}),

	type: yup.string().when("step", {
		is: "info_dasar",
		then: (schema) => schema.required("Type tour is required"),
		otherwise: (schema) => schema.required("Type tour is required"),
	}),

	tour_type: yup.string().nullable().optional(),

	batch: yup.string().when("step", {
		is: "info_dasar",
		then: (schema) => schema.required("Batch number is required"),
		otherwise: (schema) => schema.required("Batch number is required"),
	}),

	info_group: yup.object({
		group_name: yup.string().when("..step", {
			is: "info_dasar",
			then: (schema) => schema.optional().nullable(),
			otherwise: (schema) => schema.required("Group name is required"),
		}),
		group_type: yup.string().when(["..type_tour", "..step"], {
			is: (type_tour: string, step: string) =>
				step === "info_dasar" &&
				!(type_tour === "general-course" || type_tour === "vip"),
			then: (schema) => schema.required("Group type is required"),
			otherwise: (schema) => schema.optional().nullable(),
		}),
		group_leader: yup.string().when("..step", {
			is: "info_dasar",
			then: (schema) => schema.optional().nullable(),
			otherwise: (schema) => schema.required("Group leader is required"),
		}),
		purpose_visit: yup.string().when("..step", {
			is: "info_dasar",
			then: (schema) => schema.optional().nullable(),
			otherwise: (schema) => schema.required("Purpose of visit is required"),
		}),
		city: yup.string().when("..step", {
			is: "info_dasar",
			then: (schema) => schema.optional().nullable(),
			otherwise: (schema) => schema.required("City is required"),
		}),
		email: yup.string().when("..step", {
			is: "info_dasar",
			then: (schema) => schema.optional().nullable(),
			otherwise: (schema) =>
				schema
					.required("Email is required")
					.matches(emailRegex, "Invalid email address"),
		}),
		gender: yup.string().when("..step", {
			is: "info_dasar",
			then: (schema) => schema.optional().nullable(),
			otherwise: (schema) => schema.required("Gender is required"),
		}),
		age: yup.string().when("..step", {
			is: "info_dasar",
			then: (schema) => schema.optional().nullable(),
			otherwise: (schema) =>
				schema
					.required("Age is required")
					.test("max-age", "Age must be less than or equal to 70", (value) => {
						if (!value) return false;
						const num = Number(value);
						return !isNaN(num) && num <= 70;
					})
					.test("min-age", "Age must be more than or equal to 10", (value) => {
						if (!value) return false;
						const num = Number(value);
						return !isNaN(num) && num >= 10;
					}),
		}),
		isDifabel: yup.string().nullable().optional(),
		purpose_letter: yup.string().when("..step", {
			is: "info_dasar",
			then: (schema) => schema.optional().nullable(),
			otherwise: (schema) => schema.required("Purpose letter is required"),
		}),
	}),

	info_vehicle: yup.object({
		vehicle_type: yup.string().when("..step", {
			is: "info_dasar",
			then: (schema) => schema.optional().nullable(),
			otherwise: (schema) => schema.required("Vehicle type is required"),
		}),
		vehicle_plat: yup.string().when("..step", {
			is: "info_dasar",
			then: (schema) => schema.optional().nullable(),
			otherwise: (schema) => schema.required("Vehicle plate is required"),
		}),
	}),

	group_member: yup
		.array()
		.of(
			yup.object({
				name: yup.string().required("Name is required"),
				phone: yup.string().required("Phone is required"),
				email: yup
					.string()
					.required("Email is required")
					.matches(emailRegex, "Invalid email address"),
				gender: yup.string().required("Gender is required"),
				dob: yup.string().required("Date of birth is required"),
				isDifable: yup.string().nullable().optional(),
			})
		)
		.when("step", {
			is: "info_dasar",
			then: (schema) => schema.optional().nullable(),
			otherwise: (schema) =>
				schema
					.required("Group members are required")
					.min(1, "At least one member is required"),
		}),
});

export type FormRegisterTour = {
	step: string;
	date: string;
	type: string;
	tour_type: string;
	batch: string;
	info_group: {
		group_name: string;
		group_type?: string | null; // optional or nullable depending on type
		group_lead: string;
		purpose_visit: string;
		city: string;
		email: string;
		gender: string;
		age: string;
		isDifabel?: string | null;
		purpose_letter: string;
	};
	info_vehicle: {
		vehicle_type: string;
		vehicle_plat: string;
	};
	group_member: Array<{
		name: string;
		phone: string;
		email: string;
		gender: string;
		dob: string;
		isDifable?: string | null;
	}>;
};
