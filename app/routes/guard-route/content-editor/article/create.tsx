import ArticlePage from "@/page/content-editor/article";

import PageAuthorization from "@/components/page-authorization";
import type { Route } from "./+types";

export function meta({}: Route.MetaArgs) {
	return [{ title: "Create Article | Hyundai Factory Tour" }];
}

export default function CreateContentEditorArticle() {
	return (
		<PageAuthorization>
			<ArticlePage />
		</PageAuthorization>
	);
}
