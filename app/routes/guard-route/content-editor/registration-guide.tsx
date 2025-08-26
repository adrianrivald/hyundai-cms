import type { Route } from "./+types/registration-guide";
import SocialMediaPage from "@/page/content-editor/social-media";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Content Editor - Registration Guide | Hyundai Factory Tour" },
	];
}

export default function ContentEditorRegistrationGuide() {
	return <SocialMediaPage />;
}
