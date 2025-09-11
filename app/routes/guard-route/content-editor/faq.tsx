import PageAuthorization from "@/components/page-authorization";
import type { Route } from "./+types/faq";
import SocialMediaPage from "@/page/content-editor/social-media";
import FAQListPage from "@/page/content-editor/faq/list";

export function meta({}: Route.MetaArgs) {
	return [{ title: "Content Editor - FAQ | Hyundai Factory Tour" }];
}

export default function ContentEditorFaq() {
	return (
		<PageAuthorization role={["Super", "CMS"]}>
			<FAQListPage />
		</PageAuthorization>
	);
}
