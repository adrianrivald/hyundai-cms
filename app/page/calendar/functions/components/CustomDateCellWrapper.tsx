import type { PublicHolidayType } from "@/api/public-holiday";
import { type Event } from "react-big-calendar";

export const CustomDateCellWrapper =
	(currentMonth: Date, holiday: PublicHolidayType[]) =>
	({ value, children }: { value: Date; children: React.ReactNode }) => {
		const isSameDate = (a: Date, b: Date) => {
			return (
				a.getFullYear() === b.getFullYear() &&
				a.getMonth() === b.getMonth() &&
				a.getDate() === b.getDate()
			);
		};

		const isWeekend = value.getDay() === 0 || value.getDay() === 6;
		const isOutsideMonth = value.getMonth() !== currentMonth.getMonth();

		const isCustomWeekend = holiday
			.map((item) => new Date(item.start_date))
			.some((d) => isSameDate(d, value));

		const isSpecialDay = isWeekend || isCustomWeekend;

		return (
			<div
				className="relative h-full w-full border border-gray-200"
				style={{
					backgroundColor: isOutsideMonth
						? "#f5f5f5"
						: isSpecialDay
							? "#FF3B300D"
							: "white",
					textAlign: "left",
					pointerEvents: "none",
					padding: 2,
				}}
			>
				<div
					className={`relative top-1 text-center left-1 text-xs font-semibold z-10 ${
						isSpecialDay ? "text-red-500" : "text-gray-800"
					}`}
				>
					{value.getDate()}
				</div>

				{/* Events passed through children (still rendered by RBC) */}
				<div className="">{children}</div>
			</div>
		);
	};
