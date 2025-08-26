import type { Route } from "./+types/legal";
import SocialMediaPage from "@/page/content-editor/social-media";

export function meta({}: Route.MetaArgs) {
	return [{ title: "Content Editor - Legal | Hyundai Factory Tour" }];
}

export default function ContentEditorLegal() {
	return <SocialMediaPage />;
}
