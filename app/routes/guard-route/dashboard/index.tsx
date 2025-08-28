import DashboardPage from "@/page/dashboard";
import type { Route } from "./+types";
import PageAuthorization from "@/components/page-authorization";

export function meta({}: Route.MetaArgs) {
	return [{ title: "Dashboard | Hyundai Factory Tour" }];
}

export default function Dashboard() {
	return (
		<PageAuthorization>
			<DashboardPage />;
		</PageAuthorization>
	);
}
