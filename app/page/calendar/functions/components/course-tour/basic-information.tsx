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

interface BasicInformationProps {
	methods: UseFormReturn<FormRegisterTour>;
}

const BasicInformation = ({ methods }: BasicInformationProps) => {
	return (
		<div className="">
			<div className="w-full border-[1px] rounded-sm p-5">
				<div className="w-[70%]">
					<RHFDatePicker
						className="w-[50%]"
						name="date"
						label="Select Visit Date"
						required
						placeholder="Select Visit Date"
						format="dd/MM/yyyy"
						onChange={(date) => {
							if (date) {
								methods.setValue("date", date.toISOString());
							}
						}}
						//minDate={new Date()}
					/>
				</div>
			</div>
			<div className="mt-5">
				<RHFRadioGroup
					name="type"
					options={["Tur VIP (Private)", "General Tour", "Student Tour"]}
					values={["vip-course", "general-course", "student-course"]}
					getOptionLabel={["Tur VIP (Private)", "General Tour", "Student Tour"]}
					direction="row"
					size="sm"
					itemRadioProps={"border-[1px] rounded-sm px-5 py-2"}
				/>
			</div>
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
						{methods.watch("type") === "student-course" && (
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
							/>
						</Grid>
						<Grid item xs={6} md={3}>
							<RHFTextField
								name="info_group.age"
								label="Age"
								placeholder="Input Age"
								autoFocus={false}
								required
								type="number"
								maxLength={10}
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
								required
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
								maxLength={7}
							/>
						</Grid>
					</Grid>
				</div>
			)}
			{methods.watch("type") && (
				<div className="mt-5 flex flex-row justify-end">
					<Button
						onClick={() => {
							methods.setValue("step", "info_anggota");
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
