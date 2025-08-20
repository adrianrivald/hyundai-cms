import UserManagementPage from "@/page/user-management";
import type { Route } from "./+types";

export function meta({}: Route.MetaArgs) {
	return [{ title: "Report Activity | Hyundai Factory Tour" }];
}

export default function ReportActivity() {
	return <UserManagementPage />;
}
