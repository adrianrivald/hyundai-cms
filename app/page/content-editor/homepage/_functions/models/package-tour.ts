import * as yup from "yup";

export const TourSchema = yup.object({
	id: yup.string().optional().nullable(),
	image: yup.string().required("Gambar harus diisi"),
	name: yup.string().required("Nama harus diisi"),
	type: yup.string().required("Tipe tour harus diisi"),
	description: yup.string().required("Deskripsi harus diisi"),
	factory_id: yup
		.array()
		.of(yup.number())
		.min(1, "Pilih minimal 1 pabrik")
		.required("Pabrik harus diisi"),
	route_id: yup
		.array()
		.of(
			yup.object({
				factory_id: yup.number().required("Factory ID harus diisi"),
				id: yup.number().required("Route ID harus diisi"),
			})
		)
		.min(1, "Pilih minimal 1 rute")
		.required("Rute harus diisi"),
	min_occupy: yup.number().nullable().required("Minimum okupansi harus diisi"),
	max_occupy: yup
		.number()
		.nullable()
		.required("Maksimum okupansi harus diisi")
		.test(
			"is-greater",
			"Maksimum okupansi harus lebih besar dari minimum okupansi",
			function (value) {
				const { min_occupy } = this.parent;
				if (value == null || min_occupy == null) return true; // skip check kalau masih null
				return value > min_occupy;
			}
		),
});
