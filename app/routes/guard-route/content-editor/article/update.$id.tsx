import PageAuthorization from "@/components/page-authorization";
import type { Route } from "./+types";
import ArticleUpdatePage from "@/page/content-editor/article/update";

export function meta({}: Route.MetaArgs) {
	return [{ title: "Update Article | Hyundai Factory Tour" }];
}

export default function UpdateContentEditorArticle() {
	return (
		<PageAuthorization>
			<ArticleUpdatePage />
		</PageAuthorization>
	);
}
