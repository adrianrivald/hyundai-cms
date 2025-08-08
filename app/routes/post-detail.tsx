import { useQuery } from "@tanstack/react-query";
import type { Route } from "./+types/post-detail";

import { useParams } from "react-router";
import { fetchPostDetail } from "@/api/post";
import { queryClient } from "@/lib/queryClient";

export function meta() {
	return [
		{ title: `Hyundai App` },
		{ name: "description", content: "Hyundai CMS" },
		{
			name: "keywords",
			content: "React, SEO, Post Detail, Blog, jsonplaceholder",
		},
	];
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
