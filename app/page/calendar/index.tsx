import { useEffect, useState } from "react";
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
	startOfDay,
	endOfDay,
} from "date-fns";
import "./functions/components/Calendar.css";
import Container from "@/components/container";
import { CustomDateHeader } from "./functions/components/CustomDateHeader";
import { CustomToolbar } from "./functions/components/CustomToolbar";
import { CustomDateCellWrapper } from "./functions/components/CustomDateCellWrapper";
import { useGetHolidays } from "@/api/public-holiday";

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

	const { data } = useGetHolidays("", false);

	const now = new Date(
		"Wed Sep 15 2025 20:35:23 GMT+0700 (Western Indonesia Time)"
	);
	const initialEvents = [
		{
			title: "General Course",
			start: now,
			end: addHours(now, 1),
			type: "TOUR",
			index: 0,
			description: "",
		},
		{
			title: "Student Course",
			start: addHours(now, 2),
			end: addHours(now, 3),
			type: "TOUR",
			index: 1,
			description: "",
		},
	];
	const [events, setEvents] = useState<Event[]>(initialEvents);
	const [currentDate, setCurrentDate] = useState(new Date());
	const isSameDate = (a: Date, b: Date) =>
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate();
	// TBD

	const highlightWeekendAndCustomDays: DayPropGetter = (date) => {
		const isWeekend = date.getDay() === 0 || date.getDay() === 6;

		const isCustomHoliday = data?.data
			.map((item) => new Date(item.start_date))
			.some((d) => isSameDate(d, date));

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

	useEffect(() => {
		if (data?.data) {
			let holiday = data?.data?.map((item, index) => ({
				title: item.holiday_name,
				start: startOfDay(new Date(item.start_date)),
				end: endOfDay(new Date(item.start_date)),
				type: "HOLIDAY",
				index: events.length + (index + 1),
				description: item.description,
			}));
			setEvents([...events, ...holiday]);
		}
	}, [data?.data]);

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
				style={{ height: "95vh" }}
				date={currentDate}
				dayPropGetter={highlightWeekendAndCustomDays}
				components={{
					header: CustomDateHeader,
					toolbar: CustomToolbar,
					dateCellWrapper: CustomDateCellWrapper(currentDate, data?.data || []),
					event: ({ event }: { event: Event }) => (
						<div className="text-[11px] text-white flex flex-row gap-1 items-center">
							<div className="h-[9px] w-[9px] bg-green-600 rounded-lg" />
							{format(event.start || new Date(), "HH:mm")} {event.title}
						</div>
					),
					eventContainerWrapper: ({ children, ...props }: any) => {
						return <div style={{ marginTop: 2 }}>{children}</div>;
					},
					eventWrapper: ({ event, children }: any) => {
						const isTour = event.type === "TOUR";

						return (
							<div
								onClick={() => {
									alert("Clicked");
								}}
								key={event.index}
								className={`${event.index === 0 ? "mt-6" : ""} bg-hmmi-primary-900 `}
								style={{
									border: "2px solid",
									//borderColor: isTour ? "red" : "transparent",
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
