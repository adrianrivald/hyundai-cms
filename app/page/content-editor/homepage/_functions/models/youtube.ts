import * as yup from "yup";

export type YoutubeType = {
	id?: string;
	title: string;
	link: string;
};

export const YoutubeSchema = yup.object({
	title: yup.string().required("Video title is required"),
	link: yup
		.string()
		.required("Video link is required")
		.test("is-youtube", "Link must be a valid YouTube URL", (value) => {
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
