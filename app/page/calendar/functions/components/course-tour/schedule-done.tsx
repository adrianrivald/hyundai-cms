import type { UseFormReturn } from "react-hook-form";
import type { FormRegisterTour } from "../../models/register-tour";
import { Typography } from "@/components/typography";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button } from "@/components/ui/button";

interface ScheduleDoneProps {
	methods: UseFormReturn<FormRegisterTour>;
	onClose: () => void;
	refetch?: () => void;
}

const ScheduleDone = ({ methods, onClose, refetch }: ScheduleDoneProps) => {
	return (
		<div className="w-full border-[1px] rounded-sm p-5">
			<div className="px-20 flex flex-col">
				<div className="flex flex-row justify-center">
					<Icon
						icon="hugeicons:sent-02"
						width="70"
						height="70"
						className="mb-5"
					/>
				</div>

				<Typography className="text-center font-bold text-[18px]">
					Penambahan pengunjung VIP berhasil terjadwal
				</Typography>
				<Typography className="text-center text-[14px]">
					Permintaan penambahan pengunjung VIP telah berhasil diproses dan masuk
					ke dalam jadwal kunjungan yang ditentukan.
				</Typography>

				<Button
					className="mt-5 self-center cursor-pointer"
					onClick={() => {
						methods.reset();
						onClose();
						refetch && refetch();
					}}
				>
					Kembali ke menu utama
				</Button>
			</div>
		</div>
	);
};

export default ScheduleDone;
