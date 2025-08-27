import ArticlePage from "@/page/content-editor/article";
import type { Route } from "./+types/article";

export function meta({}: Route.MetaArgs) {
	return [{ title: "Content Editor - Article | Hyundai Factory Tour" }];
}

export default function ContentEditorArticle() {
	return <ArticlePage />;
}
