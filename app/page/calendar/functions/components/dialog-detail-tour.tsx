import { useGetTourDetails, type TourDetailsType } from "@/api/tour";
import DialogModal from "@/components/custom/dialog/dialog-modal";
import { Grid } from "@/components/grid";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { format, isValid } from "date-fns";
import DialogRescheduleEmail from "./dialog-reschedule-email";
import { useState } from "react";
import { useTableConfig } from "@/hooks/use-table-config";
import { useTableState } from "@/hooks/use-table-state";
import { dataParticipantsColumn } from "../column/columns-detail-participants";
import { DataTable } from "@/components/layout/table/data-table";
import { useForm } from "react-hook-form";
import FormProvider from "@/components/RHForm/FormProvider";
import RHFTextField from "@/components/RHForm/RHFTextField";
import { SearchIcon } from "lucide-react";
import { dataVehicleColumn } from "../column/column-vehicle";
import DialogReschedule from "./dialog-reschedule";
import DialogFormVisitor from "./dialog-form-visitor";

interface DialogDetailTourProps {
	open: boolean;
	onClose: () => void;
	data: any;
}

const DialogDetailTour = ({ open, onClose, data }: DialogDetailTourProps) => {
	const { data: dataDetail, refetch } = useGetTourDetails(data?.id);
	const [openVip, setOpenVip] = useState({ isOpen: false, id: 0 });
	const tableState = useTableState({});
	const [openEmail, setOpenEmail] = useState({
		isOpen: false,
		email: "",
		id: "",
	});
	const methods = useForm({
		defaultValues: {
			search: "",
		},
	});
	const [openAddParticipants, setOpenAddParticipants] = useState({
		isOpen: false,
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

	const search = methods.watch("search")?.trim() || "";
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

	const tableVehicle = useTableConfig({
		data: dataDetail?.vehicles || [],
		columns: dataVehicleColumn as any,
		tableState,
	});

	return (
		<DialogModal
			open={open}
			onOpenChange={() => {
				onClose();
			}}
			headerTitle={
				<div className="flex flex-row justify-between ">
					<div className="flex flex-row gap-2 items-center mt-[-5px]">
						<Icon
							icon="fa7-solid:arrow-left"
							width="14"
							height="14"
							className="cursor-pointer"
							onClick={() => {
								onClose();
								methods.reset();
							}}
						/>
						<Typography className="font-bold">Visit Information</Typography>
						{dataDetail?.participants.every((item) => item.verified_at) && (
							<Icon icon="gg:check-o" width="16" height="16" color="green" />
						)}
					</div>
					<div className="flex flex-row gap-3 mr-5">
						<Button
							variant={"hmmiOutline"}
							onClick={() => {
								setOpenVip({ isOpen: true, id: data?.id || 0 });
							}}
						>
							Change Schedule
						</Button>
						{dataDetail?.tour_package?.tour_packages_type !== "vip" && (
							<Button
								onClick={() =>
									setOpenEmail({
										isOpen: true,
										email: dataDetail?.leader?.email || "",
										id: String(dataDetail?.id) || "",
									})
								}
							>
								Change to VIP
							</Button>
						)}
					</div>
				</div>
			}
			contentProps="w-[95%] h-[90%] pb-10"
			content={
				<div className=" overflow-y-scroll pr-2">
					<Typography className="font-medium">{dataDetail?.name}</Typography>
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
					<div className="max-h-[280px] overflow-y-scroll mb-5">
						<DataTable table={tableVehicle} showPagination={false} />
					</div>
					<div>
						<Typography className="font-bold mt-5 mb-2 text-[18px]">
							List of Participants
						</Typography>
						<div className=" mb-5 flex flex-row gap-3 items-end">
							<FormProvider methods={methods}>
								<RHFTextField
									name="search"
									label="Find Participants"
									placeholder="Find participants name"
									className="w-[300px]"
									endIcon={<SearchIcon className="mr-2" />}
								/>
							</FormProvider>
							<Button
								onClick={() => {
									setOpenAddParticipants({ isOpen: true });
								}}
								className="bg-amber-500 hover:bg-amber-600 cursor-pointer"
							>
								Add New Participants
							</Button>
						</div>

						<div className="max-h-[280px] overflow-y-scroll mb-5">
							<DataTable table={table} showPagination={false} />
						</div>
					</div>

					<DialogRescheduleEmail
						open={openEmail.isOpen}
						onClose={() => {
							setOpenEmail({ isOpen: false, email: "", id: "" });
						}}
						id={openEmail.id}
						email={openEmail.email}
						refetch={refetch}
					/>

					<DialogReschedule
						id={openVip.id}
						refetch={refetch}
						open={openVip.isOpen}
						onClose={() => {
							setOpenVip({ isOpen: false, id: 0 });
						}}
					/>

					<DialogFormVisitor
						open={openAddParticipants.isOpen}
						onClose={() => {
							setOpenAddParticipants({ isOpen: false });
						}}
						tour_id={dataDetail?.tour_number}
						refetch={() => {
							refetch();
						}}
					/>

					{/* <DialogAddVip
						onClose={() => setOpenVip(false)}
						open={openVip}
						refetch={refetch}
						data={dataDetail}
					/> */}
				</div>
			}
		/>
	);
};

export default DialogDetailTour;
