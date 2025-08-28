import AboutUsPage from "@/page/content-editor/about-us";
import type { Route } from "./+types/about-us";
import PageAuthorization from "@/components/page-authorization";

export function meta({}: Route.MetaArgs) {
	return [{ title: "Content Editor - About Us | Hyundai Factory Tour" }];
}

export default function ContentEditorAboutUs() {
	return (
		<PageAuthorization>
			<AboutUsPage />
		</PageAuthorization>
	);
}
