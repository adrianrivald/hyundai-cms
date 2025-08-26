import Homepage from "@/page/content-editor/homepage";
import type { Route } from "./+types/homepage";

export function meta({}: Route.MetaArgs) {
	return [{ title: "Content Editor Homepage | Hyundai Factory Tour" }];
}

export default function ContentEditorHomepage() {
	return <Homepage />;
}
