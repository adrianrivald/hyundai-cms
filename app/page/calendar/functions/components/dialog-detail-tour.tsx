import { useGetTourDetails } from "@/api/tour";
import DialogModal from "@/components/custom/dialog/dialog-modal";
import { Grid } from "@/components/grid";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { format, isValid } from "date-fns";
import DialogRescheduleEmail from "./dialog-reschedule-email";
import { useState } from "react";

interface DialogDetailTourProps {
	open: boolean;
	onClose: () => void;
	data: any;
}

const DialogDetailTour = ({ open, onClose, data }: DialogDetailTourProps) => {
	const { data: dataDetail } = useGetTourDetails(data?.id);
	const [openEmail, setOpenEmail] = useState({ isOpen: false, email: "" });

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
								value={dataDetail?.participants_count || "-"}
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
