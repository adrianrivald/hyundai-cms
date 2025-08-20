import UserManagementPage from "@/page/user-management";
import type { Route } from "./+types";

export function meta({}: Route.MetaArgs) {
	return [{ title: "Report User | Hyundai Factory Tour" }];
}

export default function ReportUser() {
	return <UserManagementPage />;
}
