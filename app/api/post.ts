import { useQuery, type QueryObserverOptions } from "@tanstack/react-query";
import apiConfig from "~/config/api";

import type { PostTypes } from "~/types/PostTypes";

async function fetchPosts(): Promise<PostTypes[]> {
	const data = await apiConfig.get(`/posts`);

	return data?.data;
}

export async function fetchPostDetail(id: string): Promise<PostTypes> {
	return await apiConfig.get(`/posts/${id}`).then((res) => res.data);
}

export function usePostList(options?: QueryObserverOptions<PostTypes[]>) {
	return useQuery({
		queryKey: ["posts"],
		queryFn: () => fetchPosts(),
		placeholderData: (prev) => prev,
		...options,
	});
}
