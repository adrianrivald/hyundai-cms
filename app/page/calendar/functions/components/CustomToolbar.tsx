import { Icon } from "@iconify/react/dist/iconify.js";
import { format } from "date-fns";
import type { ToolbarProps } from "react-big-calendar";

export const CustomToolbar = ({ date, onNavigate, label }: ToolbarProps) => {
	const goToBack = () => onNavigate("PREV");
	const goToNext = () => onNavigate("NEXT");

	return (
		<div className="bg-white mb-7 p-3">
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
		</div>
	);
};
