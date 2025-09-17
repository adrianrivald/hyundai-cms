import { useGetFactories, type FactoryType } from "@/api/factory";
import { type FactoryRouteType } from "@/api/factory-route";
import FormProvider from "@/components/RHForm/FormProvider";
import RHFCheckbox from "@/components/RHForm/RHFCheckbox";
import RHFTextArea from "@/components/RHForm/RHFTextArea";
import RHFTextField from "@/components/RHForm/RHFTextField";
import RHFUploadFile from "@/components/RHForm/RHFUploadFile";
import DialogModal from "@/components/custom/dialog/dialog-modal";
import { Grid } from "@/components/grid";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { TourSchema } from "../models/package-tour";
import {
	usePostTourPackage,
	type TourPackagePostType,
	usePutTourPackage,
	type TourPackageType,
} from "@/api/tour-package";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";
import RHFSelect from "@/components/RHForm/RHFSelect";

interface DialogTourProps {
	open: boolean;
	onClose: () => void;
	data?: TourPackageType;
	refetch?: any;
}

const DialogTour = ({ onClose, open, data, refetch }: DialogTourProps) => {
	const methods = useForm({
		defaultValues: {
			id: "",
			//image: "",
			name: "",
			type: "",
			description: "",
			factory_id: [] as number[],
			route_id: [] as { factory_id: number; id: number }[],
			// min_occupy: null,
			// max_occupy: null,
		},
		resolver: yupResolver(TourSchema),
	});

	const { data: dataFactories } = useGetFactories("", {
		queryKey: ["factory-get-all"],
		select: (data) => {
			return data.data
				?.filter((item: FactoryType) => item.routes && item?.routes?.length > 0)
				?.map((factory: FactoryType) => ({
					...factory,
					routes: factory?.routes?.map((route) => ({
						...route,
						factory_id: Number(factory.id),
					})),
				})) as any;
		},
	});

	let dataTour: FactoryType[] = dataFactories as any;
	let dataRoute: FactoryRouteType[] = dataTour?.flatMap(
		(item) => item?.routes
	) as any;

	const { mutate: mutatePost, isPending: pendingPost } = usePostTourPackage();
	const { mutate: mutateEdit, isPending: pendingEdit } = usePutTourPackage();

	const onSubmit = () => {
		const form = methods.watch();
		const postTour: TourPackagePostType = {
			id: data?.id,
			name: form.name,
			description: form.description,
			image_path: form.image,
			tour_packages_type: form.type,
			minimum_participant: form.min_occupy,
			maximum_participant: form.max_occupy,
			factories: (form.route_id || []).map((r) => Number(r.factory_id)),
			routes: (form.route_id || []).map((r) => Number(r.id)),
		};

		if (data?.id) {
			mutateEdit(postTour, {
				onSuccess: () => {
					onClose();
					methods.reset();
					refetch && refetch();
					enqueueSnackbar("Data telah diubah", { variant: "success" });
				},
				onError: () => {
					enqueueSnackbar("Error: Ubah tour gagal", { variant: "error" });
				},
			});
		} else {
			mutatePost(postTour, {
				onSuccess: () => {
					onClose();
					methods.reset();
					refetch && refetch();
					enqueueSnackbar("Data telah ditambahkan", { variant: "success" });
				},
				onError: (err: any) => {
					enqueueSnackbar(`Error : ${err.response?.data?.message}`, {
						variant: "error",
					});
				},
			});
		}
	};

	useEffect(() => {
		if (data && open) {
			methods.reset({
				id: data?.id,
				name: data?.name,
				image: data?.image_path,
				max_occupy: data?.maximum_participant,
				min_occupy: data?.minimum_participant,
				factory_id: data?.factories.map((item) => item.id),
				route_id: data?.routes?.map((item) => ({
					id: item.id,
					factory_id: item.factory_id,
				})),
				description: data?.description,
				type: data?.tour_packages_type,
			});
		}
	}, [open]);

	return (
		<DialogModal
			open={open}
			onOpenChange={() => {
				onClose();
				methods.reset();
			}}
			headerTitle={data?.id ? "Ubah Tour" : "Tambah Tour"}
			contentProps="w-[700px] max-h-[750px] overflow-y-scroll"
			content={
				<div>
					<FormProvider methods={methods}>
						<Grid container spacing={4}>
							<Grid item xs={12}>
								<RHFUploadFile name="image" slug="factory" required />
							</Grid>
							<Grid item xs={12}>
								<RHFSelect
									name="type"
									label="Tipe Tour"
									options={[
										{ id: "vip-course", name: "VIP Course Tour" },
										{ id: "general-course", name: "General Course Tour" },
										{ id: "student-course", name: "Student Course Tour" },
									]}
									placeholder="Pilih tipe tour"
									getOptionLabel={(user) => user.name}
									getOptionValue={(user) => String(user.id)}
									required
								/>
							</Grid>
							<Grid item xs={12}>
								<RHFTextField
									name="name"
									label="Nama Tour"
									placeholder="Masukan nama tour"
									required
								/>
							</Grid>
							<Grid item xs={12}>
								<RHFTextArea
									name="description"
									label="Deskripsi"
									placeholder="Masukan deskripsi"
									rows={5}
								/>
							</Grid>

							{/* === FACTORY CHECKBOXES === */}
							<Grid item xs={12}>
								<Grid container spacing={3}>
									<Grid item xs={12}>
										<Typography className="font-bold text-sm">
											Pabrik
										</Typography>
									</Grid>
									{dataTour?.map((item) => {
										const factoryId = Number(item.id);
										const isChecked = (
											methods.watch("factory_id") || []
										).includes(factoryId);

										return (
											<Grid item xs={3} key={`factory-${factoryId}`}>
												<RHFCheckbox
													name={`factoryFlags.${factoryId}`}
													label={item.name}
													defaultChecked={isChecked}
													onChange={(checked) => {
														let factoryIds = (methods.getValues("factory_id") ||
															[]) as number[];

														if (checked) {
															if (!factoryIds.includes(factoryId)) {
																methods.setValue("factory_id", [
																	...factoryIds,
																	factoryId,
																]);
															}
														} else {
															// remove routes of this factory
															const routes =
																(methods.getValues("route_id") as {
																	id: number;
																	factory_id: number;
																}[]) || [];
															methods.setValue(
																"route_id",
																routes.filter((r) => r.factory_id !== factoryId)
															);

															// remove factory
															methods.setValue(
																"factory_id",
																factoryIds.filter((fid) => fid !== factoryId)
															);
														}
													}}
												/>
											</Grid>
										);
									})}
								</Grid>
							</Grid>

							{/* === ROUTE CHECKBOXES === */}
							{methods.watch("factory_id").length > 0 && (
								<Grid item xs={12}>
									<Grid container spacing={3}>
										<Grid item xs={12}>
											<Typography className="font-bold text-sm">
												Rute Pilihan
											</Typography>
										</Grid>
										{dataRoute
											.filter((item) =>
												methods
													.watch("factory_id")
													.includes(Number(item.factory_id))
											)
											.map((item) => {
												const routeId = Number(item.id);
												const factoryId = Number(item.factory_id);

												const isChecked = (
													methods.watch("route_id") || []
												).some(
													(r: { id: number; factory_id: number }) =>
														r.id === routeId && r.factory_id === factoryId
												);

												return (
													<Grid
														item
														xs={3}
														key={`route-${factoryId}-${routeId}`}
													>
														<RHFCheckbox
															name={`routeFlags.${factoryId}.${routeId}`}
															label={item.name}
															defaultChecked={isChecked}
															onChange={(checked) => {
																const list =
																	(methods.getValues("route_id") as {
																		id: number;
																		factory_id: number;
																	}[]) || [];

																const exists = list.some(
																	(r) =>
																		r.id === routeId &&
																		r.factory_id === factoryId
																);

																if (checked) {
																	if (!exists) {
																		methods.setValue("route_id", [
																			...list,
																			{ id: routeId, factory_id: factoryId },
																		]);
																	}
																} else {
																	methods.setValue(
																		"route_id",
																		list.filter(
																			(r) =>
																				!(
																					r.id === routeId &&
																					r.factory_id === factoryId
																				)
																		)
																	);
																}
															}}
														/>
													</Grid>
												);
											})}
									</Grid>
								</Grid>
							)}

							<Grid item xs={6}>
								<RHFTextField
									type="number"
									name="min_occupy"
									label="Masukan jumlah minimal peserta"
									placeholder="Masukan jumlah minimal peserta"
								/>
							</Grid>
							<Grid item xs={6}>
								<RHFTextField
									type="number"
									name="max_occupy"
									label="Masukan jumlah maksimal peserta"
									placeholder="Masukan jumlah maksimal peserta"
								/>
							</Grid>

							<Grid item xs={12} className="flex justify-end">
								<Button
									loading={pendingEdit || pendingPost}
									onClick={() => {
										methods.trigger().then((isValid) => {
											if (isValid) onSubmit();
										});
									}}
								>
									{methods.watch("id") ? "Ubah" : "Tambahkan"}
								</Button>
							</Grid>
						</Grid>
					</FormProvider>
				</div>
			}
		/>
	);
};

export default DialogTour;
