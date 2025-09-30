import PageAuthorization from "@/components/page-authorization";
import type { Route } from "./+types/social-media";
import SocialMediaPage from "@/page/content-editor/social-media";
import TopMenuPage from "@/page/content-editor/top-menu";

export function meta({}: Route.MetaArgs) {
	return [{ title: "Content Editor - Social Media | Hyundai Factory Tour" }];
}

export default function ContentEditorTopMenu() {
	return (
		<PageAuthorization role={["Super", "CMS"]}>
			<TopMenuPage />
		</PageAuthorization>
	);
}
