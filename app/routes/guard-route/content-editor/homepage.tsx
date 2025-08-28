import Homepage from "@/page/content-editor/homepage";
import type { Route } from "./+types/homepage";
import PageAuthorization from "@/components/page-authorization";

export function meta({}: Route.MetaArgs) {
	return [{ title: "Content Editor - Homepage | Hyundai Factory Tour" }];
}

export default function ContentEditorHomepage() {
	return (
		<PageAuthorization>
			<Homepage />
		</PageAuthorization>
	);
}
