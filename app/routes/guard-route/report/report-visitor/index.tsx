import UserManagementPage from "@/page/user-management";
import type { Route } from "./+types";

export function meta({}: Route.MetaArgs) {
	return [{ title: "Report Visitor | Hyundai Factory Tour" }];
}

export default function ReportVisitor() {
	return <UserManagementPage />;
}
