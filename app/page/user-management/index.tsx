"use client";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

import CalendarWithDnD from "./BigCalendar";

export const config = {
	ssr: false, // Disable SSR for this route
};

export default function UserManagementPage() {
	return (
		<div>
			{" "}
			User Management
			<div>
				<CalendarWithDnD />
			</div>
		</div>
	);
}
