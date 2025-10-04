import { usePostRescheduleNotification } from "@/api/reschedule";
import FormProvider from "@/components/RHForm/FormProvider";
import RHFTextField from "@/components/RHForm/RHFTextField";
import DialogModal from "@/components/custom/dialog/dialog-modal";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { yupResolver } from "@hookform/resolvers/yup";
import { Icon } from "@iconify/react/dist/iconify.js";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

interface DialogRescheduleEmailProps {
	open: boolean;
	onClose: () => void;
	id: string;
	email: string;
	refetch: () => void;
}

const DialogRescheduleEmail = ({
	open,
	onClose,
	email,
	id,
	refetch,
}: DialogRescheduleEmailProps) => {
	const methods = useForm({
		defaultValues: { email: email },
		resolver: yupResolver(
			yup.object({ email: yup.string().required("Email address is required") })
		),
	});

	useEffect(() => {
		if (open && email) {
			methods.reset({ email });
		}
	}, [open, email]);

	const { mutate, isPending } = usePostRescheduleNotification();

	const onSubmit = () => {
		const form = methods.watch();

		let data = {
			id: id,
			email: form.email,
		};

		mutate(data, {
			onSuccess: () => {
				onClose();
				methods.clearErrors();
				methods.reset();
				refetch && refetch();
				enqueueSnackbar("Email has been sent", {
					variant: "success",
				});
			},
			onError: (err: any) => {
				enqueueSnackbar(`Error : ${err.response?.data?.message}`, {
					variant: "error",
				});
			},
		});
	};

	return (
		<DialogModal
			open={open}
			onOpenChange={() => {
				onClose();
			}}
			headerTitle={""}
			contentProps="w-[70%] max-h-[90%]"
			content={
				<div className="mt-5">
					<Typography className="text-[25px] font-medium text-center">
						Penyesuaian dan Pergantian Jadwal Kegiatan Sehubungan dengan
						Kedatangan Tamu VIP
					</Typography>
					<Typography className="text-[#6D717F] text-center mt-3 mb-5">
						Mohon perhatian, jadwal yang telah tersusun sebelumnya akan
						digantikan untuk memberikan prioritas kepada tamu VIP. Apabila
						terdapat perubahan jadwal karena ketentuan dari pihak manajemen
						HMMI, mohon agar segera mengirimkan email pemberitahuan kepada
						visitor yang sudah terdaftar sebelumnya.
					</Typography>

					<FormProvider methods={methods}>
						<div className="flex flex-row items-end">
							<RHFTextField
								name="email"
								label="Alamat email ketua group"
								placeholder="Alamat email"
								className="w-full"
							/>
							<Button
								disabled={isPending}
								onClick={() => {
									methods.trigger().then((valid) => {
										if (valid) {
											onSubmit();
										}
									});
								}}
							>
								Kirim Email Konfirmasi
							</Button>
						</div>
					</FormProvider>
				</div>
			}
		/>
	);
};

export default DialogRescheduleEmail;
