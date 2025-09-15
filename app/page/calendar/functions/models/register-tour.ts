import * as yup from "yup";

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export const FormRegisterTourSchema = yup.object({
	step: yup.string().required("Step is required"),
	date: yup.string().required("Visit date is required"),
	type: yup.string().required("Type tour is required"),

	info_group: yup.object({
		group_name: yup.string().required("Group name is required"),
		group_type: yup.string().when("..type", {
			is: (type: string) => type === "general-course" || type === "vip-course",
			then: (schema) => schema.optional().nullable(),
			otherwise: (schema) => schema.required("Group type is required"),
		}),
		group_lead: yup.string().required("Group leader is required"),
		purpose_visit: yup.string().required("Purpose of visit is required"),
		city: yup.string().required("City is required"),
		email: yup
			.string()
			.required("Email is required")
			.matches(emailRegex, "Invalid email address"),
		gender: yup.string().required("Gender is required"),
		age: yup
			.string()
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
		isDifabel: yup.string().nullable().optional(),
		purpose_letter: yup.string().required("Purpose letter is required"),
	}),

	info_vehicle: yup.object({
		vehicle_type: yup.string().required("Vehicle type is required"),
		vehicle_plat: yup.string().required("Vehicle plate is required"),
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
		.required("Group members are required")
		.min(1, "At least one member is required"),
});

export type FormRegisterTour = {
	step: string;
	date: string;
	type: string;
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
