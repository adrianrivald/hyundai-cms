import LoginPage from "@/page/login";
import type { Route } from "./+types/login";

export function meta({}: Route.MetaArgs) {
	return [{ title: "Login | Hyundai Factory Tour" }];
}

export default function Login() {
	return <LoginPage />;
}
