import FormProvider from "@/components/RHForm/FormProvider";
import RHFUploadFile from "@/components/RHForm/RHFUploadFile";
import DialogModal from "@/components/custom/dialog/dialog-modal";
import { Grid } from "@/components/grid";
import { Button } from "@/components/ui/button";
import { yupResolver } from "@hookform/resolvers/yup";

import { useForm } from "react-hook-form";
import { FactoryRouteSchema, FactorySchema } from "../models/factory";
import RHFTextField from "@/components/RHForm/RHFTextField";
import RHFTextArea from "@/components/RHForm/RHFTextArea";
import { usePostFactory, usePutFactory, type FactoryType } from "@/api/factory";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { Typography } from "@/components/typography";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
	useDeleteFactoryRoute,
	useGetFactoryRoutes,
	useSaveFactoryRoutes,
} from "@/api/factory-route";
import DialogDelete from "@/components/custom/dialog/dialog-delete";

interface DialogFactoryProps {
	open: boolean;
	onClose: () => void;
	data?: FactoryType;
	refetch?: () => void;
	isDisabled?: boolean;
}

const DialogFactory = ({
	open,
	onClose,
	data,
	refetch,
	isDisabled = false,
}: DialogFactoryProps) => {
	const [deleteRoute, setDeleteRoute] = useState({ isOpen: false, id: "" });
	const methods = useForm({
		defaultValues: {
			id: "",
			image: "",
			factory_name: "",
			description: "",
			step: "reg_factory",
		},
		shouldFocusError: false,
		mode: "onChange",
		resolver: yupResolver(FactorySchema),
	});

	const methodRoutes = useForm({
		defaultValues: {
			route: [{ route_name: "", description: "", image: "", id: "" }],
		},
		shouldFocusError: false,
		mode: "onChange",
		resolver: yupResolver(FactoryRouteSchema),
	});

	const { data: dataRoute } = useGetFactoryRoutes(data?.id || "", {
		enabled: !!data?.id,
		queryKey: ["factory-route-get-all", data?.id],
	});
	const { mutate: mutatePost, isPending: pendingPost } = usePostFactory();
	const { mutate: mutateEdit, isPending: pendingEdit } = usePutFactory();
	const { mutate: mutateDelete } = useDeleteFactoryRoute();
	const { mutate: mutateRoutes, isPending: pendingRoutes } =
		useSaveFactoryRoutes();

	const onSubmit = () => {
		const form = methods.watch();
		const dataForm: FactoryType = {
			id: data?.id,
			image_path: form.image,
			name: form.factory_name,
			description: form.description,
		};
		if (data?.id) {
			mutateEdit(dataForm, {
				onSuccess: () => {
					methods.clearErrors();
					methods.setValue("step", "reg_route");
					//refetch && refetch();
					enqueueSnackbar("Data telah diubah", {
						variant: "success",
					});
				},
				onError: () => {
					enqueueSnackbar("Error: Ubah factory gagal", {
						variant: "error",
					});
				},
			});
		} else {
			mutatePost(dataForm, {
				onSuccess: (data: any) => {
					methods.clearErrors();
					methods.setValue("step", "reg_route");
					methods.setValue("id", data?.data?.id);
					//refetch && refetch();
					enqueueSnackbar("Data telah ditambahkan", {
						variant: "success",
					});
				},
				onError: () => {
					enqueueSnackbar("Error: Pembuatan factory gagal", {
						variant: "error",
					});
				},
			});
		}
	};

	const onSubmitRoute = () => {
		const form = methodRoutes.watch();
		let formData: any =
			form?.route?.map((item) => ({
				...item,
				factory_id: methods.watch("id"),
				name: methods.watch("factory_name"),
				image_path: item.image,
			})) || [];

		mutateRoutes(formData, {
			onSuccess: () => {
				resetField();
				methods.setValue("step", "reg_route");
				refetch && refetch();
				enqueueSnackbar("Data telah di tambahkan", {
					variant: "success",
				});
			},
			onError: () => {
				enqueueSnackbar("Error: Ubah factory gagal", {
					variant: "error",
				});
			},
		});
	};

	useEffect(() => {
		if (open && data) {
			methods.reset({
				factory_name: data?.name,
				id: data?.id,
				image: data?.image_path,
				description: data?.description,
				step: "reg_factory",
			});
		}
	}, [open, data]);

	const resetField = () => {
		methods.clearErrors();
		methodRoutes.clearErrors();
		methodRoutes.reset();
		methods.reset();
		onClose();
	};

	useEffect(() => {
		if (methods.watch("step") === "reg_route" && dataRoute?.data) {
			methodRoutes.reset({
				route:
					dataRoute?.data?.map((item) => ({
						...item,
						route_name: item.name,
						description: item.description,
						image: item.image_path,
					})) || [],
			});
		}
	}, [methods.watch("step"), dataRoute]);

	const onDelete = () => {
		mutateDelete(
			{ id: deleteRoute.id },
			{
				onSuccess: () => {
					let dataRoutes = methodRoutes.watch("route");
					let dataRoutesFilter = dataRoutes?.filter((item) => {
						if (!item.id) return true;
						return item.id !== deleteRoute.id;
					});
					methodRoutes.setValue("route", dataRoutesFilter);
					setDeleteRoute({ isOpen: false, id: "" });
				},
			}
		);
	};

	return (
		<DialogModal
			open={open}
			onOpenChange={() => {
				onClose();
				methods.clearErrors();
				methods.reset();
			}}
			headerTitle={
				isDisabled
					? "Detail Pabrik"
					: data?.id
						? "Ubah Pabrik"
						: "Tambah Pabrik"
			}
			contentProps="w-[700px] max-h-[750px]"
			content={
				<div className="">
					<FormProvider methods={methods}>
						<Grid container className="mb-5">
							<Grid
								item
								xs={6}
								onClick={() => {
									methods.setValue("step", "reg_factory");
								}}
								className={cn(
									"py-4 px-5 cursor-pointer flex flex-row items-center gap-3",
									methods.watch("step") === "reg_factory"
										? "bg-[#A8C5F7]"
										: "bg-[#153263]"
								)}
							>
								<Icon
									icon="fluent:checkmark-circle-24-filled"
									height={24}
									width={24}
									color={
										methods.watch("step") !== "reg_factory"
											? "white"
											: "#153263"
									}
								/>
								<Typography className={cn("text-white")}>
									Detail Pabrik
								</Typography>
							</Grid>
							<Grid
								item
								xs={6}
								onClick={() => {
									(data?.id || methods.watch("id")) &&
										methods.setValue("step", "reg_route");
								}}
								className={cn(
									"py-4 px-5 cursor-pointer flex flex-row items-center gap-3",
									methods.watch("step") === "reg_route"
										? "bg-[#A8C5F7]"
										: "bg-[#153263]"
								)}
							>
								<Icon
									icon="fluent:checkmark-circle-24-filled"
									height={24}
									width={24}
									color={
										methods.watch("step") !== "reg_route" ? "white" : "#153263"
									}
								/>
								<Typography className={cn("text-white")}>Buat Rute</Typography>
							</Grid>
						</Grid>

						{methods.watch("step") === "reg_factory" && (
							<Grid container spacing={4}>
								<Grid item xs={12}>
									<RHFUploadFile
										name="image"
										slug="factory"
										required
										disabled={isDisabled}
									/>
								</Grid>
								<Grid item xs={12}>
									<RHFTextField
										name="factory_name"
										label="Nama Pabrik"
										placeholder="Masukan nama pabrik"
										autoFocus={false}
										required
										disabled={isDisabled}
									/>
								</Grid>
								<Grid item xs={12}>
									<RHFTextArea
										name="description"
										label="Deskripsi"
										placeholder="Masukan deskripsi"
										rows={4}
										disabled={isDisabled}
									/>
								</Grid>

								<Grid item xs={12} className="flex justify-end">
									<Button
										loading={pendingEdit || pendingPost}
										disabled={isDisabled}
										onClick={() => {
											methods.trigger().then((isValid) => {
												if (isValid) {
													onSubmit();
												}
											});
										}}
									>
										{/* {data?.id ? "Ubah" : "Tambahkan"} */}
										Selanjutnya
									</Button>
								</Grid>
							</Grid>
						)}

						{methods.watch("step") === "reg_route" && (
							<FormProvider methods={methodRoutes}>
								<div className="max-h-[450px] overflow-y-scroll px-3">
									{methodRoutes.watch("route")?.map((item, index) => (
										<Grid container spacing={4} key={index} className={`mb-5`}>
											<Grid
												item
												xs={12}
												className="flex flex-row justify-between"
											>
												<Typography className="text-lg font-bold ">
													Rute {index + 1}
												</Typography>
												{item.id && (
													<div
														className="cursor-pointer"
														onClick={() => {
															if (isDisabled) return;
															setDeleteRoute({
																isOpen: true,
																id: item.id || "",
															});
														}}
													>
														<Icon
															icon="mage:trash"
															width="22"
															height="22"
															color={"#FF3B30"}
														/>
													</div>
												)}
											</Grid>
											<Grid item xs={12}>
												<RHFUploadFile
													name={`route.${index}.image`}
													slug="factory"
													required
													disabled={isDisabled}
												/>
											</Grid>
											<Grid item xs={12}>
												<RHFTextField
													name={`route.${index}.route_name`}
													label="Nama Rute"
													placeholder="Masukan nama rute"
													autoFocus={false}
													required
													disabled={isDisabled}
												/>
											</Grid>
											<Grid item xs={12}>
												<RHFTextArea
													name={`route.${index}.description`}
													label="Deskripsi"
													placeholder="Masukan deskripsi"
													rows={4}
													disabled={isDisabled}
												/>
											</Grid>
										</Grid>
									))}
								</div>

								<div
									className="mt-5 flex-row flex items-center justify-end cursor-pointer gap-1"
									onClick={() => {
										if (isDisabled) return;
										let data = methodRoutes.watch("route");
										methodRoutes.setValue("route", [
											...(data || []),
											{ route_name: "", description: "", image: "", id: "" },
										]);
									}}
								>
									<Icon icon="ic:outline-plus" width="24" height="24" />
									<Typography className="font-bold">Tambah Rute</Typography>
								</div>
								<div className="flex justify-end mt-3">
									<Button
										loading={pendingRoutes}
										disabled={isDisabled}
										onClick={() => {
											methodRoutes.trigger().then((isValid) => {
												if (isValid) {
													onSubmitRoute();
												}
											});
										}}
									>
										Simpan
									</Button>
								</div>
							</FormProvider>
						)}
					</FormProvider>
					<DialogDelete
						open={deleteRoute.isOpen}
						onClose={() => {
							setDeleteRoute({ isOpen: false, id: "" });
						}}
						onSubmit={() => {
							onDelete();
						}}
					/>
				</div>
			}
		/>
	);
};

export default DialogFactory;
