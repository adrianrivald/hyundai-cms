import apiConfig from "@/config/api";
import type { Meta } from "@/lib/convertPagination";
import { queryClient } from "@/lib/queryClient";
import {
	type MutationObserverOptions,
	useMutation,
	type QueryObserverOptions,
	useQuery,
} from "@tanstack/react-query";
import type { AxiosResponse, AxiosError } from "axios";

export type TopMenuTypePost = {
	id?: number;
	name: string;
	content: string;
	status: string;
	blurb?: string;
};

export async function postTopMenu(
	data: TopMenuTypePost
): Promise<AxiosResponse<TopMenuTypePost, AxiosError>> {
	return await apiConfig.post("admin/top-menus", data);
}

export async function putTopMenu(
	data: TopMenuTypePost
): Promise<AxiosResponse<TopMenuTypePost, AxiosError>> {
	return await apiConfig.put(`admin/top-menus/${data.id}`, data);
}

export async function getTopMenu(id: string): Promise<TopMenuTypePost> {
	const response = await apiConfig.get(`admin/top-menus/${id}`);

	return response.data;
}

export async function getTopMenus(
	search_query?: string
): Promise<{ data: TopMenuTypePost[]; meta: Meta }> {
	const response = await apiConfig.get(
		`admin/top-menus?search_query=${search_query}`
	);
	return response.data;
}

export async function deleteTopMenu(id: string): Promise<{ message: string }> {
	return await apiConfig.delete(`admin/top-menus/${id}`);
}

export const usePostTopMenu = (
	options?: MutationObserverOptions<TopMenuTypePost, Error, TopMenuTypePost>
) => {
	return useMutation<TopMenuTypePost, Error, TopMenuTypePost>({
		mutationKey: ["top-menu-post"],
		mutationFn: async (data: TopMenuTypePost) => {
			const response = await postTopMenu(data);
			queryClient.removeQueries({
				predicate: (query) =>
					typeof query.queryKey[0] === "string" &&
					query.queryKey[0].startsWith("top-menu-"),
			});

			return response.data;
		},
		...options,
	});
};

export const useDeleteTopMenu = (
	options?: MutationObserverOptions<{ message: string }, Error, { id: string }>
) => {
	return useMutation<{ message: string }, Error, { id: string }>({
		mutationKey: ["top-menu-delete"],
		mutationFn: async ({ id }) => {
			const response = await deleteTopMenu(id);
			queryClient.removeQueries({
				predicate: (query) =>
					typeof query.queryKey[0] === "string" &&
					query.queryKey[0].startsWith("top-menu-"),
			});

			return response;
		},
		...options,
	});
};

export const usePutTopMenu = (
	options?: MutationObserverOptions<TopMenuTypePost, Error, TopMenuTypePost>
) => {
	return useMutation<TopMenuTypePost, Error, TopMenuTypePost>({
		mutationKey: ["top-menu-put"],
		mutationFn: async (data: TopMenuTypePost) => {
			const response = await putTopMenu(data);
			queryClient.removeQueries({
				predicate: (query) =>
					typeof query.queryKey[0] === "string" &&
					query.queryKey[0].startsWith("top-menu-"),
			});

			return response.data;
		},
		...options,
	});
};

export const useGetTopMenus = (
	search_query: string,
	options?: QueryObserverOptions<{
		data: any[] | TopMenuTypePost[] | any;
		meta: Meta;
	}>
) => {
	return useQuery<{ data: TopMenuTypePost[]; meta: Meta }>({
		queryKey: ["top-menu-get-all", search_query],
		queryFn: async () => {
			const response = await getTopMenus(search_query);
			return response;
		},
		placeholderData: (prev) => prev,
		...options,
	});
};

export const useGetTopMenu = (
	id: string,
	options?: QueryObserverOptions<TopMenuTypePost>
) => {
	return useQuery<TopMenuTypePost>({
		queryKey: ["top-menu-get", id],
		queryFn: async () => {
			const response = await getTopMenu(id);
			//@ts-ignore
			return response?.data;
		},
		placeholderData: (prev) => prev,
		...options,
	});
};
