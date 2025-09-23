import DialogModal from "@/components/custom/dialog/dialog-modal";
import { Grid } from "@/components/grid";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";

interface DialogDetailTourProps {
	open: boolean;
	onClose: () => void;
	data: any;
}

const DialogDetailTour = ({ open, onClose, data }: DialogDetailTourProps) => {
	console.log("dataaa", data);

	//   {
	//     "title": "VIP Course Tour",
	//     "start": "2025-09-23T02:00:00.000Z",
	//     "end": "2025-09-23T03:00:00.000Z",
	//     "type": "VIP",
	//     "index": 0,
	//     "description": "benchmarking",
	//     "id": 28
	// }

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
				<div className="bg-[#F9F9F9] py-2 pl-3 rounded-sm">{value}</div>
			</>
		);
	};

	return (
		<DialogModal
			open={open}
			//open
			onOpenChange={() => {
				onClose();
			}}
			headerTitle={
				<div className="flex flex-row justify-between">
					<div className="flex flex-row gap-2 items-center mt-[-5px]">
						<Icon icon="fa7-solid:arrow-left" width="14" height="14" />
						<Typography className="font-bold">Informasi Kunjungan</Typography>
					</div>
					<div className="flex flex-row gap-3 mr-5">
						<Button variant={"hmmiOutline"}>Ubah Jadwal</Button>
						<Button>Ganti VIP</Button>
					</div>
				</div>
			}
			contentProps="w-[95%] max-h-[90%]"
			content={
				<div>
					<Typography className="font-medium">SMK Adijaya Ciputat</Typography>
					<Grid container spacing={3} className="mt-5">
						<Grid item xs={6} md={3}>
							<TextFieldDisabled title="Jadwal Kunjungan" value="26/07/2024" />
						</Grid>
					</Grid>
				</div>
			}
		/>
	);
};

export default DialogDetailTour;
