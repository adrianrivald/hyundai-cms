import LegalPage from "@/page/content-editor/legal";
import type { Route } from "./+types/legal";

export function meta({}: Route.MetaArgs) {
	return [{ title: "Content Editor - Legal | Hyundai Factory Tour" }];
}

export default function ContentEditorLegal() {
	return <LegalPage />;
}
