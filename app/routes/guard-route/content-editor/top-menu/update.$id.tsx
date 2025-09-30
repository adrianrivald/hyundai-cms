import PageAuthorization from "@/components/page-authorization";
import type { Route } from "./+types";
import UpdateTopMenuPage from "@/page/content-editor/top-menu/update";

export function meta({}: Route.MetaArgs) {
	return [{ title: "Update Top Menu | Hyundai Factory Tour" }];
}

export default function UpdateContentEditorTopMenu() {
	return (
		<PageAuthorization role={["Super", "CMS"]}>
			<UpdateTopMenuPage />
		</PageAuthorization>
	);
}
