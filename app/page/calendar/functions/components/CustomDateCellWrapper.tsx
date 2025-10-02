export const CustomDateCellWrapper =
	(currentMonth: Date, holiday: any) =>
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
			.filter((item: any) => item.type === "HOLIDAY")
			.some((item: any) => {
				const start = new Date(item.start);
				const end = new Date(item.end); // already adjusted with addDays(1)
				return value >= start && value < end; // inclusive of start, exclusive of end
			});

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
				<div className="mt-6">{children}</div>
			</div>
		);
	};
