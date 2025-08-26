import type { Route } from "./+types/about-us";
import SocialMediaPage from "@/page/content-editor/social-media";

export function meta({}: Route.MetaArgs) {
	return [{ title: "Content Editor - About Us | Hyundai Factory Tour" }];
}

export default function ContentEditorAboutUs() {
	return <SocialMediaPage />;
}
