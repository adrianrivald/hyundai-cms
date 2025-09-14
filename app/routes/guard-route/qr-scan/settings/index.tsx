import { lazy } from "react";

const Settings = lazy(() => import("@/page/qr-scan/settings"));

export default function SettingsRoute() {
  return <Settings />;
}
