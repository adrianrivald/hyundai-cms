import { lazy } from "react";

const VisitorList = lazy(() => import("@/page/qr-scan/visitor-list"));

export default function VisitorListRoute() {
  return <VisitorList />;
}
