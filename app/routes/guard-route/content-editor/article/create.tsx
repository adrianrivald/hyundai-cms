import PageAuthorization from "@/components/page-authorization";
import type { Route } from "./+types";
import ArticleCreatePage from "@/page/content-editor/article/create";

export function meta({}: Route.MetaArgs) {
	return [{ title: "Create Article | Hyundai Factory Tour" }];
}

export default function CreateContentEditorArticle() {
	return (
		<PageAuthorization role={["Super", "CMS"]}>
			<ArticleCreatePage />
		</PageAuthorization>
	);
}
