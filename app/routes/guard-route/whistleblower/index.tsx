import type { Route } from "./+types";
import WhistleblowerPage from "@/page/whistleblower";

export function meta({}: Route.MetaArgs) {
	return [{ title: "User Management | Hyundai Factory Tour" }];
}

export default function Whistleblower() {
	return <WhistleblowerPage />;
}
