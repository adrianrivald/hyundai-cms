import AboutUsPage from "@/page/content-editor/about-us";
import type { Route } from "./+types/about-us";

export function meta({}: Route.MetaArgs) {
	return [{ title: "Content Editor - About Us | Hyundai Factory Tour" }];
}

export default function ContentEditorAboutUs() {
	return <AboutUsPage />;
}
