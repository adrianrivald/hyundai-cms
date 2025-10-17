import * as yup from "yup";

export type FactoryType = {
	id?: string;
	factory_name: string;
	description: string;
	image: string;
};

export const FactorySchema = yup.object({
	id: yup.string().optional().nullable(),
	factory_name: yup.string().required("Factory name is required"),
	factory_name_en: yup.string().required("Factory name is required"),
	description: yup.string().required("Description is required"),
	description_en: yup.string().required("Description is required"),
	image: yup.string().required("Image is required"),
	step: yup.string().optional().nullable(),
});

export const FactoryRouteSchema = yup.object({
	route: yup.array().of(
		yup.object({
			id: yup.string().nullable().optional(),
			route_name: yup.string().required("Route name is required"),
			route_name_en: yup.string().required("Route name is required"),
			description: yup.string().required("Description is required"),
			description_en: yup.string().required("Description is required"),
			image: yup.string().optional().nullable(), //.required("Image route harus di isi"),
		})
	),
});
