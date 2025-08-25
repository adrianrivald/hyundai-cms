import UserManagementPage from "@/page/user-management";
import type { Route } from "./+types";

export function meta({}: Route.MetaArgs) {
	return [{ title: "User Management | Hyundai Factory Tour" }];
}

export const ssr = false;

export default function UserManagement() {
	return <UserManagementPage />;
}
