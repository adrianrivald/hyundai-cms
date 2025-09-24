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

interface BasicInformationProps {
	methods: UseFormReturn<FormRegisterTour>;
}

const BasicInformation = ({ methods }: BasicInformationProps) => {
	const { data: dataTourPackages } = useGetTourPackages("");

	const {
		data: dataCalendar,
		refetch,
		isLoading,
	} = useGetCalendars(
		isValid(new Date(methods.watch("date")))
			? format(new Date(methods.watch("date")), "yyyy-MM")
			: format(new Date(), "yyyy-MM")
	);

	console.log("dataa", methods.formState.errors);

	return (
		<div className="">
			<div className="w-full border-[1px] rounded-sm p-5">
				<div className="flex flex-row gap-3">
					<RHFDatePicker
						className="w-[200px]"
						name="date"
						label="Select Visit Date"
						required
						placeholder="Select Visit Date"
						format="dd/MM/yyyy"
						onChange={(date) => {
							if (date) {
								methods.setValue("date", date.toISOString());
								setTimeout(() => {
									refetch();
								}, 500);
							}
						}}

						//minDate={new Date()}
					/>

					<RHFSelect
						className="space-y-0 w-[200px]"
						name="batch"
						label="Batch"
						disabled={
							isLoading ||
							(dataCalendar?.data || [])
								?.filter((item) =>
									isSameDay(item.date, methods.watch("date"))
								)?.[0]
								?.slot?.filter((item) => item.tour === null)
								?.map((item) => ({
									id: item.batch_time,
									name: item.time_range,
								})).length === 0
						}
						options={
							(dataCalendar?.data || [])
								?.filter((item) =>
									isSameDay(item.date, methods.watch("date"))
								)?.[0]
								?.slot?.filter((item) => item.tour === null)
								?.map((item) => ({
									id: item.batch_time,
									name: item.time_range,
								})) || []
						}
						placeholder={
							(dataCalendar?.data || [])
								?.filter((item) =>
									isSameDay(item.date, methods.watch("date"))
								)?.[0]
								?.slot?.filter((item) => item.tour === null)
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
				</div>
			</div>
			{methods.watch("batch") && (
				<div className="mt-5">
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
							let data = dataTourPackages?.data?.filter(
								(item) => String(item.id) === tour
							)?.[0];
							console.log("dataa tour", data, dataTourPackages);
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
						}}
					/>
				</div>
			)}

			{methods.watch("type") && (
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
							/>
						</Grid>
						{methods.watch("tour_type") === "student-course" && (
							<Grid item xs={6} md={3}>
								<RHFSelect
									name="info_group.group_type"
									label="Group Type"
									options={[
										{ id: "sd", name: "SD" },
										{ id: "smp", name: "SMP" },
										{ id: "sma", name: "SMA" },
										{ id: "smk", name: "SMK" },
										{ id: "kuliah", name: "Kuliah" },
									]}
									placeholder="Choose group type"
									getOptionLabel={(user) => user.name}
									getOptionValue={(user) => String(user.id)}
									required
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
							/>
						</Grid>
						<Grid item xs={6} md={3}>
							<RHFTextField
								name="info_group.city"
								label="City"
								placeholder="Input City"
								autoFocus={false}
								required
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
								name="info_group.isDifabel"
								label="Berkebutuhan Khusus"
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
						<Grid item xs={12} md={6}>
							<RHFFileUpload
								name="info_group.purpose_letter"
								label="Surat berkunjung"
								accept=".pdf,.word"
								className="space-y-0"
							/>
						</Grid>
					</Grid>
				</div>
			)}

			{methods.watch("type") && (
				<div className="mt-5 border-[1px] rounded-sm p-3">
					<Typography className="font-bold">Vehicle Information</Typography>
					<Grid container spacing={3} className="mt-3">
						<Grid item xs={6} md={3}>
							<RHFSelect
								name="info_vehicle.vehicle_type"
								label="Vehicle Type"
								options={[
									{ id: "private-car", name: "Private Car" },
									{ id: "tour-bus", name: "Tour Bus" },
								]}
								placeholder="Choose Vehicle Type"
								getOptionLabel={(user) => user.name}
								getOptionValue={(user) => String(user.id)}
								required
							/>
						</Grid>
						<Grid item xs={6} md={3}>
							<RHFTextField
								name="info_vehicle.vehicle_plat"
								label="Plate Number"
								placeholder="Input Plate Number"
								autoFocus={false}
								required
								maxLength={9}
							/>
						</Grid>
					</Grid>
				</div>
			)}
			{methods.watch("type") && (
				<div className="mt-5 flex flex-row justify-end">
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
