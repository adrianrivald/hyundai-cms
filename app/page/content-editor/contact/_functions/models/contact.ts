import * as yup from "yup";

export type ContactType = {
	id?: string;
	contact: { id: string; phone: string; email: string }[];
	address: string;

	phone?: string;
	email?: string;
};

export const ContactSchema = yup.object({
	id: yup.string().nullable().optional(),
	contact: yup
		.array()
		.of(
			yup.object({
				id: yup.string().nullable().optional(),
				phone: yup
					.string()
					.required("Nomor telepon harus di isi")
					.max(13, "Nomor telpon tidak boleh lebih dari 13 karakter")
					.min(11, "Nomor telpon tidak boleh kurang dari 11 karakter"),
				email: yup
					.string()
					.email("Email harus valid")
					.required("Email harus di isi"),
			})
		)
		.required("Kontak harus di isi")
		.min(1, "Minimal satu kontak diperlukan"),

	address: yup.string().required("Link harus di isi"),
});
