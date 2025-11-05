import type { Route } from "./+types";
import RegistrationReportPage from "@/page/report/register";
import PageAuthorization from "@/components/page-authorization";

export function meta({}: Route.MetaArgs) {
	return [{ title: "Registration Report | Hyundai Factory Tour" }];
}

export default function ReportRegistration() {
	return (
		<PageAuthorization role={["Super", "PIC"]}>
			<RegistrationReportPage />
		</PageAuthorization>
	);
}
