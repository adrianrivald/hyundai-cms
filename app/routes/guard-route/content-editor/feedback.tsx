import type { Route } from "./+types/feedback";
import PageAuthorization from "@/components/page-authorization";
import FeedbackPage from "@/page/content-editor/feedback";

export function meta({}: Route.MetaArgs) {
	return [{ title: "Content Editor - Feedback | Hyundai Factory Tour" }];
}

export default function ContentEditorFeedback() {
	return (
		<PageAuthorization role={["Super", "CMS"]}>
			<FeedbackPage />
		</PageAuthorization>
	);
}
