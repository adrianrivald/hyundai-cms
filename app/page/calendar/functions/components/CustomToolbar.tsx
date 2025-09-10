import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { format } from "date-fns";
import { useState } from "react";
import type { ToolbarProps } from "react-big-calendar";
import DialogPublicHoliday from "./dialog-public-holiday";

export const CustomToolbar = ({ date, onNavigate, label }: ToolbarProps) => {
	const goToBack = () => onNavigate("PREV");
	const goToNext = () => onNavigate("NEXT");
	const [open, setOpen] = useState(false);

	return (
		<>
			<div className="bg-white mb-7 p-3 flex flex-row justify-between items-center">
				<div className="flex flex-row gap-3 items-center">
					<div
						onClick={goToBack}
						className="cursor-pointer h-[36px] w-[36px] bg-gray-200 rounded-[18px] flex items-center justify-center"
					>
						<Icon icon="formkit:left" width="16" height="16" />
					</div>

					<span className="rbc-toolbar-label font-bold">
						{/* use label if available (localized), otherwise format the date */}
						{label ?? format(date, "MMMM yyyy")}
					</span>

					<div
						onClick={goToNext}
						className="cursor-pointer h-[36px] w-[36px] bg-gray-200 rounded-[18px] flex items-center justify-center"
					>
						<Icon icon="formkit:right" width="16" height="16" />
					</div>
				</div>

				<Button
					variant={"hmmiOutline"}
					className="text-sm"
					onClick={() => {
						setOpen(true);
					}}
				>
					Set Hari Libur
				</Button>
			</div>
			<DialogPublicHoliday onClose={() => setOpen(false)} open={open} />
		</>
	);
};
