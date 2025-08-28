import ContactPage from "@/page/content-editor/contact";
import type { Route } from "./+types/contact";
import PageAuthorization from "@/components/page-authorization";

export function meta({}: Route.MetaArgs) {
	return [{ title: "Content Editor - Contact | Hyundai Factory Tour" }];
}

export default function ContentEditorContact() {
	return (
		<PageAuthorization>
			<ContactPage />
		</PageAuthorization>
	);
}
