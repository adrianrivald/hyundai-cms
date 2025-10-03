import * as yup from "yup";

export const TourSchema = yup.object({
	id: yup.string().optional().nullable(),
	image: yup.string().required("Image is required"),
	name: yup.string().required("Name is required"),
	type: yup.string().required("Tour type is required"),
	description: yup.string().required("Description is required"),
	factory_id: yup
		.array()
		.of(yup.number())
		.min(1, "Select at least 1 factory")
		.required("Factory is required"),
	route_id: yup
		.array()
		.of(
			yup.object({
				factory_id: yup.number().required("Factory ID is required"),
				id: yup.number().required("Route ID is required"),
			})
		)
		.min(1, "Select at least 1 route")
		.required("Route is required"),
	min_occupy: yup
		.number()
		.transform((value, originalValue) => (originalValue === "" ? null : value))
		.required("Minimum occupancy is required")
		.moreThan(0, "Minimum occupancy must be greater than 0"),

	max_occupy: yup
		.number()
		.transform((value, originalValue) => (originalValue === "" ? null : value))
		.required("Maximum occupancy is required")
		.min(0, "Maximum occupancy must be greater than 0")
		.test(
			"is-greater",
			"Maximum occupancy must be greater than minimum occupancy",
			function (value) {
				const { min_occupy } = this.parent;
				if (value == null || min_occupy == null) return true;
				return value > min_occupy;
			}
		),
});
