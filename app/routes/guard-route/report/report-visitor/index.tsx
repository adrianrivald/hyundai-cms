import PageAuthorization from "@/components/page-authorization";
import type { Route } from "./+types";
import ReportVisitorPage from "@/page/report/visitor";

export function meta({}: Route.MetaArgs) {
	return [{ title: "Report Visitor | Hyundai Factory Tour" }];
}

export default function ReportVisitor() {
	return (
		<PageAuthorization role={["Super", "CMS"]}>
			<ReportVisitorPage />
		</PageAuthorization>
	);
}
