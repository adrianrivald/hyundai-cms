import { useEffect, useState } from "react";
import {
	Calendar,
	dateFnsLocalizer,
	type DayPropGetter,
	type Event,
	type ToolbarProps,
} from "react-big-calendar";
import en from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
	format,
	startOfWeek,
	getDay,
	parse,
	startOfDay,
	endOfDay,
	isValid,
	set,
	isSameDay,
	addDays,
} from "date-fns";
import "./functions/components/Calendar.css";
import Container from "@/components/container";
import { CustomDateHeader } from "./functions/components/CustomDateHeader";
import { CustomDateCellWrapper } from "./functions/components/CustomDateCellWrapper";

import DialogPublicHoliday from "./functions/components/dialog-public-holiday";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button } from "@/components/ui/button";
import DialogDetailHoliday from "./functions/components/dialog-detail-holiday";
import DialogAddVip from "./functions/components/dialog-add-vip";
import { useGetCalendars } from "@/api/batch";
import { Typography } from "@/components/typography";
import DialogDetailTour from "./functions/components/dialog-detail-tour";

const locales = {
	enUS: en,
};

const localizer = dateFnsLocalizer({
	format,
	parse,
	startOfWeek,
	getDay,
	locales,
});

type CalendarEvent = {
	title: string;
	start: Date;
	end: Date;
	type: string;
	index: number;
	description?: string;
	id: number | string;
};

