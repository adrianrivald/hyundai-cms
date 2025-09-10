import { useState } from "react";
import {
	Calendar,
	dateFnsLocalizer,
	type DayPropGetter,
	type Event,
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
import "./functions/components/Calendar.css";
import Container from "@/components/container";
import { CustomDateHeader } from "./functions/components/CustomDateHeader";
import { CustomToolbar } from "./functions/components/CustomToolbar";
import { CustomDateCellWrapper } from "./functions/components/CustomDateCellWrapper";

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

export default function CalendarPage() {
	//Will remove TBD
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
	//Will remove TBD
	const [events, setEvents] = useState<Event[]>(initialEvents);
	const [currentDate, setCurrentDate] = useState(new Date());
	const isSameDate = (a: Date, b: Date) =>
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate();

	// TBD
	const customWeekendDates = [
		new Date(2025, 7, 19), // 19 August 2025
		new Date(2025, 7, 25), // 25 December 2025
		// Add more dates as needed
	];

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

	return (
		<Container>
			<Calendar
				localizer={localizer}
				events={events}
				startAccessor="start"
				endAccessor="end"
				defaultView="month"
				views={["month"]}
				selectable
				onNavigate={(date) => setCurrentDate(date)}
				//enableAutoScroll={true}
				style={{ height: "85vh" }}
				date={currentDate}
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
		</Container>
	);
}
