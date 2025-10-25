import PageAuthorization from "@/components/page-authorization";
import type { Route } from "./+types";
import CalendarPage from "@/page/calendar";

export function meta({}: Route.MetaArgs) {
	return [{ title: "Calendar | Hyundai Factory Tour" }];
}

export default function Calendar() {
	return (
		<PageAuthorization role={["Super", "Tour"]}>
			<CalendarPage />
		</PageAuthorization>
	);
}
