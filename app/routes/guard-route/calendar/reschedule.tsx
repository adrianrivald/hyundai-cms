import PageAuthorization from "@/components/page-authorization";
import type { Route } from "./+types";
import ReschedulePage from "@/page/calendar/reschedule";

export function meta({}: Route.MetaArgs) {
	return [{ title: "Calendar | Hyundai Factory Tour" }];
}

export default function Reschedule() {
	return (
		<PageAuthorization role={["Super", "PIC", "CMS"]}>
			<ReschedulePage />
		</PageAuthorization>
	);
}
