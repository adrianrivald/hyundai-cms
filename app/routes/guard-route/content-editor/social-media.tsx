import type { Route } from "./+types/social-media";
import SocialMediaPage from "@/page/content-editor/social-media";

export function meta({}: Route.MetaArgs) {
	return [{ title: "Content Editor - Social Media | Hyundai Factory Tour" }];
}

export default function ContentEditorSocialMedia() {
	return <SocialMediaPage />;
}
