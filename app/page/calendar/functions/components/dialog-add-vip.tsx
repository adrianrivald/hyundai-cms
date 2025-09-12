import DialogModal from "@/components/custom/dialog/dialog-modal";
import { Grid } from "@/components/grid";
import { Typography } from "@/components/typography";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useForm } from "react-hook-form";

interface DialogAddVipProps {
	open: boolean;
	onClose: () => void;
	data?: any;
	refetch?: () => void;
}

const DialogAddVip = ({ open, onClose, data, refetch }: DialogAddVipProps) => {
	const methods = useForm({
		defaultValues: {
			step: "info_dasar",
		},
	});
	return (
		<DialogModal
			open={true}
			onOpenChange={() => {
				onClose();
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
					<Grid container className="mb-5">
						<Grid
							item
							xs={4}
							onClick={() => {
								methods.setValue("step", "info_dasar");
							}}
							className={cn(
								"py-4 px-5 cursor-pointer flex flex-row items-center gap-3",
								methods.watch("step") === "info_dasar"
									? "bg-[#A8C5F7]"
									: "bg-[#153263]"
							)}
						>
							<Icon
								icon="fluent:checkmark-circle-24-filled"
								height={24}
								width={24}
								color={
									methods.watch("step") !== "info_dasar" ? "white" : "#153263"
								}
							/>
							<Typography className={cn("text-white")}>
								Isi Informasi Dasar
							</Typography>
						</Grid>
						<Grid
							item
							xs={4}
							onClick={() => {
								methods.setValue("step", "info_anggota");
							}}
							className={cn(
								"py-4 px-5 cursor-pointer flex flex-row items-center gap-3",
								methods.watch("step") === "info_anggota"
									? "bg-[#A8C5F7]"
									: "bg-[#153263]"
							)}
						>
							<Icon
								icon="fluent:checkmark-circle-24-filled"
								height={24}
								width={24}
								color={
									methods.watch("step") !== "info_anggota" ? "white" : "#153263"
								}
							/>
							<Typography className={cn("text-white")}>
								Isi Daftar Anggota Group
							</Typography>
						</Grid>
						<Grid
							item
							xs={4}
							onClick={() => {
								methods.setValue("step", "done");
							}}
							className={cn(
								"py-4 px-5 cursor-pointer flex flex-row items-center gap-3",
								methods.watch("step") === "done"
									? "bg-[#A8C5F7]"
									: "bg-[#153263]"
							)}
						>
							<Icon
								icon="fluent:checkmark-circle-24-filled"
								height={24}
								width={24}
								color={methods.watch("step") !== "done" ? "white" : "#153263"}
							/>
							<Typography className={cn("text-white")}>Selesai</Typography>
						</Grid>
					</Grid>
				</div>
			}
		/>
	);
};

export default DialogAddVip;
