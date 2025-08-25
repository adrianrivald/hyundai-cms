import apiConfig from "@/config/api";
import type { AlbumTypes, PostTypes } from "@/types/PostTypes";
import { useQuery, type QueryObserverOptions } from "@tanstack/react-query";

async function fetchTodos(): Promise<AlbumTypes[]> {
	const data = await apiConfig.get(`/todos`);

	return data?.data;
}

export function useTodosList(options?: QueryObserverOptions<AlbumTypes[]>) {
	return useQuery({
		queryKey: ["todos"],
		queryFn: () => fetchTodos(),
		placeholderData: (prev) => prev,
		...options,
	});
}
