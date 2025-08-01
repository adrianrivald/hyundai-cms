import { useQuery } from "@tanstack/react-query";
import type { Route } from "./+types/post-detail";
import { fetchPostDetail } from "~/api/post";
import { queryClient } from "~/lib/queryClient";
import type { PostTypes } from "~/types/PostTypes";
import { useParams } from "react-router";

export function meta({ data }: Route.MetaArgs) {
	if (!data) return [{ title: "Loading Post..." }];

	const post = data as PostTypes;

	return [
		{ title: `${post.title} | App` },
		{ name: "description", content: post.body.slice(0, 160) },
		{
			name: "keywords",
			content: "React, SEO, Post Detail, Blog, jsonplaceholder",
		},
		{ name: "author", content: "Gilang Aditya Rahman" },

		// Open Graph
		{ property: "og:title", content: post.title },
		{ property: "og:description", content: post.body.slice(0, 200) },
		{ property: "og:type", content: "article" },
		{ property: "og:url", content: `https://yourdomain.com/posts/${post.id}` },
		{ property: "og:image", content: "https://yourdomain.com/og-post.jpg" },

		// Twitter Card
		{ name: "twitter:card", content: "summary_large_image" },
		{ name: "twitter:title", content: post.title },
		{ name: "twitter:description", content: post.body.slice(0, 200) },
		{
			name: "twitter:image",
			content: "https://yourdomain.com/twitter-post.jpg",
		},

		{ name: "robots", content: "index, follow" },
		{ name: "viewport", content: "width=device-width, initial-scale=1" },
		{ name: "theme-color", content: "#0d9488" },
		{
			rel: "canonical",
			href: `https://yourdomain.com/posts/${post.id}`,
		} as any,
		{ charSet: "utf-8" } as any,
	];
}

export async function loader({ params }: Route.LoaderArgs) {
	const id = params.id;
	if (!id) throw new Error("Missing post ID");

	await queryClient.prefetchQuery({
		queryKey: ["post", id],
		queryFn: () => fetchPostDetail(id),
	});

	return queryClient.getQueryData(["post", id]);
}

const PostDetail = () => {
	const { id } = useParams<{ id: string }>();

	const { data, isLoading, error } = useQuery({
		queryKey: ["post", id],
		queryFn: () => fetchPostDetail(id!),
		enabled: !!id,
	});

	if (isLoading) return <div>Loading post...</div>;
	if (error || !data) return <div>Error loading post</div>;

	return (
		<div>
			<div className="text-xl font-bold">{data.title}</div>
			<p className="mt-2">{data.body}</p>
		</div>
	);
};

export default PostDetail;
