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
import { StepNavigation } from "@/components/custom/tabs-navigation/tabs-navigation";

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
	const steps = [
		{ key: "reg_factory", label: "Factory Detail" },
		{ key: "reg_route", label: "Add Route" },
	];
	const [deleteRoute, setDeleteRoute] = useState({
		isOpen: false,
		id: "",
		index: 0,
	});
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
			route: [
				{
					route_name: "",
					description: "",
					route_name_en: "",
					description_en: "",
					image: "",
					id: "",
				},
			],
		},
		shouldFocusError: false,
		mode: "onChange",
		resolver: yupResolver(FactoryRouteSchema),
	});

	const { data: dataRoute } = useGetFactoryRoutes(data?.id || "", {
		enabled: !!data?.id && open,
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
			name_en: form.factory_name_en,
			description_en: form.description_en,
		};
		if (data?.id) {
			mutateEdit(dataForm, {
				onSuccess: () => {
					methods.clearErrors();
					methods.setValue("step", "reg_route");
					refetch && refetch();
					enqueueSnackbar("Data has been changed", {
						variant: "success",
					});
				},
				onError: (err: any) => {
					enqueueSnackbar(`Error : ${err.response?.data?.message}`, {
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
					refetch && refetch();
					enqueueSnackbar("Data has been added", {
						variant: "success",
					});
				},
				onError: (err: any) => {
					enqueueSnackbar(`Error : ${err.response?.data?.message}`, {
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
				name: item.route_name,
				name_en: item.route_name_en,
				description: item.description,
				description_en: item.description_en,
				image_path: item.image,
			})) || [];

		mutateRoutes(formData, {
			onSuccess: () => {
				resetField();
				methods.setValue("step", "reg_route");
				refetch && refetch();
				enqueueSnackbar("Data has been added", {
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

	useEffect(() => {
		if (open && data) {
			methods.reset({
				factory_name: data?.name,
				factory_name_en: data?.name_en,
				id: data?.id,
				image: data?.image_path,
				description: data?.description,
				description_en: data?.description_en,
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
						route_name_en: item.name_en,
						description: item.description,
						description_en: item.description_en,
						image: item.image_path,
					})) || [],
			});
		}
	}, [methods.watch("step"), dataRoute]);

	const onDelete = () => {
		if (!data?.id && !deleteRoute.id) {
			let dataRoutes = methodRoutes.watch("route") || [];
			let dataRoutesFilter = dataRoutes.filter(
				(_, index) => index !== deleteRoute.index
			);

			methodRoutes.setValue("route", dataRoutesFilter);
			setDeleteRoute({ isOpen: false, id: "", index: 0 });
		} else {
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
						setDeleteRoute({ isOpen: false, id: "", index: 0 });
					},
				}
			);
		}
	};

	return (
		<DialogModal
			open={open}
			onOpenChange={() => {
				resetField();
			}}
			headerTitle={
				isDisabled
					? "Factory Detail"
					: data?.id
						? "Edit Factory"
						: "Add Factory"
			}
			contentProps="w-[700px] max-h-[750px]"
			content={
				<div className="">
					<FormProvider methods={methods}>
						<StepNavigation
							steps={steps}
							value={methods.watch("step") || ""}
							onChange={(key) => {
								//methods.setValue("step", key);
								if (key === "reg_route") {
									if (data?.id || methods.watch("id")) {
										methods.setValue("step", key);
									}
								} else {
									methods.setValue("step", key);
								}
							}}
							activeColor="#153263"
							inactiveColor="#A8C5F7"
						/>

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
								<Grid item xs={6}>
									<RHFTextField
										name="factory_name"
										label="Factory Name ID"
										placeholder="Input factory name"
										autoFocus={false}
										required={!isDisabled}
										disabled={isDisabled}
										className="w-full"
									/>
								</Grid>
								<Grid item xs={6}>
									<RHFTextField
										name="factory_name_en"
										label="Factory Name EN"
										placeholder="Input factory name"
										autoFocus={false}
										required={!isDisabled}
										disabled={isDisabled}
										className="w-full"
									/>
								</Grid>
								<Grid item xs={6}>
									<RHFTextArea
										name="description"
										label="Description ID"
										placeholder="Input description"
										rows={4}
										disabled={isDisabled}
										className="w-full"
									/>
								</Grid>
								<Grid item xs={6}>
									<RHFTextArea
										name="description_en"
										label="Description EN"
										placeholder="Input description"
										rows={4}
										disabled={isDisabled}
										className="w-full"
									/>
								</Grid>
								{!isDisabled && (
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
											Next
										</Button>
									</Grid>
								)}
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
													Route {index + 1}
												</Typography>
												{(item.id || !isDisabled) &&
													(methodRoutes.watch("route") || [])?.length > 1 && (
														<div
															className={cn(
																`cursor-pointer`,
																isDisabled ? "hidden" : "block"
															)}
															onClick={() => {
																if (isDisabled) return;
																setDeleteRoute({
																	isOpen: true,
																	id: item.id || "",
																	index: index,
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
											<Grid item xs={6}>
												<RHFTextField
													name={`route.${index}.route_name`}
													label="Route Name ID"
													placeholder="Input route name"
													autoFocus={false}
													required={!isDisabled}
													disabled={isDisabled}
													className="w-full"
												/>
											</Grid>
											<Grid item xs={6}>
												<RHFTextField
													name={`route.${index}.route_name_en`}
													label="Route Name EN"
													placeholder="Input route name"
													autoFocus={false}
													required={!isDisabled}
													disabled={isDisabled}
													className="w-full"
												/>
											</Grid>
											<Grid item xs={6}>
												<RHFTextArea
													name={`route.${index}.description`}
													label="Description ID"
													placeholder="Input description"
													rows={4}
													disabled={isDisabled}
													className="w-full"
												/>
											</Grid>
											<Grid item xs={6}>
												<RHFTextArea
													name={`route.${index}.description_en`}
													label="Description EN"
													placeholder="Input description"
													rows={4}
													disabled={isDisabled}
													className="w-full"
												/>
											</Grid>
										</Grid>
									))}
								</div>
								{!isDisabled && (
									<div
										className="mt-5 flex-row flex items-center justify-start cursor-pointer gap-1"
										onClick={() => {
											if (isDisabled) return;
											let data = methodRoutes.watch("route");
											methodRoutes.setValue("route", [
												...(data || []),
												{
													route_name: "",
													route_name_en: "",
													description: "",
													description_en: "",
													image: "",
													id: "",
												},
											]);
										}}
									>
										<Icon icon="ic:outline-plus" width="24" height="24" />
										<Typography className="font-bold">Add route</Typography>
									</div>
								)}

								{!isDisabled && (
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
											Save
										</Button>
									</div>
								)}
							</FormProvider>
						)}
					</FormProvider>
					<DialogDelete
						open={deleteRoute.isOpen}
						onClose={() => {
							setDeleteRoute({ isOpen: false, id: "", index: 0 });
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
