import { format } from "date-fns";
import id from "date-fns/locale/id";

export const CustomDateHeader = ({ date }: { date: Date }) => {
	const isSunday = date.getDay() === 0 || date.getDay() === 6;

	return (
		<div className="text-sm font-bold text-center py-2">
			<span className={isSunday ? "text-red-500" : "text-black"}>
				{/* @ts-ignore */}
				{format(date, "eeee", { locale: id })}
			</span>
		</div>
	);
};
