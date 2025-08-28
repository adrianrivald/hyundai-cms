import UserManagementPage from "@/page/user-management";
import type { Route } from "./+types";
import PageAuthorization from "@/components/page-authorization";

export function meta({}: Route.MetaArgs) {
	return [{ title: "User Management | Hyundai Factory Tour" }];
}

export const ssr = false;

export default function UserManagement() {
	return (
		<PageAuthorization>
			<UserManagementPage />;
		</PageAuthorization>
	);
}
