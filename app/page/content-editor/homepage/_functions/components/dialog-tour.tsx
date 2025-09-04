import { useGetFactories } from "@/api/factory";
import { useGetFactoryRoutes } from "@/api/factory-route";
import FormProvider from "@/components/RHForm/FormProvider";
import RHFCheckbox from "@/components/RHForm/RHFCheckbox";
import RHFTextArea from "@/components/RHForm/RHFTextArea";
import RHFTextField from "@/components/RHForm/RHFTextField";
import RHFUploadFile from "@/components/RHForm/RHFUploadFile";
import DialogModal from "@/components/custom/dialog/dialog-modal";
import { Grid } from "@/components/grid";
import { Typography } from "@/components/typography";
import { useForm } from "react-hook-form";

interface DialogTourProps {
	open: boolean;
	onClose: () => void;
	data?: any;
}

const DialogTour = ({ onClose, open, data }: DialogTourProps) => {
	const methods = useForm({
		defaultValues: {
			image: "",
			name: "",
			description: "",
			factory: [] as number[],
			route: [],
			min_occupy: null,
			max_occupy: null,
		},
	});

	const { data: dataFactories } = useGetFactories("");
	//const {data: dataTour} = useGetFactoryRoutes()

	return (
		<DialogModal
			open={open}
			onOpenChange={() => {
				onClose();
				methods.clearErrors();
				methods.reset();
			}}
			headerTitle={data?.id ? "Ubah Tour" : "Tambah Tour"}
			contentProps="w-[700px] max-h-[750px] overflow-y-scroll"
			content={
				<div className="">
					<FormProvider methods={methods}>
						<Grid container spacing={4}>
							<Grid item xs={12}>
								<RHFUploadFile name="image" slug="factory" required />
							</Grid>
							<Grid item xs={12}>
								<RHFTextField
									name="title"
									label="Nama Tour"
									placeholder="Masukan nama tour"
									autoFocus={false}
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
							<Grid item xs={12}>
								<Grid container spacing={3}>
									<Grid item xs={12}>
										<Typography className="font-bold text-sm">
											Pabrik
										</Typography>
									</Grid>
									{dataFactories?.data?.map((item, index) => {
										return (
											<Grid item xs={3} className="">
												<RHFCheckbox
													name={`factory.${index}`}
													label={item.name}
													onChange={(checked) => {
														methods.setValue(
															`factory.${index}`,
															checked ? Number(item.id) : 9999
														);
													}}
												/>
											</Grid>
										);
									})}
								</Grid>
							</Grid>
						</Grid>
					</FormProvider>
				</div>
			}
		/>
	);
};

export default DialogTour;
