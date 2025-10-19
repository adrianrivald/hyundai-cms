import { lazy } from "react";
import { useParams } from "react-router";

const AddVistor = lazy(() => import("@/page/qr-scan/scan-visitor/add"));

export default function UpdateVisitor() {
  const { id } = useParams();
  return <AddVistor id={id} />;
}
