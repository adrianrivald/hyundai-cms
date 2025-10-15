import { useGetParticipant } from "@/api/qr-scan";
import Container from "@/components/container";
import { Grid } from "@/components/grid";
import NotFound from "@/components/not-found";
import { Typography } from "@/components/typography";
import { Icon } from "@iconify/react/dist/iconify.js";
import { format } from "date-fns";
import { useNavigate, useParams } from "react-router";

const ReportVisitorDetailPage = () => {
	const { id } = useParams();
	const navigation = useNavigate();
	const { data, isFetched } = useGetParticipant(id || "");

	if (isFetched && !data) {
		return (
			<NotFound
				onClick={() => {
					navigation("/report/visitor-report");
				}}
				btnName="Back to Visitor Report"
				message="The user you are looking for might have been removed, had their name changed, or is temporarily unavailable."
			/>
		);
	}

	const TextFieldDisabled = ({
		title,
		value,
	}: {
		title: string;
		value: string;
	}) => {
		return (
			<>
				<div className="mb-1 font-medium">{title}</div>
				<div className="bg-[#F9F9F9] py-2 pl-3 rounded-sm text-ellipsis overflow-hidden">
					{value}
				</div>
			</>
		);
	};

	return (
		<Container className="bg-white p-6 rounded-md">
			<div>
				<div className="mt flex flex-row gap-4 items-center">
					<div
						onClick={() => {
							navigation("/report/visitor-report");
						}}
						className="cursor-pointer"
					>
						<Icon icon="fa7-solid:arrow-left" width="20" height="20" />
					</div>

					<Typography className="text-xl font-bold">Detail Visitor</Typography>
				</div>
				<Grid container spacing={4} className="mt-7">
					<Grid item xs={12}>
						<Typography className="text-lg font-bold">
							Informasi Dasar
						</Typography>
					</Grid>
					<Grid item md={3} xs={6}>
						<TextFieldDisabled
							value={data?.data?.name || ""}
							title="Full Name"
						/>
					</Grid>
					<Grid item md={3} xs={6}>
						<TextFieldDisabled
							value={data?.data?.phone_number || ""}
							title="Phone Number"
						/>
					</Grid>
					<Grid item md={3} xs={6}>
						<TextFieldDisabled value={data?.data?.email || ""} title="Email" />
					</Grid>
					<Grid item md={3} xs={6}>
						<TextFieldDisabled
							value={
								data?.data?.tour?.province.replace(
									/([a-z])([A-Z])/g,
									"$1 $2"
								) || ""
							}
							title="Province"
						/>
					</Grid>
					<Grid item md={3} xs={6}>
						<TextFieldDisabled value={data?.data?.sex || ""} title="Gender" />
					</Grid>
					<Grid item md={3} xs={6}>
						<TextFieldDisabled
							value={
								data?.data?.dob
									? format(new Date(data?.data?.dob || ""), "dd/MM/yyyy")
									: ""
							}
							title="Date of Birth"
						/>
					</Grid>
					<Grid item md={3} xs={6}>
						<TextFieldDisabled
							value={data?.data?.tour?.name || ""}
							title="Group Name"
						/>
					</Grid>
					<Grid item md={3} xs={6}>
						<TextFieldDisabled
							value={(data?.data?.is_special_need ? "Iya" : "Tidak") || ""}
							title="Difabel"
						/>
					</Grid>
					<Grid item xs={12}>
						<Typography className="text-lg font-bold">
							Informasi Kunjungan
						</Typography>
					</Grid>
					<Grid item md={3} xs={6}>
						<TextFieldDisabled
							value={data?.data?.tour?.tour_package?.name || ""}
							title="Tour Type"
						/>
					</Grid>
					<Grid item md={3} xs={6}>
						<TextFieldDisabled
							value={data?.data?.verification_code || ""}
							title="Visitor Code"
						/>
					</Grid>
					<Grid item md={3} xs={6}>
						<TextFieldDisabled
							value={
								data?.data?.tour?.tour_date
									? format(
											new Date(data?.data?.tour?.tour_date || ""),
											"dd/MM/yyyy"
										)
									: ""
							}
							title={"Visit Date"}
						/>
					</Grid>
					<Grid item md={3} xs={6}>
						<TextFieldDisabled
							value={data?.data?.tour?.group_type || "-"}
							title={"Group Type"}
						/>
					</Grid>
					<Grid item md={3} xs={6}>
						<TextFieldDisabled
							value={data?.data?.tour?.slot + " WIB" || "-"}
							title={"Visit Time"}
						/>
					</Grid>
					<Grid item md={3} xs={6}>
						<TextFieldDisabled
							value={
								data?.data?.attended_at
									? format(
											new Date(data?.data?.attended_at || ""),
											"dd/MM/yyyy | HH:mm"
										)
									: "-"
							}
							title={"Last Check-in"}
						/>
					</Grid>
					<Grid item xs={12} className="mt-5 py-3 px-5 border-2 rounded-md">
						<Typography>
							{data?.data?.tour?.allow_marketing === 1
								? "This visitor data is allowed for marketing purposes"
								: "This visitor data is not allowed for marketing purposes"}
						</Typography>
					</Grid>
				</Grid>
			</div>
		</Container>
	);
};

export default ReportVisitorDetailPage;
