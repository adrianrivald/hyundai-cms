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

export type PublicHolidayType = {
	id?: number;
	holiday_name: string;
	start_date: string;
	description: string;
	end_date?: string;
};

export async function postHoliday(
	data: PublicHolidayType
): Promise<AxiosResponse<PublicHolidayType, AxiosError>> {
	return await apiConfig.post("admin/public-holidays", data);
}

export async function putHoliday(
	data: PublicHolidayType
): Promise<AxiosResponse<PublicHolidayType, AxiosError>> {
	return await apiConfig.put(`admin/public-holidays/${data.id}`, data);
}

export async function getHoliday(id: string): Promise<PublicHolidayType> {
	const response = await apiConfig.get(`admin/public-holidays/${id}`);

	return response.data.data;
}

export async function getHolidays(
	search_query?: string,
	page?: number
): Promise<{ data: PublicHolidayType[]; meta: Meta }> {
	const response = await apiConfig.get(
		`admin/public-holidays?search_query=${search_query}&page=${page}`
	);
	return response.data;
}

export async function deleteHoliday(id: string): Promise<{ message: string }> {
	return await apiConfig.delete(`admin/public-holidays/${id}`);
}

export const usePostHoliday = (
	options?: MutationObserverOptions<PublicHolidayType, Error, PublicHolidayType>
) => {
	return useMutation<PublicHolidayType, Error, PublicHolidayType>({
		mutationKey: ["article-post"],
		mutationFn: async (data: PublicHolidayType) => {
			const response = await postHoliday(data);
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

export const useDeleteHoliday = (
	options?: MutationObserverOptions<{ message: string }, Error, { id: string }>
) => {
	return useMutation<{ message: string }, Error, { id: string }>({
		mutationKey: ["holiday-post"],
		mutationFn: async ({ id }) => {
			const response = await deleteHoliday(id);
			queryClient.removeQueries({
				predicate: (query) =>
					typeof query.queryKey[0] === "string" &&
					query.queryKey[0].startsWith("holiday-"),
			});

			return response;
		},
		...options,
	});
};

export const usePutHoliday = (
	options?: MutationObserverOptions<PublicHolidayType, Error, PublicHolidayType>
) => {
	return useMutation<PublicHolidayType, Error, PublicHolidayType>({
		mutationKey: ["holiday-put"],
		mutationFn: async (data: PublicHolidayType) => {
			const response = await putHoliday(data);
			queryClient.removeQueries({
				predicate: (query) =>
					typeof query.queryKey[0] === "string" &&
					query.queryKey[0].startsWith("holiday-"),
			});

			return response.data;
		},
		...options,
	});
};

export const useGetHolidays = (
	search_query: string,
	page?: number,
	options?: QueryObserverOptions<{ data: PublicHolidayType[]; meta: Meta }>
) => {
	return useQuery<{ data: PublicHolidayType[]; meta: Meta }>({
		queryKey: ["holiday-get-all", search_query, page],
		queryFn: async () => {
			const response = await getHolidays(search_query, page);
			return response;
		},
		placeholderData: (prev) => prev,
		...options,
	});
};

export const useGetHoliday = (
	id: string,
	options?: QueryObserverOptions<PublicHolidayType>
) => {
	return useQuery<PublicHolidayType>({
		queryKey: ["holiday-get", id],
		queryFn: async () => {
			const response = await getHoliday(id);
			return response;
		},
		placeholderData: (prev) => prev,
		...options,
	});
};
