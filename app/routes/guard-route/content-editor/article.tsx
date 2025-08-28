import ArticlePage from "@/page/content-editor/article";
import type { Route } from "./+types/article";
import PageAuthorization from "@/components/page-authorization";

export function meta({}: Route.MetaArgs) {
	return [{ title: "Content Editor - Article | Hyundai Factory Tour" }];
}

export default function ContentEditorArticle() {
	return (
		<PageAuthorization>
			<ArticlePage />;
		</PageAuthorization>
	);
}
