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
import { useState } from "react";
import ScheduleDone from "./course-tour/schedule-done";

interface DialogAddVipProps {
	open: boolean;
	onClose: () => void;
	data?: any;
	refetch?: () => void;
}

const DialogAddVip = ({ open, onClose, data, refetch }: DialogAddVipProps) => {
	const [dialogConfirm, setDialogConfirm] = useState(false);
	const steps = [
		{ key: "info_dasar", label: "Isi Informasi Dasar" },
		{ key: "info_anggota", label: "Isi Daftar Anggota Group" },
		{ key: "done", label: "Selesai" },
	];

	const methods = useForm({
		defaultValues: {
			step: "info_dasar",
			type: "",
			date: new Date().toString(),
			info_group: { email: "" },
			group_member: [{}],
		},
		mode: "onChange",
		resolver: yupResolver(FormRegisterTourSchema),
	});

	return (
		<DialogModal
			open={open}
			//open
			onOpenChange={() => {
				if (methods.watch("step") !== "done") {
					setDialogConfirm(true);
				}
			}}
			headerTitle={
				<div className="flex flex-row gap-2 items-center mt-[-5px]">
					<Icon icon="fa7-solid:arrow-left" width="14" height="14" />
					<Typography className="font-bold">Isi Daftar Peserta</Typography>
				</div>
			}
			contentProps="w-[95%] max-h-[90%]"
			content={
				<div className="">
					<StepNavigation
						steps={steps}
						value={methods.watch("step")}
						onChange={(key) => {
							if (methods.formState.isValid) {
								methods.setValue("step", key);
							}
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
