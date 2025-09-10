import {
	useGetGlobalVariables,
	usePostGlobalVariable,
	usePutGlobalVariable,
} from "@/api/global-variable";
import FormProvider from "@/components/RHForm/FormProvider";
import RHFTextField from "@/components/RHForm/RHFTextField";
import Container from "@/components/container";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import type { GlobalVariableTypes } from "@/types/GlobalVariableTypes";
import { yupResolver } from "@hookform/resolvers/yup";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const SettingVisitPage = () => {
	const { data, refetch } = useGetGlobalVariables({
		queryKey: ["global-variable-visit-setting"],
		staleTime: 5 * 60 * 1000,
	});

	const schema = yup.object({
		id: yup.string().optional().nullable(),
		visit: yup
			.string()
			.typeError("Visit harus angka")
			.required("Visit harus diisi")
			.min(0, "Minimal 0 slot")
			.max(10, "Maksimal 10 slot"),
	});

	const methods = useForm({
		defaultValues: {
			id: "",
			visit: "0",
		},
		resolver: yupResolver(schema),
	});

	const { mutate: mutatePost, isPending: pendingPost } =
		usePostGlobalVariable();
	const { mutate: mutateEdit, isPending: pendingEdit } = usePutGlobalVariable();

	useEffect(() => {
		if (data) {
			let dataVisit = data?.data?.filter(
				(item) => item.name === "visit_setting"
			)?.[0];
			methods.reset({
				visit: dataVisit?.var_value || "0",
				id: dataVisit?.id || "",
			});
		}
	}, [data]);

	const onSubmit = () => {
		const form = methods.watch();
		const dataForm: GlobalVariableTypes = {
			id: form?.id || "",
			name: "visit_setting",
			description: "The visit setting on microsite",
			is_active: true,
			var_value: form.visit,
		};
		if (form?.id) {
			mutateEdit(dataForm, {
				onSuccess: () => {
					methods.clearErrors();
					refetch && refetch();
					enqueueSnackbar("Data telah diubah", {
						variant: "success",
					});
				},
				onError: () => {
					enqueueSnackbar("Error: Ubah data gagal", {
						variant: "error",
					});
				},
			});
		} else {
			mutatePost(dataForm, {
				onSuccess: () => {
					methods.clearErrors();
					methods.reset();
					refetch && refetch();
					enqueueSnackbar("Data telah ditambahkan", {
						variant: "success",
					});
				},
				onError: () => {
					enqueueSnackbar("Error: Pembuatan data gagal", {
						variant: "error",
					});
				},
			});
		}
	};
	return (
		<Container className="bg-white px-5 py-5">
			<Typography className="font-bold">Setting Kunjungan</Typography>
			<div className="mt-3 flex flex-row gap-3">
				<Typography className="text-sm mt-3">
					Set batas slot kunjungan per hari
				</Typography>
				<FormProvider methods={methods}>
					<RHFTextField
						name="visit"
						type="number"
						autoFocus={false}
						className="w-[200px]"
						onChange={(e) => {
							if (e.target) {
								//@ts-ignore
								let value = e.target.value;
								methods.clearErrors("visit");
								methods.setValue("visit", value);
								if (value > 10) {
									methods.setError("visit", {
										message: "Kunjungan perhari tidak boleh lebih dari 10 kali",
									});
								} else {
									methods.clearErrors("visit");
								}
							}
						}}
					/>
				</FormProvider>
			</div>
			<div className="flex flex-row justify-end">
				<Button
					onClick={() => onSubmit()}
					className="mt-3"
					disabled={pendingEdit || pendingPost}
				>
					Simpan Perubahan
				</Button>
			</div>
		</Container>
	);
};

export default SettingVisitPage;
