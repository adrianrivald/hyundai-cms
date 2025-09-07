import ArticlePage from "@/page/content-editor/article";

import PageAuthorization from "@/components/page-authorization";
import type { Route } from "./+types";

export function meta({}: Route.MetaArgs) {
	return [{ title: "Update Article | Hyundai Factory Tour" }];
}

export default function UpdateContentEditorArticle() {
	return (
		<PageAuthorization>
			<ArticlePage />
		</PageAuthorization>
	);
}
