import * as yup from "yup";

export type FactoryType = {
	id?: string;
	factory_name: string;
	description: string;
	image: string;
};

export const FactorySchema = yup.object({
	id: yup.string().optional().nullable(),
	factory_name: yup.string().required("Nama pabrik harus di isi"),
	description: yup.string().required("Deskripsi banner harus di isi"),
	image: yup.string().required("Image pabrik harus di isi"),
	step: yup.string().optional().nullable(),
});

export const FactoryRouteSchema = yup.object({
	route: yup.array().of(
		yup.object({
			id: yup.string().nullable().optional(),
			route_name: yup.string().required("Nama rute harus di isi"),
			description: yup.string().required("Deskripsi banner harus di isi"),
			image: yup.string().optional().nullable(), //.required("Image route harus di isi"),
		})
	),
});
