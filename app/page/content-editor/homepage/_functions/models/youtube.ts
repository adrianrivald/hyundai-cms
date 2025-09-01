import * as yup from "yup";

export type YoutubeType = {
	id?: string;
	title: string;
	link: string;
};

export const YoutubeSchema = yup.object({
	title: yup.string().required("Judul video harus di isi"),
	link: yup
		.string()
		.required("Link video harus di isi")
		.test("is-youtube", "Link harus berupa URL YouTube yang valid", (value) => {
			if (!value) return false;
			try {
				const url = new URL(value);

				// valid hostnames
				if (
					url.hostname === "youtu.be" ||
					url.hostname === "www.youtube.com" ||
					url.hostname === "youtube.com"
				) {
					// for youtube.com links, must have ?v=
					if (url.hostname.includes("youtube.com")) {
						return url.searchParams.has("v");
					}
					// for youtu.be links, pathname should contain videoId
					if (url.hostname === "youtu.be") {
						return url.pathname.length > 1; // /VIDEOID
					}
				}
				return false;
			} catch {
				return false;
			}
		}),
});
