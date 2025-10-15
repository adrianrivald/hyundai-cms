import Container from "@/components/container";
import NotFound from "@/components/not-found";
import { Typography } from "@/components/typography";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useNavigate, useParams } from "react-router";
import { useGetTourDetails } from "@/api/tour";
import { Grid } from "@/components/grid";
import { format, isValid } from "date-fns";
import { DataTable } from "@/components/layout/table/data-table";
import { useTableConfig } from "@/hooks/use-table-config";
import { useForm } from "react-hook-form";
import { dataVehicleColumn } from "@/page/calendar/functions/column/column-vehicle";
import { useTableState } from "@/hooks/use-table-state";
import FormProvider from "@/components/RHForm/FormProvider";
import RHFTextField from "@/components/RHForm/RHFTextField";
import { SearchIcon } from "lucide-react";
import { dataParticipantsColumn } from "@/page/calendar/functions/column/columns-detail-participants";

const DetailRegistrationReportPage = () => {
	const { id } = useParams();
	const navigation = useNavigate();
	const { data: dataDetail, isFetched } = useGetTourDetails(id || "");
	const tableState = useTableState({});

	const methods = useForm({
		defaultValues: {
			search: "",
		},
	});

	if (isFetched && !dataDetail) {
		return (
			<NotFound
				onClick={() => {
					navigation("/report/visitor-report");
				}}
				btnName="Back to Registration Report"
				message="The user you are looking for might have been removed, had their name changed, or is temporarily unavailable."
			/>
		);
	}

	const search = methods.watch("search")?.trim() || "";

	const tableVehicle = useTableConfig({
		data: dataDetail?.vehicles || [],
		columns: dataVehicleColumn as any,
		tableState,
	});

	const table = useTableConfig({
		data:
			dataDetail?.participants.filter((item) => {
				if (!search) return true; // no search → include all
				const regex = new RegExp(search, "i"); // "i" = case-insensitive
				return regex.test(item.name);
			}) || [],
		columns: dataParticipantsColumn as any,
		tableState,
	});

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
							navigation("/report/registration-report");
						}}
						className="cursor-pointer"
					>
						<Icon icon="fa7-solid:arrow-left" width="20" height="20" />
					</div>

					<Typography className="text-xl font-bold">
						Detail Registration
					</Typography>
				</div>

				<Typography className="font-medium mt-5">{dataDetail?.name}</Typography>
				<Grid container spacing={3} className="mt-5">
					<Grid item xs={6} md={3}>
						<TextFieldDisabled
							title="Visit Schedule"
							value={
								dataDetail?.tour_date &&
								isValid(new Date(dataDetail?.tour_date))
									? format(new Date(dataDetail?.tour_date), "dd/MM/yyyy")
									: "-"
							}
						/>
					</Grid>
					<Grid item xs={6} md={3}>
						<TextFieldDisabled
							title="Tour Type"
							value={
								dataDetail?.tour_package?.tour_packages_type === "vip"
									? "VIP"
									: dataDetail?.tour_package?.tour_packages_type ===
										  "general-course"
										? "General Tour"
										: "Student Tour"
							}
						/>
					</Grid>
					<Grid item xs={6} md={3}>
						<TextFieldDisabled
							title="Number of Participants"
							value={String(dataDetail?.participants_count) || "-"}
						/>
					</Grid>
					<Grid item xs={6} md={3}>
						<TextFieldDisabled title="City" value={dataDetail?.city || "-"} />
					</Grid>
					{dataDetail?.tour_package?.tour_packages_type ===
						"student-course" && (
						<Grid item xs={6} md={3}>
							<TextFieldDisabled title="Group Type" value={"-"} />
						</Grid>
					)}
					<Grid item xs={6} md={3}>
						<TextFieldDisabled
							title="Email Address"
							value={dataDetail?.leader.email || "-"}
						/>
					</Grid>
				</Grid>
				<Typography className="font-bold mt-5 mb-2 text-[18px]">
					List of Vehicle
				</Typography>
				<div className=" mb-5">
					<DataTable table={tableVehicle} showPagination={false} />
				</div>
				<div>
					<Typography className="font-bold mt-5 mb-2 text-[18px]">
						List of Participants
					</Typography>
					<div className=" mb-5 w-[300px]">
						<FormProvider methods={methods}>
							<RHFTextField
								name="search"
								label="Find Participants"
								placeholder="Find participants name"
								endIcon={<SearchIcon className="mr-2" />}
							/>
						</FormProvider>
					</div>

					<div className=" mb-5">
						<DataTable table={table} showPagination={false} />
					</div>
				</div>
			</div>
		</Container>
	);
};

export default DetailRegistrationReportPage;
