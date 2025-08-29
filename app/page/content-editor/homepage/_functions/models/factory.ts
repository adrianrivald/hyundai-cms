import * as yup from "yup";

export type FactoryType = {
	id?: string;
	factory_name: string;
	description: string;
};

export const FactorySchema = yup.object({
	factory_name: yup.string().required("Nama pabrik harus di isi"),
	description: yup.string().required("Deskripsi banner harus di isi"),
	image: yup.string().required("Image banner harus di isi"),
});
