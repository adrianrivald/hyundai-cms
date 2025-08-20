import DashboardPage from "@/page/dashboard";
import type { Route } from "./+types";

export function meta({}: Route.MetaArgs) {
	return [{ title: "Dashboard | Hyundai Factory Tour" }];
}

export default function Dashboard() {
	return <DashboardPage />;
}
