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

	allow_marketing: yup.boolean().optional().default(false),
	tour_type: yup.string().nullable().optional(),
	min_participant: yup.string().nullable().optional(),
	max_participant: yup.string().nullable().optional(),

	batch: yup
		.array()
		.of(yup.string())
		.when("step", {
			is: "info_dasar",
			then: (schema) =>
				schema
					.min(1, "At least one batch number is required")
					.required("Batch number is required"),
			otherwise: (schema) =>
				schema
					.min(1, "At least one batch number is required")
					.required("Batch number is required"),
		}),

	info_group: yup.object({
		group_name: yup.string().when("..step", {
			is: "info_dasar",
			then: (schema) => schema.optional().nullable(),
			otherwise: (schema) => schema.required("Group name is required"),
		}),
		group_type: yup
			.string()
			.test("conditional-required", "Group type is required", function (value) {
				const { step, tour_type } = this?.from?.[1]?.value || {}; // root context
				const isInfoDasar = step === "info_dasar";
				const isVip = tour_type === "vip";

				if (!isInfoDasar) {
					return true;
				}

				if (isInfoDasar && isVip) {
					// optional
					return true;
				}

				// otherwise required
				return !!value;
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
			otherwise: (schema) => schema.required("Dob is required"),
		}),
		phone_number: yup.string().when("..step", {
			is: "info_dasar",
			then: (schema) => schema.optional().nullable(),
			otherwise: (schema) => schema.required("Phone Number is required"),
		}),
		isDifabel: yup.string().when("..step", {
			is: "info_dasar",
			then: (schema) => schema.optional().nullable(),
			otherwise: (schema) => schema.required("Difabel form is required"),
		}),
		isParticipant: yup.string().when("..step", {
			is: "info_dasar",
			then: (schema) => schema.optional().nullable(),
			otherwise: (schema) =>
				schema.required("Leader Participant form is required"),
		}),
		purpose_letter: yup.string().when("..step", {
			is: "info_dasar",
			then: (schema) => schema.optional().nullable(),
			otherwise: (schema) => schema.required("Visiting Letter is required"),
		}),
	}),

	info_vehicle: yup
		.array()
		.of(
			yup.object({
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
			})
		)
		.min(1, "At least one vehicle is required"),

	group_member: yup.array().when("step", {
		is: "info_anggota",
		then: (schema) =>
			schema
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
						isDifabel: yup.string().required("Difabel form is required"),
					})
				)
				.required("Group members are required")
				.min(1, "At least one member is required"),
		otherwise: (schema) => schema.optional().nullable(),
	}),
});

export type FormRegisterTour = {
	step: string;
	date: string;
	type: string;
	tour_type: string;
	batch: string[];
	min_participant: string;
	max_participant: string;
	allow_marketing: boolean;
	info_group: {
		group_name: string;
		group_type?: string | null; // optional or nullable depending on type
		group_leader: string;
		purpose_visit: string;
		city: string;
		email: string;
		gender: string;
		age: string;
		isDifabel?: string | null;
		isParticipant?: string | null;
		purpose_letter: string;
		phone_number: string;
	};
	info_vehicle: {
		vehicle_type: string;
		vehicle_plat: string;
	}[];
	group_member: Array<{
		name: string;
		phone: string;
		email: string;
		gender: string;
		dob: string;
		isDifabel?: string | null;
	}>;
};
