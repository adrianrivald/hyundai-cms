import PageAuthorization from "@/components/page-authorization";
import type { Route } from "./+types";
import CreateTopMenuPage from "@/page/content-editor/top-menu/create";

export function meta({}: Route.MetaArgs) {
	return [{ title: "Create Top Menu | Hyundai Factory Tour" }];
}

export default function CreateContentEditorTopMenu() {
	return (
		<PageAuthorization role={["Super", "CMS"]}>
			<CreateTopMenuPage />
		</PageAuthorization>
	);
}
