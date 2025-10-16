import { lazy } from "react";

const AddVistor = lazy(() => import("@/page/qr-scan/scan-visitor/add"));

export default function AddVisitorRoute() {
  return <AddVistor />;
}
