import { useEffect, useState } from "react";
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
	parse,
	startOfDay,
	endOfDay,
} from "date-fns";
import "./functions/components/Calendar.css";
import Container from "@/components/container";
import { CustomDateHeader } from "./functions/components/CustomDateHeader";
import { CustomDateCellWrapper } from "./functions/components/CustomDateCellWrapper";
import { useGetHolidays } from "@/api/public-holiday";
import { cn } from "@/lib/utils";
import DialogPublicHoliday from "./functions/components/dialog-public-holiday";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button } from "@/components/ui/button";
import DialogDetailHoliday from "./functions/components/dialog-detail-holiday";
import DialogAddVip from "./functions/components/dialog-add-vip";

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
	const [openHoliday, setOpenHoliday] = useState({ isOpen: false, event: {} });
	const { data, refetch } = useGetHolidays("", false);

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
			id: "",
		},
		{
			title: "Student Course",
			start: addHours(now, 2),
			end: addHours(now, 3),
			type: "TOUR",
			index: 1,
			description: "",
			id: "",
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
				id: item.id,
			}));
			let dataEvent = [...initialEvents, ...holiday];
			setEvents(dataEvent);
		}
	}, [data?.data]);

	const mergingEventDate = () => {
		let holiday: typeof events = [];

		const groupedByDate = events.reduce((acc, item) => {
			const dateKey = startOfDay(new Date(item?.start || "")).toISOString();
			// @ts-ignore
			if (!acc[dateKey]) acc[dateKey] = [];
			// @ts-ignore
			acc[dateKey].push(item);
			return acc;
		}, {});

		holiday = Object.values(groupedByDate).flatMap((group) =>
			group.map((item: any, index: number) => ({
				title: item.title,
				start: item.start,
				end: item.start,
				type: item.type,
				index,
				description: item.description,
				id: item.id,
			}))
		);

		return holiday;
	};

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
							Set Hari Libur
						</Button>
						<Button
							variant={"hmmiPrimary"}
							className="text-sm"
							onClick={() => {
								setOpenVip(true);
							}}
						>
							Tambahkan VIP
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
				<DialogAddVip onClose={() => setOpenVip(false)} open={openVip} />
			</>
		);
	};

	return (
		<Container>
			<Calendar
				localizer={localizer}
				events={mergingEventDate()}
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
					event: ({ event }: { event: any }) => {
						return (
							<div className="text-[11px] cursor-pointer text-white flex flex-row gap-1 items-center">
								<div
									className={cn(
										`min-h-[9px] min-w-[9px]  rounded-lg`,
										event.type === "HOLIDAY" ? "bg-red-600" : "bg-green-600"
									)}
								/>
								{format(event.start || new Date(), "HH:mm")} {event.title}
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
										}
									}}
									className={`${event.index === 0 ? "mt-6" : ""} bg-hmmi-primary-900 `}
									style={{
										border: "1px solid",
										//borderColor: isTour ? "red" : "transparent",
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
		</Container>
	);
}
