import PageAuthorization from "@/components/page-authorization";
import type { Route } from "../report-activity/+types";
import DetailRegistrationReportPage from "@/page/report/register/detail";

export function meta({}: Route.MetaArgs) {
	return [{ title: "Report Visitor | Hyundai Factory Tour" }];
}

export default function ReportRegistrationDetail() {
	return (
		<PageAuthorization role={["Super", "PIC"]}>
			<DetailRegistrationReportPage />
		</PageAuthorization>
	);
}
