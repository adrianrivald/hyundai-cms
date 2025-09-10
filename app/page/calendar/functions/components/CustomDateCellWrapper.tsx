import { type Event } from "react-big-calendar";

export const CustomDateCellWrapper =
	(events: Event[], currentMonth: Date) =>
	({ value, children }: { value: Date; children: React.ReactNode }) => {
		// const isSameDate = (a: Date, b: Date) =>
		// 	a.getFullYear() === b.getFullYear() &&
		// 	a.getMonth() === b.getMonth() &&
		// 	a.getDate() === b.getDate();
		const isWeekend = value.getDay() === 0 || value.getDay() === 6;
		const isOutsideMonth = value.getMonth() !== currentMonth.getMonth();

		// const isCustomWeekend = customWeekendDates.some((d) =>
		// 	isSameDate(d, value)
		// );

		const isSpecialDay = isWeekend; //|| isCustomWeekend;

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
				{/* Date number */}
				<div
					className={`relative top-1 text-center left-1 text-xs font-semibold z-10 ${
						isSpecialDay ? "text-red-500" : "text-gray-800"
					}`}
				>
					{value.getDate()}
				</div>

				{/* Events passed through children (still rendered by RBC) */}
				<div className="pt-4">{children}</div>
			</div>
		);
	};