export default function CalendarPage() {
	//Will remove TBD
	const [openHoliday, setOpenHoliday] = useState({ isOpen: false, event: {} });
	const [openTourDetail, setOpenTourDetail] = useState({
		isOpen: false,
		event: {},
	});
	const [events, setEvents] = useState<Event[]>([]);

	const [currentDate, setCurrentDate] = useState(new Date());
	const { data, refetch } = useGetCalendars(
		isValid(currentDate)
			? format(currentDate, "yyyy-MM")
			: format(new Date(), "yyyy-MM")
	);

	const highlightWeekendAndCustomDays: DayPropGetter = (date) => {
		const isWeekend = date.getDay() === 0 || date.getDay() === 6;

		const isCustomHoliday = data?.data?.some(
			(item: any) =>
				item?.events?.length > 0 && isSameDay(new Date(item.date), date)
		);

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
		if (!data?.data) return;

		let allEvents: CalendarEvent[] = [];

		data.data.forEach((dayItem: any) => {
			let dailyEvents: CalendarEvent[] = [];

			// --- HOLIDAYS ---
			if (dayItem.events?.length > 0) {
				// dedupe inside each dayItem.events by id
				const uniqueEvents = dayItem.events.filter(
					(h: any, idx: number, self: any[]) =>
						self.findIndex((x) => String(x.id) === String(h.id)) === idx
				);

				dailyEvents.push(
					...uniqueEvents.map((h: any, idx: number) => ({
						title: h.holiday_name,
						start: startOfDay(new Date(h.start_date)),
						end: endOfDay(new Date(h.end_date)),
						type: "HOLIDAY",
						index: idx,
						description: h.description,
						id: h.id,
						allDay: true,
					}))
				);
			}

			// --- SLOTS / TOURS ---
			if (dayItem.slot?.length > 0) {
				dailyEvents.push(
					...dayItem.slot
						.filter((s: any) => s.tour)
						.map((s: any, idx: number) => {
							let baseDate = new Date(dayItem.date);

							let start: Date;
							let end: Date;

							if (
								s.time_range &&
								s.time_range.includes("-") &&
								s.time_range !== "-"
							) {
								// valid range like "08:00 - 09:00"
								let [startStr, endStr] = s.time_range.split(" - ");

								start = set(baseDate, {
									hours: parseInt(startStr.split(":")[0], 10),
									minutes: parseInt(startStr.split(":")[1], 10),
								});

								end = set(baseDate, {
									hours: parseInt(endStr.split(":")[0], 10),
									minutes: parseInt(endStr.split(":")[1], 10),
								});
							} else {
								// fallback if time_range is "-"
								start = startOfDay(baseDate);
								end = endOfDay(baseDate);
							}

							return {
								title: s?.tour?.tour_package?.name || "General Course Tour",
								start,
								end,
								type:
									s.tour.tour_package?.tour_packages_type?.toUpperCase() ??
									"GENERAL-COURSE",
								index: idx,
								description: s.tour.purpose_of_visit,
								id: s.tour.id,
							} as CalendarEvent;
						})
				);
			}

			allEvents.push(...dailyEvents);
		});

		// --- FINAL DEDUPLICATION across allEvents ---
		const uniqueAllEvents = allEvents.filter(
			(ev, idx, self) =>
				self.findIndex(
					(x) => String(x.id) === String(ev.id) && x.type === ev.type
				) === idx
		);

		console.log("dataa", uniqueAllEvents);

		setEvents(uniqueAllEvents);
	}, [data?.data]);

	const CustomToolbar = ({ date, onNavigate, label }: ToolbarProps) => {
		const goToBack = () => onNavigate("PREV");
		const goToNext = () => onNavigate("NEXT");
		const [open, setOpen] = useState(false);
		const [openVip, setOpenVip] = useState(false);

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
							{label ?? format(date, "MMMM yyyy")}
						</span>

						<div
							onClick={goToNext}
							className="cursor-pointer h-[36px] w-[36px] bg-gray-200 rounded-[18px] flex items-center justify-center"
						>
							<Icon icon="formkit:right" width="16" height="16" />
						</div>
					</div>

					<div className="flex flex-row gap-2">
						<Button
							variant={"hmmiOutline"}
							className="text-sm"
							onClick={() => {
								setOpen(true);
							}}
						>
							Set Day Off
						</Button>
						<Button
							variant={"hmmiPrimary"}
							className="text-sm"
							onClick={() => {
								setOpenVip(true);
							}}
						>
							Add Guest
						</Button>
					</div>
				</div>
				<DialogPublicHoliday
					onClose={() => setOpen(false)}
					open={open}
					refetch={() => {
						setEvents([]);
						setTimeout(() => {
							refetch();
						}, 500);
					}}
				/>
				<DialogAddVip
					onClose={() => setOpenVip(false)}
					open={openVip}
					refetch={refetch}
				/>
			</>
		);
	};

	console.log("dataa", events);

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
					dateCellWrapper: CustomDateCellWrapper(currentDate, events),
					event: ({ event }: { event: any }) => {
						return (
							<div
								className={`text-[11px] cursor-pointer ${event.type === "HOLIDAY" ? "text-hmmi-red-500" : "text-white"}  flex flex-row gap-1 items-center`}
							>
								{event.type !== "HOLIDAY" &&
									format(event.start || new Date(), "HH:mm")}{" "}
								<Typography className="font-bold">{event.title}</Typography>
							</div>
						);
					},
					eventContainerWrapper: ({ children, ...props }: any) => {
						return <div style={{ marginTop: 2 }}>{children}</div>;
					},
					eventWrapper: ({ event, children }: any) => {
						return (
							<div>
								<div
									key={event.index}
									onClick={() => {
										if (event.type === "HOLIDAY") {
											setOpenHoliday({ isOpen: true, event: event });
										} else {
											setOpenTourDetail({ isOpen: true, event: event });
										}
									}}
									className={`${event.index === 0 ? "mt-6" : ""} ${event.type === "HOLIDAY" ? "bg-white" : event.type === "GENERAL-COURSE" ? "bg-[#0A5CE6]" : event.type === "STUDENT-COURSE" ? "bg-[#00AE0F]" : "bg-[#FFCF31]"} `}
									style={{
										borderRadius: 4,
										overflow: "hidden",
									}}
								>
									{children}
								</div>
							</div>
						);
					},
				}}
				className="mb-6"
			/>
			{openHoliday.isOpen && (
				<DialogDetailHoliday
					open={openHoliday.isOpen}
					onClose={() => {
						setOpenHoliday({ isOpen: false, event: {} });
					}}
					data={openHoliday.event}
					refetch={refetch}
				/>
			)}

			{openTourDetail.isOpen && (
				<DialogDetailTour
					open={openTourDetail.isOpen}
					onClose={() => {
						setOpenTourDetail({ isOpen: false, event: {} });
					}}
					data={openTourDetail.event}
				/>
			)}
		</Container>
	);
}
