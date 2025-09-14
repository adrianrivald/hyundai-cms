import { lazy } from "react";

const ScanVisitor = lazy(() => import("@/page/qr-scan/scan-visitor"));

export default function ScanVisitorRoute() {
  return <ScanVisitor />;
}
