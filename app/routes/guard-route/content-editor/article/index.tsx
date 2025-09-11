import ArticlePage from "@/page/content-editor/article";
import PageAuthorization from "@/components/page-authorization";
import type { Route } from "./+types";

export function meta({}: Route.MetaArgs) {
	return [{ title: "Content Editor - Article | Hyundai Factory Tour" }];
}

export default function ContentEditorArticle() {
	return (
		<PageAuthorization role={["Super", "CMS"]}>
			<ArticlePage />
		</PageAuthorization>
	);
}
