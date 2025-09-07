import apiConfig from "@/config/api";
import type { Meta } from "@/lib/convertPagination";
import { queryClient } from "@/lib/queryClient";
import type { BannerType } from "@/page/content-editor/homepage/_functions/models/banner";

import {
	useMutation,
	type MutationObserverOptions,
	useQuery,
	type QueryObserverOptions,
} from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export type ArticleType = {
	id: number;
	author: string;
	name: string;
	blurb: null;
	image_path: string;
	status: string;
	published_at: string;
	is_active: number;
	created_at: string;
};

export type PostArticleType = {
	id?: number;
	name: string;
	content: string;
	image_path: string;
	status: string;
};

export async function postArticle(
	data: PostArticleType
): Promise<AxiosResponse<ArticleType, AxiosError>> {
	return await apiConfig.post("admin/articles", data);
}

export async function putArticle(
	data: PostArticleType
): Promise<AxiosResponse<ArticleType, AxiosError>> {
	return await apiConfig.put(`admin/articles/${data.id}`, data);
}

export async function getArticle(id: string): Promise<ArticleType> {
	const response = await apiConfig.get(`admin/articles/${id}`);

	return response.data;
}

export async function getArticles(
	search_query?: string,
	page?: number
): Promise<{ data: ArticleType[]; meta: Meta }> {
	const response = await apiConfig.get(
		`admin/articles?search_query=${search_query}&page=${page}`
	);
	return response.data;
}

export async function deleteArticle(id: string): Promise<{ message: string }> {
	return await apiConfig.delete(`admin/articles/${id}`);
}

export const usePostArticle = (
	options?: MutationObserverOptions<ArticleType, Error, PostArticleType>
) => {
	return useMutation<ArticleType, Error, PostArticleType>({
		mutationKey: ["article-post"],
		mutationFn: async (data: PostArticleType) => {
			const response = await postArticle(data);
			queryClient.removeQueries({
				predicate: (query) =>
					typeof query.queryKey[0] === "string" &&
					query.queryKey[0].startsWith("article-"),
			});

			return response.data;
		},
		...options,
	});
};

export const useDeleteArticle = (
	options?: MutationObserverOptions<{ message: string }, Error, { id: string }>
) => {
	return useMutation<{ message: string }, Error, { id: string }>({
		mutationKey: ["article-post"],
		mutationFn: async ({ id }) => {
			const response = await deleteArticle(id);
			queryClient.removeQueries({
				predicate: (query) =>
					typeof query.queryKey[0] === "string" &&
					query.queryKey[0].startsWith("article-"),
			});

			return response;
		},
		...options,
	});
};

export const usePutArticle = (
	options?: MutationObserverOptions<ArticleType, Error, PostArticleType>
) => {
	return useMutation<ArticleType, Error, PostArticleType>({
		mutationKey: ["article-put"],
		mutationFn: async (data: PostArticleType) => {
			const response = await putArticle(data);
			queryClient.removeQueries({
				predicate: (query) =>
					typeof query.queryKey[0] === "string" &&
					query.queryKey[0].startsWith("article-"),
			});

			return response.data;
		},
		...options,
	});
};

export const useGetArticles = (
	search_query: string,
	page?: number,
	options?: QueryObserverOptions<{ data: ArticleType[]; meta: Meta }>
) => {
	return useQuery<{ data: ArticleType[]; meta: Meta }>({
		queryKey: ["article-get-all", search_query, page],
		queryFn: async () => {
			const response = await getArticles(search_query, page);
			return response;
		},
		placeholderData: (prev) => prev,
		...options,
	});
};

export const useGetArticle = (
	id: string,
	options?: QueryObserverOptions<ArticleType>
) => {
	return useQuery<ArticleType>({
		queryKey: ["article-get", id],
		queryFn: async () => {
			const response = await getArticle(id);
			return response;
		},
		placeholderData: (prev) => prev,
		...options,
	});
};
