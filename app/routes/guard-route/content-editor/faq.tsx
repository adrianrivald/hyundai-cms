import PageAuthorization from "@/components/page-authorization";
import type { Route } from "./+types/faq";
import SocialMediaPage from "@/page/content-editor/social-media";

export function meta({}: Route.MetaArgs) {
	return [{ title: "Content Editor - FAQ | Hyundai Factory Tour" }];
}

export default function ContentEditorFaq() {
	return (
		<PageAuthorization>
			<SocialMediaPage />;
		</PageAuthorization>
	);
}
