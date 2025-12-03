import * as yup from 'yup';

export type ContactType = {
	id?: string;
	contact: { id?: string; phone?: string; email?: string }[];
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

				phone: yup.string().when([], function (_, schema) {
					const path = this.path ?? '';
					const match = path.match(/\[(\d+)\]/);
					const index = match ? Number(match[1]) : -1;

					const base = schema.test(
						'phone-length',
						'Phone number must be between 11 and 13 characters',
						(value) => {
							if (!value) return true; // allow empty for non-first index
							return value.length >= 11 && value.length <= 13;
						}
					);

					if (index === 0) {
						return base.required('Phone Number is required');
					}

					return base.optional().nullable();
				}),

				email: yup.string().when([], function (_, schema) {
					const path = this.path ?? '';
					const match = path.match(/\[(\d+)\]/);
					const index = match ? Number(match[1]) : -1;

					const base = schema.test(
						'email-format',
						'Email must be valid',
						(value) => {
							if (!value) return true; // allow empty for non-first index
							return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
						}
					);

					if (index === 0) {
						return base.required('Email is required');
					}

					return base.optional().nullable();
				}),
			})
		)
		.required('Contact is required')
		.min(1, 'Minimum 1 contact must be filled'),

	address: yup.string().required('Address is required'),
});
