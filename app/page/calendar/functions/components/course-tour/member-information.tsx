import type { UseFormReturn } from "react-hook-form";
import type { FormRegisterTour } from "../../models/register-tour";
import { Typography } from "@/components/typography";
import { Grid } from "@/components/grid";
import RHFTextField from "@/components/RHForm/RHFTextField";
import RHFSelect from "@/components/RHForm/RHFSelect";
import RHFDatePicker from "@/components/RHForm/RHFDatePicker";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";

interface MemberInformationProps {
	methods: UseFormReturn<FormRegisterTour>;
}

const MemberInformation = ({ methods }: MemberInformationProps) => {
	return (
		<div>
			<div className="w-full border-[1px] rounded-sm">
				{methods.watch("group_member")?.map((_, index) => {
					return (
						<div
							className={`w-full border-b-[1px] border-t-[1px] ${index === 0 && "rounded-sm "} p-5 mb-5`}
							key={index}
						>
							<Typography className="font-medium">
								Input Data Participant {index + 1}
							</Typography>

							<Grid container spacing={4} className="mt-3">
								<Grid item xs={6} md={3}>
									<RHFTextField
										name={`group_member.${index}.name`}
										label="Full Name"
										placeholder="Input Full Name"
										autoFocus={false}
										required
									/>
								</Grid>
								<Grid item xs={6} md={3}>
									<RHFTextField
										name={`group_member.${index}.phone`}
										label="Phone Number"
										placeholder="Input Phone Number"
										autoFocus={false}
										required
										type="number"
									/>
								</Grid>
								<Grid item xs={6} md={3}>
									<RHFTextField
										name={`group_member.${index}.email`}
										label="Email Address"
										placeholder="Input Email Address"
										autoFocus={false}
										required
									/>
								</Grid>
								<Grid item xs={6} md={3}>
									<RHFSelect
										name={`group_member.${index}.gender`}
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
									<RHFDatePicker
										name={`group_member.${index}.dob`}
										label="Birth Date"
										required
										placeholder="Select Birth Date"
										format="dd/MM/yyyy"
										onChange={(date) => {
											if (date) {
												methods.setValue(
													`group_member.${index}.dob`,
													date.toISOString()
												);
											}
										}}
										maxDate={new Date()}
									/>
								</Grid>
								<Grid item xs={6} md={3}>
									<RHFSelect
										className="space-y-0"
										name={`group_member.${index}.isDifabel`}
										label="Berkebutuhan Khusus ?"
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
								{methods.watch("group_member").length > 1 && (
									<Grid item xs={12}>
										<Typography
											className="text-hmmi-red-500 cursor-pointer"
											onClick={() => {
												const data = methods.watch("group_member") || [];
												const updated = data.filter((_, i) => i !== index);
												methods.setValue("group_member", updated);
											}}
										>
											Remove Participant
										</Typography>
									</Grid>
								)}
							</Grid>
						</div>
					);
				})}
				<div className="flex flex-row justify-end">
					<Button
						onClick={() => {
							let form = methods.watch("group_member");

							methods.setValue("group_member", [
								...form,
								{
									email: "",
									dob: "",
									name: "",
									phone: "",
									gender: "",
									isDifable: "",
								},
							]);
						}}
						className="mb-4 mr-4"
						variant={"hmmiOutline"}
						endIcon={<Icon icon="iconoir:add-user" width="24" height="24" />}
					>
						Add Participant
					</Button>
				</div>
			</div>

			<div className="flex flex-row justify-between mt-10">
				<Button
					className=""
					startIcon={
						<Icon icon="mingcute:arrow-left-line" width="24" height="24" />
					}
					onClick={() => {
						methods.setValue("step", "info_dasar");
					}}
					variant={"hmmiOutline"}
				>
					Previously
				</Button>
				<Button
					className=""
					endIcon={
						<Icon icon="mingcute:arrow-right-line" width="24" height="24" />
					}
					onClick={() => {
						methods.setValue("step", "done");
					}}
				>
					Add Schedule
				</Button>
			</div>
		</div>
	);
};

export default MemberInformation;
