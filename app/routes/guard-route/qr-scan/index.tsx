import QRScan from "@/page/qr-scan";
import type { Route } from "./+types";

export function meta({}: Route.MetaArgs) {
	return [{ title: "QR Scan | Hyundai Factory Tour" }];
}

export default function Calendar() {
	return <QRScan />;
}
