import DialogModal from "@/components/custom/dialog/dialog-modal";
import { StepNavigation } from "@/components/custom/tabs-navigation/tabs-navigation";

import { Typography } from "@/components/typography";

import { yupResolver } from "@hookform/resolvers/yup";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useForm } from "react-hook-form";
import { FormRegisterTourSchema } from "../models/register-tour";
import FormProvider from "@/components/RHForm/FormProvider";
import BasicInformation from "./course-tour/basic-information";
import MemberInformation from "./course-tour/member-information";
import DialogConfirm from "@/components/custom/dialog/dialog-confirm";
import { useEffect, useState } from "react";
import ScheduleDone from "./course-tour/schedule-done";
import type { TourDetailsType } from "@/api/tour";

interface DialogAddVipProps {
	open: boolean;
	onClose: () => void;
	data?: TourDetailsType;
	refetch?: () => void;
}

const toArrayBatch = (slot?: string) => {
	if (!slot) return [];
	return slot.includes(",") ? slot.split(",") : [slot];
};

const DialogAddVip = ({ open, onClose, data, refetch }: DialogAddVipProps) => {
	const [dialogConfirm, setDialogConfirm] = useState(false);
	const steps = [
		{ key: "info_dasar", label: " Basic Information" },
		{ key: "info_anggota", label: " Participant List" },
		{ key: "done", label: "Done" },
	];

	const methods = useForm({
		defaultValues: {
			step: "info_dasar",
			type: "",
			date: "",
			info_group: { email: "" },
			group_member: [{}],
			info_vehicle: [{}],
		},
		mode: "onChange",
		resolver: yupResolver(FormRegisterTourSchema),
	});

	useEffect(() => {
		if (open && data) {
			methods.reset({
				step: "info_dasar",
				date: data?.tour_date,
				type: String(data?.tour_package?.id),
				tour_type: data?.tour_package?.tour_packages_type,
				min_participant: String(data?.tour_package?.minimum_participant),
				max_participant: String(data?.tour_package?.maximum_participant),
				batch: toArrayBatch(data?.slot),
				info_group: {
					group_name: data?.name,
					group_type: "",
					group_leader: data?.leader?.name,
					purpose_visit: data?.purpose_of_visit,
					city: data?.city,
					email: data?.leader?.email,
					gender: data?.leader?.sex,
					isDifabel: String(data?.leader?.is_special_need),
					age: data?.leader?.dob,
					phone_number: data?.leader?.phone_number,
				},
				info_vehicle: data?.vehicles?.map((item) => ({
					vehicle_plat: item.vehicle_plate_number,
					vehicle_type: item.vehicle_type,
				})),
				group_member: data?.participants?.map((item) => ({
					name: item.name,
					gender: item.sex,
					dob: item.dob,
					isDifabel: String(item.is_special_need),
					email: item.email,
					phone: item.phone_number,
				})),
			});
		}
	}, [open, data]);

	return (
		<DialogModal
			//open={open}
			open
			onOpenChange={() => {
				if (methods.watch("step") !== "done") {
					setDialogConfirm(true);
				}
			}}
			headerTitle={
				<div className="flex flex-row gap-2 items-center mt-[-5px]">
					<Icon icon="fa7-solid:arrow-left" width="14" height="14" />
					<Typography className="font-bold">Register Tour</Typography>
				</div>
			}
			contentProps="w-[95%] max-h-[90%]"
			content={
				<div className="">
					<StepNavigation
						steps={steps}
						value={methods.watch("step")}
						onChange={(key) => {
							//if (methods.formState.isValid) {
							methods.setValue("step", key);
							//}
						}}
						activeColor="#153263"
						inactiveColor="#A8C5F7"
					/>
					<div className="max-h-[550px] overflow-y-scroll pr-2">
						<FormProvider methods={methods}>
							{methods.watch("step") === "info_dasar" && (
								// @ts-ignore
								<BasicInformation methods={methods} />
							)}

							{methods.watch("step") === "info_anggota" && (
								// @ts-ignore
								<MemberInformation methods={methods} refetch={refetch} />
							)}

							{methods.watch("step") === "done" && (
								<ScheduleDone
									// @ts-ignore
									methods={methods}
									onClose={() => {
										onClose();
									}}
								/>
							)}
						</FormProvider>
					</div>

					<DialogConfirm
						open={dialogConfirm}
						onClose={() => {
							setDialogConfirm(false);
						}}
						onSubmit={() => {
							setDialogConfirm(false);
							onClose();
							refetch && refetch();
							methods.reset();
						}}
					/>
				</div>
			}
		/>
	);
};

export default DialogAddVip;
