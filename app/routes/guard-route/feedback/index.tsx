import PageAuthorization from "@/components/page-authorization";
import type { Route } from "./+types";
import FeedbackPage from "@/page/feedback";

export function meta({}: Route.MetaArgs) {
	return [{ title: "Calendar | Hyundai Factory Tour" }];
}

export default function Feedback() {
	return (
		<PageAuthorization role={["Super", "PIC"]}>
			<FeedbackPage />
		</PageAuthorization>
	);
}
