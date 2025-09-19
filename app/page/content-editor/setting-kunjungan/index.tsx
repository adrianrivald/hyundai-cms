import { useGetBatches, usePostBatches } from "@/api/batch";
import FormProvider from "@/components/RHForm/FormProvider";
import RHFTimePicker from "@/components/RHForm/RHFTimePicker";
import Container from "@/components/container";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { yupResolver } from "@hookform/resolvers/yup";
import { Icon } from "@iconify/react/dist/iconify.js";
import { addHours, format, isValid } from "date-fns";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const SettingVisitPage = () => {
	const schema = yup.object({
		batches: yup.array().of(
			yup.object({
				batch_identifier: yup.string().required("Batch harus diisi"),
				batch_name: yup.string().nullable(),
				batch_time: yup.string().nullable(),
				batch_timerange: yup.string().nullable(),
				start_time: yup.string().required("Start time harus diisi"),
				end_time: yup.string().required("End time harus diisi"),
			})
		),
	});

	const methods = useForm({
		defaultValues: {
			batches: [
				{
					batch_identifier: "batch_1",
					batch_name: "",
					batch_time: "",
					batch_timerange: "",
					start_time: "",
					end_time: "",
				},
			],
		},
		resolver: yupResolver(schema),
	});

	const { data: dataBatches } = useGetBatches({
		queryKey: ["batches-get-all"],
	});
	const { mutate: mutatePost, isPending: pendingPost } = usePostBatches();

	useEffect(() => {
		if (dataBatches) {
			let data: any = dataBatches?.data?.data?.map((item) => {
				const [start_time = "", end_time = ""] = item.batch_timerange
					? item.batch_timerange.split(" - ")
					: [];

				return {
					batch_identifier: item.batch_identifier,
					batch_name: item.batch_name,
					batch_time: item.batch_time,
					batch_timerange: item.batch_timerange,
					start_time,
					end_time,
				};
			});

			methods.reset({ batches: data });
		}
	}, [dataBatches]);

	const onSubmit = () => {
		const form = methods.watch("batches") || [];
		let data = form.map((item) => `${item.start_time} - ${item.end_time}`);

		mutatePost(data, {
			onSuccess: () => {
				enqueueSnackbar("Data has been changed", {
					variant: "success",
				});
			},
			onError: () => {
				enqueueSnackbar("Error: Failed to change data", {
					variant: "error",
				});
			},
		});
	};

	return (
		<Container className="bg-white px-5 py-5">
			<Typography className="font-bold">Setting Kunjungan</Typography>
			<div className="mt-3 flex flex-row gap-3 mb-3">
				<Typography className="text-sm mt-3">
					Set batas slot kunjungan per hari
				</Typography>
			</div>
			<FormProvider methods={methods}>
				{methods.watch("batches")?.map((_, index) => {
					return (
						<div key={index} className="mb-5">
							<Typography className="font-bold">Batch {index + 1}</Typography>
							<div
								className="mt-2 w-[400px] flex flex-row gap-5 items-center"
								key={index}
							>
								<RHFTimePicker
									name={`batches.${index}.start_time`}
									label="Start Time"
									required
									interval={60}
									minTime="08:00"
									maxTime="18:00"
									placeholder="Pick a time"
									className="w-full"
									format="HH:mm"
								/>
								<RHFTimePicker
									name={`batches.${index}.end_time`}
									label="End Time"
									required
									disabled={!methods.watch(`batches.${index}.start_time`)}
									interval={60}
									minTime={
										methods.watch(`batches.${index}.start_time`) || "09:00"
									}
									maxTime="17:00"
									placeholder="Pick a time"
									className="w-full"
									format="HH:mm"
								/>
								{(methods.watch("batches") || [])?.length > 1 && (
									<div
										className="cursor-pointer"
										onClick={() => {
											const data = methods.watch("batches") || [];
											const newData = data.filter((_, i) => index !== i);

											methods.setValue("batches", newData);
										}}
									>
										<Icon
											icon="mage:trash"
											width="24"
											height="24"
											color="#FF3B30"
										/>
									</div>
								)}
							</div>
						</div>
					);
				})}
				<div className="mt-5">
					<Button
						onClick={() => {
							let data = methods.watch("batches") || [];
							methods.setValue("batches", [
								...data,
								{
									batch_identifier: `batch_${(methods.watch("batches")?.length || 0) + 1}`,
									batch_name: "",
									batch_time: "",
									start_time: "",
									end_time: "",
								},
							]);
						}}
					>
						Tambah Batch
					</Button>
				</div>
			</FormProvider>
			<div className="flex flex-row justify-end">
				<Button
					onClick={() =>
						methods.trigger().then((isValid) => {
							if (isValid) {
								onSubmit();
							}
						})
					}
					className="mt-3"
					disabled={pendingPost}
				>
					Simpan Perubahan
				</Button>
			</div>
		</Container>
	);
};

export default SettingVisitPage;
