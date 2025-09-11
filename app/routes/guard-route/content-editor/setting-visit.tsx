import type { Route } from "./+types/about-us";
import PageAuthorization from "@/components/page-authorization";
import SettingVisitPage from "@/page/content-editor/setting-kunjungan";

export function meta({}: Route.MetaArgs) {
	return [{ title: "Content Editor - Setting Visit | Hyundai Factory Tour" }];
}

export default function ContentEditorAboutUs() {
	return (
		<PageAuthorization role={["Super", "CMS"]}>
			<SettingVisitPage />
		</PageAuthorization>
	);
}
