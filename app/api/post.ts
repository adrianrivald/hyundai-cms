import { useQuery, type QueryObserverOptions } from "@tanstack/react-query";
import apiConfig from "~/config/api";

import type { PostTypes } from "~/types/PostTypes";

async function fetchPosts() {
	const data = await apiConfig.get(`/posts`);

	return data?.data;
}

export function usePostList(options?: QueryObserverOptions<PostTypes[]>) {
	return useQuery({
		queryKey: ["posts"],
		queryFn: () => fetchPosts(),
		placeholderData: (prev) => prev,
		...options,
	});
}
