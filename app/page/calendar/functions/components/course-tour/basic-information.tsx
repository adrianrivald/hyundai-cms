import type { UseFormReturn } from "react-hook-form";
import type { FormRegisterTour } from "../../models/register-tour";
import RHFDatePicker from "@/components/RHForm/RHFDatePicker";
import RHFRadioGroup from "@/components/RHForm/RHFRadioGroup";
import { Typography } from "@/components/typography";
import { Grid } from "@/components/grid";
import RHFTextField from "@/components/RHForm/RHFTextField";
import RHFSelect from "@/components/RHForm/RHFSelect";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useGetTourPackages } from "@/api/tour-package";
import { useGetCalendars } from "@/api/batch";
import { format, isSameDay, isValid } from "date-fns";
import { RHFFileUpload } from "@/components/RHForm/RHFUploadInput";
import RHFSelectMultiple from "@/components/RHForm/RHFSelectMultiple";
import { useGetProvinces } from "@/api/tour";
import RHFCheckbox from "@/components/RHForm/RHFCheckbox";

interface BasicInformationProps {
	methods: UseFormReturn<FormRegisterTour>;
}

const BasicInformation = ({ methods }: BasicInformationProps) => {
	const { data: dataTourPackages } = useGetTourPackages("");
	const { data: provinces } = useGetProvinces();

	const {
		data: dataCalendar,
		refetch,
		isLoading,
	} = useGetCalendars(
		isValid(new Date(methods.watch("date")))
			? format(new Date(methods.watch("date")), "yyyy-MM")
			: format(new Date(), "yyyy-MM")
	);

	return (
		<div className="">
			<div className="mt-5 mb-5">
				<RHFRadioGroup
					name="type"
					options={dataTourPackages?.data?.map((item) => item.name) || []}
					values={
						dataTourPackages?.data?.map((item) => String(item.id || "")) || []
					}
					getOptionLabel={
						dataTourPackages?.data?.map((item) => item.name) || []
					}
					direction="row"
					size="sm"
					itemRadioProps={"border-[1px] rounded-sm px-5 py-2"}
					onChange={(tour) => {
						methods.resetField("date");
						methods.setValue("batch", [""]);
						methods.setValue("batch", []);
						let data = dataTourPackages?.data?.filter(
							(item) => String(item.id) === tour
						)?.[0];

						methods.setValue("type", tour);
						methods.setValue("tour_type", data?.tour_packages_type || "");
						methods.setValue(
							"min_participant",
							String(data?.minimum_participant)
						);
						methods.setValue(
							"max_participant",
							String(data?.maximum_participant)
						);
						methods.clearErrors();
					}}
				/>
			</div>

			{methods.watch("tour_type") && (
				<div className="w-full border-[1px] rounded-sm p-5">
					<Grid container spacing={4}>
						<Grid item xs={4}>
							<RHFDatePicker
								className=""
								name="date"
								label="Select Visit Date"
								required
								placeholder="Select Visit Date"
								format="dd/MM/yyyy"
								minDate={new Date()}
								onChange={(date) => {
									if (date) {
										// setTimeout(() => {
										refetch();
										methods.setValue("date", date.toISOString());
										methods.setValue("batch", []);
										methods.clearErrors("date");
									}
								}}
								disabledDateWeekend={[0, 6]}

								//minDate={new Date()}
							/>
						</Grid>
						<Grid item xs={4}>
							{methods.watch("tour_type") !== "vip" ? (
								<RHFSelect
									className="space-y-0"
									name={`batch.${0}`}
									label="Batch"
									disabled={
										isLoading ||
										(dataCalendar?.data || [])
											?.filter((item) =>
												isSameDay(item.date, methods.watch("date"))
											)?.[0]
											?.slot?.filter((item) => item.time_range !== "-")
											?.map((item) => ({
												id: item.batch_time,
												name: item.time_range,
												disabled: !item.verdict,
											}))?.length === 0 ||
										!methods.watch("date")
									}
									options={
										(dataCalendar?.data || [])
											?.filter((item) =>
												isSameDay(item.date, methods.watch("date"))
											)?.[0]
											?.slot?.filter((item) => item.time_range !== "-") //?.filter((item) => item.tour === null)
											?.map((item) => ({
												id: item.batch_time,
												name: item.time_range,
												disabled: !item.verdict,
											})) || []
									}
									placeholder={
										(dataCalendar?.data || [])
											?.filter((item) =>
												isSameDay(item.date, methods.watch("date"))
											)?.[0]
											?.slot //?.filter((item) => item.tour === null)
											?.map((item) => ({
												id: item.batch_time,
												name: item.time_range,
											})).length === 0
											? "No Batch"
											: "Choose batch"
									}
									getOptionLabel={(user) => user.name}
									getOptionValue={(user) => String(user.id)}
									required
									onChange={(text) => methods.setValue(`batch.${0}`, text)}
								/>
							) : (
								<RHFSelectMultiple
									className="space-y-0 py-2"
									name="batch"
									label="Batch"
									disabled={
										isLoading ||
										(dataCalendar?.data || [])
											?.filter((item) =>
												isSameDay(item.date, methods.watch("date"))
											)?.[0]
											?.slot?.filter((item) => item.time_range !== "-")
											?.map((item) => ({
												id: item.batch_time,
												name: item.time_range,
												disabled: !item.verdict,
											})).length === 0 ||
										!methods.watch("date")
									}
									options={
										(dataCalendar?.data || [])
											?.filter((item) =>
												isSameDay(item.date, methods.watch("date"))
											)?.[0]
											?.slot?.filter((item) => item.time_range !== "-") //?.filter((item) => item.tour === null)
											?.map((item) => ({
												id: item.batch_time,
												name: item.time_range,
												disabled: !item.verdict,
											})) || []
									}
									placeholder={
										(dataCalendar?.data || [])
											?.filter((item) =>
												isSameDay(item.date, methods.watch("date"))
											)?.[0]
											?.slot //?.filter((item) => item.tour === null)
											?.map((item) => ({
												id: item.batch_time,
												name: item.time_range,
											})).length === 0
											? "No Batch"
											: "Choose batch"
									}
									getOptionLabel={(user) => user.name}
									getOptionValue={(user) => String(user.id)}
									required
								/>
							)}
						</Grid>
					</Grid>
				</div>
			)}

			{methods.watch("batch") && methods.watch("date") && (
				<div className="mt-5 border-[1px] rounded-sm p-3">
					<Typography className="text-md font-bold">
						Visiting Group Information
					</Typography>
					<Grid container spacing={3} className="mt-3">
						<Grid item xs={6} md={3}>
							<RHFTextField
								name="info_group.group_name"
								label="Group Name"
								placeholder="Input group name"
								autoFocus={false}
								required
								className="space-y-0"
							/>
						</Grid>
						{methods.watch("tour_type") !== "vip" && (
							<Grid item xs={6} md={3}>
								<RHFSelect
									name="info_group.group_type"
									label="Group Type"
									options={
										methods.watch("tour_type") === "student-course"
											? [
													{ id: "sd", name: "SD" },
													{ id: "smp", name: "SMP" },
													{ id: "sma", name: "SMA" },
													{ id: "smk", name: "SMK" },
													{ id: "kuliah", name: "Kuliah" },
												]
											: [
													{
														id: "government",
														name: "Government",
													},
													{
														id: "company",
														name: "Company",
													},
													{
														id: "community",
														name: "Community/Association",
													},
												]
									}
									placeholder="Choose group type"
									getOptionLabel={(user) => user.name}
									getOptionValue={(user) => String(user.id)}
									required
									className="space-y-0"
								/>
							</Grid>
						)}

						<Grid item xs={6} md={3}>
							<RHFTextField
								name="info_group.group_leader"
								label="Group Leader Name"
								placeholder="Input group leader name"
								autoFocus={false}
								required
								className="space-y-0"
							/>
						</Grid>
						<Grid item xs={6} md={3}>
							<RHFSelect
								name="info_group.purpose_visit"
								label="Purpose Visit"
								options={[
									{ id: "industrial-visit", name: "Industrial Visit" },
									{ id: "benchmarking", name: "Benchmarking" },
								]}
								placeholder="Choose purpose visit"
								getOptionLabel={(user) => user.name}
								getOptionValue={(user) => String(user.id)}
								required
								className="space-y-0"
							/>
						</Grid>
						<Grid item xs={6} md={3}>
							<RHFSelect
								name="info_group.city"
								label="Province"
								options={
									provinces?.data?.map((item) => ({ id: item, name: item })) ||
									[]
								}
								placeholder="Choose province"
								getOptionLabel={(user) => user.name}
								getOptionValue={(user) => String(user.id)}
								required
								className="space-y-0"
							/>
						</Grid>
						<Grid item xs={6} md={3}>
							<RHFTextField
								name="info_group.email"
								label="Email Address"
								placeholder="Input Email Address"
								autoFocus={false}
								required
								className="space-y-0"
							/>
						</Grid>
						<Grid item xs={6} md={3}>
							<RHFTextField
								name="info_group.phone_number"
								label="Phone Number"
								placeholder="Input Phone Number"
								autoFocus={false}
								required
								type="number"
								className="space-y-0"
							/>
						</Grid>
						<Grid item xs={6} md={3}>
							<RHFSelect
								name="info_group.gender"
								label="Gender"
								options={[
									{ id: "male", name: "Male" },
									{ id: "female", name: "Female" },
								]}
								placeholder="Choose Gender"
								getOptionLabel={(user) => user.name}
								getOptionValue={(user) => String(user.id)}
								required
								className="space-y-0"
							/>
						</Grid>
						<Grid item xs={6} md={3}>
							<RHFDatePicker
								name={`info_group.age`}
								label="Birth Date"
								required
								placeholder="Select Birth Date"
								format="dd/MM/yyyy"
								onChange={(date) => {
									if (date) {
										methods.setValue(`info_group.age`, date.toISOString());
									}
								}}
								maxDate={new Date()}
							/>
						</Grid>
						<Grid item xs={6} md={3}>
							<RHFSelect
								name="info_group.isParticipant"
								label="Group Leader Participant"
								options={[
									{ id: "true", name: "Yes" },
									{ id: "false", name: "No" },
								]}
								required
								placeholder="Choose"
								getOptionLabel={(user) => user.name}
								getOptionValue={(user) => String(user.id)}
								className="space-y-0"
							/>
						</Grid>
						<Grid item xs={6} md={3}>
							<RHFSelect
								required
								name="info_group.isDifabel"
								label="Any special needs? (Disability)"
								options={[
									{ id: "true", name: "Yes" },
									{ id: "false", name: "No" },
								]}
								placeholder="Choose"
								getOptionLabel={(user) => user.name}
								getOptionValue={(user) => String(user.id)}
								className="space-y-0"
							/>
						</Grid>

						<Grid item xs={6} md={3}>
							<RHFFileUpload
								name="info_group.purpose_letter"
								label="Visiting Letter"
								accept=".pdf,.word"
								className="space-y-0"
								required
							/>
						</Grid>
					</Grid>
				</div>
			)}

			{methods.watch("batch") && methods.watch("date") && (
				<div className="mt-5 border-[1px] rounded-sm p-3">
					<Typography className="font-bold">Vehicle Information</Typography>
					<Typography color="textSecondary" className="my-1 text-[10px]">
						⚠️ Note: Private vehicles are only permitted in{" "}
						<strong>Hyundai</strong> vehicles..
					</Typography>
					{methods?.watch("info_vehicle")?.map((item, index) => {
						return (
							<div>
								<Grid container spacing={3} className="mt-3" key={index}>
									<Grid item xs={6} md={3}>
										<RHFSelect
											name={`info_vehicle.${index}.vehicle_type`}
											label="Vehicle Type"
											options={
												methods.watch("info_vehicle")?.[0]?.vehicle_type ===
												"private-car"
													? [{ id: "private-car", name: "Private Car" }]
													: methods.watch("info_vehicle")?.[0]?.vehicle_type ===
														  "tour-bus"
														? [{ id: "tour-bus", name: "Tour Bus" }]
														: [
																{ id: "private-car", name: "Private Car" },
																{ id: "tour-bus", name: "Tour Bus" },
															]
											}
											placeholder="Choose Vehicle Type"
											getOptionLabel={(user) => user.name}
											getOptionValue={(user) => String(user.id)}
											required
											onChange={(text) => {
												methods.setValue(
													`info_vehicle.${index}.vehicle_type`,
													text
												);
											}}
										/>
									</Grid>
									<Grid item xs={6} md={3}>
										<RHFTextField
											name={`info_vehicle.${index}.vehicle_plat`}
											label="Plate Number"
											placeholder="Input Plate Number"
											autoFocus={false}
											required
											maxLength={9}
										/>
									</Grid>
									{methods.watch("info_vehicle")?.length > 1 && (
										<Grid item xs={12}>
											<Button
												variant={"hmmiGhost"}
												color="red"
												className="text-red-500 h-[20px] mx-0 px-0 hover:bg-transparent hover:text-red-500 cursor-pointer"
												onClick={() => {
													const current = methods.getValues("info_vehicle");
													const updated = current.filter((_, i) => i !== index);
													methods.setValue("info_vehicle", updated, {
														shouldValidate: true,
														shouldDirty: true,
													});
												}}
											>
												Hapus Kendaraan
											</Button>
										</Grid>
									)}
								</Grid>
							</div>
						);
					})}
					<div className="mt-3 flex flex-row justify-end">
						<Button
							variant={"hmmiOutline"}
							onClick={() => {
								let vehicle = methods.watch("info_vehicle");
								vehicle.push({ vehicle_plat: "", vehicle_type: "" });
								methods.setValue("info_vehicle", vehicle);
							}}
							disabled={
								methods.watch("info_vehicle")?.[0].vehicle_type ===
									"tour-bus" ||
								methods.watch("info_vehicle")?.length === 7 ||
								!methods.watch("info_vehicle")?.[0]?.vehicle_type
							}
						>
							Add Vehicle
						</Button>
					</div>
				</div>
			)}

			{methods.watch("batch") && methods.watch("date") && (
				<div className="mt-5 border-[1px] rounded-sm p-3">
					<RHFCheckbox
						name="allow_marketing"
						onChange={(checked) => {
							methods.setValue("allow_marketing", checked);
						}}
						label="Consent to Receive Information & Promotions from Hyundai"
						description="I agree to receive information, promotions, and the latest offers from Hyundai, and I understand that my data will be used in accordance with the privacy policy. I can unsubscribe at any time."
					/>
				</div>
			)}

			{methods.watch("type") && (
				<div className="mt-5 flex flex-row justify-end mb-10">
					<Button
						onClick={() => {
							methods.trigger().then((isValid) => {
								if (isValid) {
									methods.setValue("step", "info_anggota");
								}
							});
						}}
						endIcon={
							<Icon icon="mingcute:arrow-right-line" width="24" height="24" />
						}
					>
						Fill in the group member list
					</Button>
				</div>
			)}
		</div>
	);
};

export default BasicInformation;
