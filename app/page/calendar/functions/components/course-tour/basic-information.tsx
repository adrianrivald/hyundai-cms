import type { UseFormReturn } from "react-hook-form";
import type { FormRegisterTour } from "../../models/register-tour";
import RHFDatePicker from "@/components/RHForm/RHFDatePicker";
import RHFRadioGroup from "@/components/RHForm/RHFRadioGroup";
import { Typography } from "@/components/typography";
import { Grid } from "@/components/grid";
import RHFTextField from "@/components/RHForm/RHFTextField";
import RHFSelect from "@/components/RHForm/RHFSelect";

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
						label="Pilih Tanggal Berkunjung"
						required
						placeholder="Pilih Tanggal Berkunjung"
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
						Informasi Group Kunjungan
					</Typography>
					<Grid container spacing={3} className="mt-3">
						<Grid item xs={6} md={3}>
							<RHFTextField
								name="info_group.group_name"
								label="Nama Group"
								placeholder="Masukan nama group"
								autoFocus={false}
								required
							/>
						</Grid>
						{methods.watch("type") === "student-course" && (
							<Grid item xs={6} md={3}>
								<RHFSelect
									name="info_group.group_type"
									label="Tipe Group"
									options={[
										{ id: "sd", name: "SD" },
										{ id: "smp", name: "SMP" },
										{ id: "sma", name: "SMA" },
										{ id: "smk", name: "SMK" },
										{ id: "kuliah", name: "Kuliah" },
									]}
									placeholder="Pilih tipe group"
									getOptionLabel={(user) => user.name}
									getOptionValue={(user) => String(user.id)}
									required
								/>
							</Grid>
						)}

						<Grid item xs={6} md={3}>
							<RHFTextField
								name="info_group.group_leader"
								label="Nama Ketua Group"
								placeholder="Masukan nama ketua group"
								autoFocus={false}
								required
							/>
						</Grid>
						<Grid item xs={6} md={3}>
							<RHFSelect
								name="info_group.purpose_visit"
								label="Tujuan Berkunjung"
								options={[
									{ id: "industrial-visit", name: "Industrial Visit" },
									{ id: "benchmarking", name: "Benchmarking" },
								]}
								placeholder="Pilih tujuan berkunjung"
								getOptionLabel={(user) => user.name}
								getOptionValue={(user) => String(user.id)}
								required
							/>
						</Grid>
						<Grid item xs={6} md={3}>
							<RHFTextField
								name="info_group.city"
								label="Kota Asal"
								placeholder="Masukan kota asal"
								autoFocus={false}
								required
							/>
						</Grid>
						<Grid item xs={6} md={3}>
							<RHFTextField
								name="info_group.email"
								label="Alamat Email"
								placeholder="Masukan alamat email"
								autoFocus={false}
								required
							/>
						</Grid>
						<Grid item xs={6} md={3}>
							<RHFSelect
								name="info_group.gender"
								label="Jenis Kelamin"
								options={[
									{ id: "male", name: "Pria" },
									{ id: "female", name: "Wanita" },
								]}
								placeholder="Pilih jenis kelamin"
								getOptionLabel={(user) => user.name}
								getOptionValue={(user) => String(user.id)}
								required
							/>
						</Grid>
						<Grid item xs={6} md={3}>
							<RHFTextField
								name="info_group.age"
								label="Usia"
								placeholder="Masukan usia"
								autoFocus={false}
								required
								type="number"
								maxLength={10}
							/>
						</Grid>
						<Grid item xs={7} md={5} className="mt-3">
							<RHFRadioGroup
								name="info_group.isDifabel"
								label="Berkebutuhan Khusus (Difabel)"
								options={["Ya", "Tidak"]}
								values={["true", "false"]}
								getOptionLabel={["Ya", "Tidak"]}
								direction="row"
								size="sm"
								itemRadioProps={"border-[1px] rounded-sm px-5 py-2"}
							/>
						</Grid>
					</Grid>
				</div>
			)}
		</div>
	);
};

export default BasicInformation;
