import PageAuthorization from "@/components/page-authorization";
import type { Route } from "./+types";
import ReportVisitorDetailPage from "@/page/report/visitor/detail";

export function meta({}: Route.MetaArgs) {
	return [{ title: "Report Visitor | Hyundai Factory Tour" }];
}

export default function ReportVisitorDetail() {
	return (
		<PageAuthorization role={["Super", "CMS"]}>
			<ReportVisitorDetailPage />
		</PageAuthorization>
	);
}
