import type { Route } from "./+types/article";
import SocialMediaPage from "@/page/content-editor/social-media";

export function meta({}: Route.MetaArgs) {
	return [{ title: "Content Editor - Article | Hyundai Factory Tour" }];
}

export default function ContentEditorArticle() {
	return <SocialMediaPage />;
}
