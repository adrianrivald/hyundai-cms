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

export async function postBanner(
	data: BannerType
): Promise<AxiosResponse<BannerType, AxiosError>> {
	return await apiConfig.post("admin/banners", data);
}

export async function putBanner(
	data: BannerType
): Promise<AxiosResponse<BannerType, AxiosError>> {
	return await apiConfig.put(`admin/banners/${data.id}`, data);
}

export async function getBanner(id: string): Promise<BannerType> {
	const response = await apiConfig.get(`admin/banners/${id}`);

	return response.data;
}

export async function getBanners(
	search_query?: string
): Promise<{ data: BannerType[]; meta: Meta }> {
	const response = await apiConfig.get(
		`admin/banners?search_query=${search_query}`
	);
	return response.data;
}

export async function deleteBanner(id: string): Promise<{ message: string }> {
	return await apiConfig.delete(`admin/banners/${id}`);
}

export const usePostBanner = (
	options?: MutationObserverOptions<BannerType, Error, BannerType>
) => {
	return useMutation<BannerType, Error, BannerType>({
		mutationKey: ["banner-post"],
		mutationFn: async (data: BannerType) => {
			const response = await postBanner(data);
			queryClient.removeQueries({
				predicate: (query) =>
					typeof query.queryKey[0] === "string" &&
					query.queryKey[0].startsWith("banner-"),
			});

			return response.data;
		},
		...options,
	});
};

export const usePutBanner = (
	options?: MutationObserverOptions<BannerType, Error, BannerType>
) => {
	return useMutation<BannerType, Error, BannerType>({
		mutationKey: ["banner-put"],
		mutationFn: async (data: BannerType) => {
			const response = await putBanner(data);
			queryClient.removeQueries({
				predicate: (query) =>
					typeof query.queryKey[0] === "string" &&
					query.queryKey[0].startsWith("banner-"),
			});

			return response.data;
		},
		...options,
	});
};

export const useGetBanners = (
	search_query: string,
	options?: QueryObserverOptions<{ data: BannerType[]; meta: Meta }>
) => {
	return useQuery<{ data: BannerType[]; meta: Meta }>({
		queryKey: ["banners-get", search_query],
		queryFn: async () => {
			const response = await getBanners(search_query);
			return response;
		},
		placeholderData: (prev) => prev,
		...options,
	});
};

export const useGetBanner = (
	id: string,
	options?: QueryObserverOptions<BannerType>
) => {
	return useQuery<BannerType>({
		queryKey: ["banner-get", id],
		queryFn: async () => {
			const response = await getBanner(id);
			return response;
		},
		placeholderData: (prev) => prev,
		...options,
	});
};
