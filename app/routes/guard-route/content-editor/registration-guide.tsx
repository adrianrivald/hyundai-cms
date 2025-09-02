import PageAuthorization from "@/components/page-authorization";
import type { Route } from "./+types/registration-guide";
import RegistrationGuidePage from "@/page/content-editor/registration-guide";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Content Editor - Registration Guide | Hyundai Factory Tour" },
	];
}

export default function ContentEditorRegistrationGuide() {
	return (
		<PageAuthorization>
			<RegistrationGuidePage />
		</PageAuthorization>
	);
}
