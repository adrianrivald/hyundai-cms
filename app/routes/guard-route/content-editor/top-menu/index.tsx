import PageAuthorization from "@/components/page-authorization";

import TopMenuPage from "@/page/content-editor/top-menu";
import type { Route } from "./+types";

export function meta({}: Route.MetaArgs) {
	return [{ title: "Content Editor - Top Menu | Hyundai Factory Tour" }];
}

export default function ContentEditorTopMenu() {
	return (
		<PageAuthorization role={["Super", "CMS"]}>
			<TopMenuPage />
		</PageAuthorization>
	);
}
