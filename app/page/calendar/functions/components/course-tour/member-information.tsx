import type { UseFormReturn } from "react-hook-form";
import type { FormRegisterTour } from "../../models/register-tour";
import { Typography } from "@/components/typography";
import { Grid } from "@/components/grid";
import RHFTextField from "@/components/RHForm/RHFTextField";
import RHFSelect from "@/components/RHForm/RHFSelect";
import RHFDatePicker from "@/components/RHForm/RHFDatePicker";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { usePostRegisterTour, type TourRegisterType } from "@/api/tour-package";
import { format, isValid, parse } from "date-fns";
import { enqueueSnackbar } from "notistack";
import * as XLSX from "xlsx";

interface MemberInformationProps {
	methods: UseFormReturn<FormRegisterTour>;
	refetch?: () => void;
}

const genderOptions = [
	{
		id: "male",
		name: "Male",
	},
	{
		id: "female",
		name: "Female",
	},
];

const difabelOptions = [
	{
		id: "true",
		name: "Yes",
	},
	{
		id: "false",
		name: "No",
	},
];

function excelSerialToDate(serial: number): Date {
	const excelEpoch = new Date(Date.UTC(1899, 11, 30));
	const days = Math.floor(serial);
	return new Date(excelEpoch.getTime() + days * 24 * 60 * 60 * 1000);
}

const MemberInformation = ({ methods, refetch }: MemberInformationProps) => {
	const { mutate: mutatePost, isPending: pendingPost } = usePostRegisterTour();
	const onSubmit = () => {
		const form = methods.watch();
		const data: TourRegisterType = {
			tour_package_id: Number(form.type),
			group_type: form.info_group.group_type || "",
			tour_date: format(new Date(form.date), "yyyy-MM-dd"),
			slot: form.batch,
			name: form.info_group.group_name,
			purpose_of_visit: form?.info_group.purpose_visit,
			city: form.info_group.city,
			vehicle_type: form.info_vehicle.vehicle_type,
			vehicle_plate_number: form.info_vehicle.vehicle_plat,
			attachments: form.info_group.purpose_letter
				? [
						{
							attachment_path: form.info_group.purpose_letter,
							original_filename:
								form.info_group.purpose_letter.split("/").pop() || "",
						},
					]
				: [],
			leader: {
				name: form.info_group.group_leader,
				dob: format(new Date(form.info_group.age), "yyyy-MM-dd"),
				sex: form.info_group.gender,
				email: form.info_group.email,
				phone_number: form.info_group.phone_number,
				is_special_need: form.info_group.isDifabel === "true",
			},
			participants: form.group_member.map((item) => ({
				name: item.name,
				dob: format(new Date(item.dob), "yyyy-MM-dd"),
				sex: item.gender,
				email: item.email,
				phone_number: item.phone,
				is_special_need: item.isDifabel === "true",
			})),
		};

		mutatePost(data, {
			onSuccess: () => {
				refetch && refetch();
				methods.setValue("step", "done");
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

	const onDownload = async () => {
		const response = await fetch("/template.xlsx");
		const blob = await response.blob();

		const url = window.URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = "template_peserta.xlsx";
		document.body.appendChild(link);
		link.click();
		link.remove();
		window.URL.revokeObjectURL(url);
	};

	const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (event) => {
			const data = new Uint8Array(event.target?.result as ArrayBuffer);
			const workbook = XLSX.read(data, { type: "array" });

			const sheetName = workbook.SheetNames[0];
			const worksheet = workbook.Sheets[sheetName];
			const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

			const mappedParticipants = jsonData.map((row: any) => ({
				full_name: row["Name"] || "",
				email: row["Email"] || "",
				phone_no: row["Phone Number"]?.toString() || "",
				gender:
					row["Gender"]?.toLowerCase() === "male"
						? genderOptions?.find((g) => g.id === "male")
						: genderOptions?.find((g) => g.id === "female"),

				birthdate: row["Year of Birth (date/month/year)"]
					? typeof row["Year of Birth (date/month/year)"] === "number"
						? excelSerialToDate(row["Year of Birth (date/month/year)"])
						: parse(
								row["Year of Birth (date/month/year)"],
								"dd/MM/yyyy",
								new Date()
							)
					: null,
				difabel:
					row["Difabel"]?.toLowerCase() === "yes"
						? String("true")
						: String("false"),
			}));

			const nonEmptyParticipants = mappedParticipants.filter(
				(p) => p.email !== ""
			);

			if (nonEmptyParticipants.length > 0) {
				console.log(
					"dataa",
					nonEmptyParticipants.map((item) => ({
						name: item.full_name,
						phone: item.phone_no,
						email: item.email,
						gender: item.gender?.id || "",
						dob: item.birthdate,
						isDifable: item.difabel,
					}))
				);
				methods.setValue(
					"group_member",
					nonEmptyParticipants.map((item) => ({
						name: item.full_name,
						phone: item.phone_no,
						email: item.email,
						gender: item.gender?.id || "",
						dob: item.birthdate?.toString() || "",
						isDifabel: item.difabel,
					}))
				);
			}
		};

		reader.readAsArrayBuffer(file);
	};

	console.log("dataa www", methods.watch());

	return (
		<div>
			<div className="w-full border-[1px] rounded-sm mb-3 flex flex-col items-center">
				<div className=" self-center-500 w-[460px]">
					<Typography className="text-[18px] font-medium text-center my-3 ">
						Upload data secara masal sekaligus, Download format upload dibawah
						ini
					</Typography>
				</div>
				<div
					className="my-3 flex flex-row items-center gap-5 underline justify-center cursor-pointer"
					onClick={() => onDownload()}
				>
					<Icon icon="vscode-icons:file-type-excel" width="46" height="46" />
					<Typography>Download format upload masal</Typography>
				</div>
				<label
					htmlFor="upload-file"
					className="border-[1px] border-dashed w-[97%] mb-5 items-center flex flex-col py-5 mt-3 cursor-pointer"
				>
					<Icon icon="icon-park-outline:upload-one" width="20" height="20" />
					<Typography className="mt-2 text-sm font-bold">
						Upload data
					</Typography>
					<Typography className="mt-1 text-sm">
						(Data yang sudah terisi sesuai format)
					</Typography>
					<input
						id="upload-file"
						type="file"
						accept=".xlsx,.xls,.csv"
						className="hidden"
						onClick={(e) => {
							(e.target as HTMLInputElement).value = "";
						}}
						onChange={(e) => {
							const file = e.target.files?.[0];
							if (file) {
								handleExcelUpload(e);
							}
						}}
					/>
				</label>
			</div>
			<div className="flex items-center w-full my-4">
				<div className="flex-grow border-t border-gray-300"></div>
				<span className="px-3 text-[12px] text-gray-500 text-center">
					Atau anda juga dapat memasukkan data secara manual
					<br />
					melalui formulir di bawah ini.
				</span>
				<div className="flex-grow border-t border-gray-300"></div>
			</div>
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
										options={genderOptions}
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
										options={difabelOptions}
										placeholder="Choose"
										getOptionLabel={(user) => user.name}
										getOptionValue={(user) => String(user.id)}
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
									isDifabel: "",
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
			{/* <div>
				<Typography>{}</Typography>
			</div> */}

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
					disabled={pendingPost}
					onClick={() => {
						methods.trigger().then((isValid) => {
							if (isValid) {
								onSubmit();
							}
						});
					}}
				>
					Add Schedule
				</Button>
			</div>
		</div>
	);
};

export default MemberInformation;
