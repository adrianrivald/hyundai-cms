"use client";

import { useState } from "react";
import {
	Calendar,
	dateFnsLocalizer,
	type DayPropGetter,
	type Event,
	type ToolbarProps,
} from "react-big-calendar";

import id from "date-fns/locale/id";

import "react-big-calendar/lib/css/react-big-calendar.css";
import {
	format,
	startOfWeek,
	getDay,
	addHours,
	startOfHour,
	parse,
} from "date-fns";
import { Icon } from "@iconify/react/dist/iconify.js";
import "./Calendar.css";

const locales = {
	id: id,
};

const localizer = dateFnsLocalizer({
	format,
	parse,
	startOfWeek,
	getDay,
	locales,
});

const endOfHour = (date: Date): Date => addHours(startOfHour(date), 1);
const now = new Date();
const initialEvents = [
	{
		title: "Learn cool stuff",
		start: endOfHour(now),
		end: addHours(endOfHour(now), 2),
		index: 0,
	},
	{
		title: "Learn cool stuff 2",
		start: endOfHour(now),
		end: addHours(endOfHour(now), 2),
		index: 1,
	},
];

const CustomToolbar = (toolbar: ToolbarProps) => {
	const goToBack = () => toolbar.onNavigate("PREV");
	const goToNext = () => toolbar.onNavigate("NEXT");

	return (
		<div className="flex flex-row gap-3 items-center mb-5">
			<div
				onClick={goToBack}
				className="cursor-pointer h-[36px] w-[36px] bg-gray-200 rounded-[18px] text-center flex flex-col items-center justify-center"
			>
				<Icon icon="formkit:left" width="16" height="16" />
			</div>
			<span className="rbc-toolbar-label font-bold">
				{format(toolbar.date, "MMMM yyyy")}
			</span>
			<div
				onClick={goToNext}
				className="cursor-pointer h-[36px] w-[36px] bg-gray-200 rounded-[18px] text-center flex flex-col items-center justify-center"
			>
				<Icon icon="formkit:right" width="16" height="16" />
			</div>
		</div>
	);
};

const CustomDateHeader = ({ date }: { date: Date }) => {
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

const CalendarBasic = () => {
	const [events, setEvents] = useState<Event[]>(initialEvents);
	const [currentDate, setCurrentDate] = useState(new Date());

	const customWeekendDates = [
		new Date(2025, 7, 19), // 19 August 2025
		new Date(2025, 7, 25), // 25 December 2025
		// Add more dates as needed
	];

	const isSameDate = (a: Date, b: Date) =>
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate();

	const highlightWeekendAndCustomDays: DayPropGetter = (date) => {
		const isWeekend = date.getDay() === 0 || date.getDay() === 6;

		const isCustomHoliday = customWeekendDates.some((d) => isSameDate(d, date));

		if (isWeekend || isCustomHoliday) {
			return {
				className: "disabled-sunday",
				style: {
					backgroundColor: "#FF3B300D",
					color: "red",
					pointerEvents: "none",
					textAlign: "center",
					".rbc-button-link": {
						color: "red",
					},
				},
			};
		}

		return {};
	};

	const CustomDateCellWrapper =
		(events: Event[], currentMonth: Date) =>
		({ value, children }: { value: Date; children: React.ReactNode }) => {
			const isWeekend = value.getDay() === 0 || value.getDay() === 6;
			const isOutsideMonth = value.getMonth() !== currentMonth.getMonth();

			const isCustomWeekend = customWeekendDates.some((d) =>
				isSameDate(d, value)
			);

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

	return (
		<div className="mt-5">
			<Calendar
				localizer={localizer}
				events={events}
				startAccessor="start"
				endAccessor="end"
				defaultView="month"
				views={["month"]}
				selectable
				onNavigate={(date) => setCurrentDate(date)}
				enableAutoScroll={true}
				style={{ height: "100vh" }}
				dayPropGetter={highlightWeekendAndCustomDays}
				components={{
					header: CustomDateHeader,
					toolbar: CustomToolbar,
					dateCellWrapper: CustomDateCellWrapper(events, currentDate),
					event: ({ event }: { event: Event }) => (
						<div className="text-xs text-blue-600 font-medium ">
							📌 {event.title}
						</div>
					),
					eventContainerWrapper: ({ children, ...props }: any) => {
						return <div style={{ marginTop: 2 }}>{children}</div>;
					},
					eventWrapper: ({ event, children }: any) => {
						const isImportant = event.title.includes("Important");

						return (
							<div
								onClick={() => {
									alert("Clicked");
								}}
								key={event.index}
								className={`${event.index === 0 ? "mt-6" : ""} bg-amber-400`}
								style={{
									border: "2px solid",
									borderColor: isImportant ? "red" : "transparent",
									borderRadius: 4,
									overflow: "hidden",
								}}
							>
								{children}
							</div>
						);
					},
				}}
				className="mb-6"
			/>
		</div>
	);
};

export default CalendarBasic;
