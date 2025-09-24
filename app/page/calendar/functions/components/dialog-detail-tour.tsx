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
import DialogDetailsVisitor from "./dialog-details-visitor";
import { useForm } from "react-hook-form";
import FormProvider from "@/components/RHForm/FormProvider";
import RHFTextField from "@/components/RHForm/RHFTextField";
import { SearchIcon } from "lucide-react";

interface DialogDetailTourProps {
	open: boolean;
	onClose: () => void;
	data: any;
}

const DialogDetailTour = ({ open, onClose, data }: DialogDetailTourProps) => {
	const { data: dataDetail } = useGetTourDetails(data?.id);
	const tableState = useTableState({});
	const [openEmail, setOpenEmail] = useState({ isOpen: false, email: "" });
	const methods = useForm({
		defaultValues: {
			search: "",
		},
	});
	// const [openReschedule, setOpenReschedule] = useState({
	// 	isOpen: false,
	// 	code: "",
	// });

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

	return (
		<DialogModal
			open={open}
			onOpenChange={() => {
				onClose();
			}}
			headerTitle={
				<div className="flex flex-row justify-between">
					<div className="flex flex-row gap-2 items-center mt-[-5px]">
						<Icon icon="fa7-solid:arrow-left" width="14" height="14" />
						<Typography className="font-bold">Visit Information</Typography>
					</div>
					<div className="flex flex-row gap-3 mr-5">
						<Button variant={"hmmiOutline"}>Ubah Jadwal</Button>
						{dataDetail?.tour_package?.tour_packages_type !== "vip" && (
							<Button
								onClick={() =>
									setOpenEmail({
										isOpen: true,
										email: dataDetail?.leader?.email || "",
									})
								}
							>
								Ganti VIP
							</Button>
						)}
					</div>
				</div>
			}
			contentProps="w-[95%] max-h-[90%]"
			content={
				<div>
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
								title="Vehicle Type"
								value={
									(dataDetail?.vehicle_type === "tour-bus"
										? "Tour Bus"
										: "Personal Car") || "-"
								}
							/>
						</Grid>
						<Grid item xs={6} md={3}>
							<TextFieldDisabled
								title="Vehicle Plate"
								value={dataDetail?.vehicle_plate_number || "-"}
							/>
						</Grid>
						<Grid item xs={6} md={3}>
							<TextFieldDisabled
								title="Email Address"
								value={dataDetail?.leader.email || "-"}
							/>
						</Grid>
					</Grid>
					<div>
						<Typography className="font-bold my-5 text-[18px]">
							Daftar Peserta
						</Typography>
						<div className="mt-3 mb-5 w-[300px]">
							<FormProvider methods={methods}>
								<RHFTextField
									name="search"
									label="Temukan Peserta"
									placeholder="Cari nama peserta"
									endIcon={<SearchIcon className="mr-2" />}
								/>
							</FormProvider>
						</div>

						<div className="max-h-[280px] overflow-y-scroll mb-10">
							<DataTable table={table} showPagination={false} />
						</div>
					</div>

					<DialogRescheduleEmail
						open={openEmail.isOpen}
						onClose={() => {
							setOpenEmail({ isOpen: false, email: "" });
						}}
						email={openEmail.email}
					/>
				</div>
			}
		/>
	);
};

export default DialogDetailTour;
