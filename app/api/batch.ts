import apiConfig from "@/config/api";
import { queryClient } from "@/lib/queryClient";
import {
	type MutationObserverOptions,
	useMutation,
	useQuery,
	type QueryObserverOptions,
} from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export type BatchTypes = {
	batch_identifier: string;
	batch_name: string;
	batch_time: string;
	batch_timerange: string;
};

export type PublicCalendarTypes = {
	date: string;
	day: string;
	events: { id: number; holiday_name: string; description: string }[];
	slot: {
		time_range: string;
		batch_time: string;
		tour: {
			id: number;
			tour_package_id: number;
			tour_package: {
				id: number;
				tour_packages_type: string;
				name: string;
				description: "";
			};
		};
	}[];
};

export async function postBatch(
	data: string[]
): Promise<AxiosResponse<BatchTypes[], AxiosError>> {
	return await apiConfig.post("admin/slots", { slots: data });
}

export async function getBatches(): Promise<{ data: { data: BatchTypes[] } }> {
	const response = await apiConfig.get(`admin/slots`);
	return response.data;
}

export async function getCalendar(
	month_year: string
): Promise<{ data: PublicCalendarTypes[] }> {
	const response = await apiConfig.get(
		`public/calendar-date-monthly?month=${month_year}`
	);
	return response.data;
}

export const usePostBatches = (
	options?: MutationObserverOptions<BatchTypes[], Error, string[]>
) => {
	return useMutation<BatchTypes[], Error, string[]>({
		mutationKey: ["batch-post"],
		mutationFn: async (data: string[]) => {
			const response = await postBatch(data);
			queryClient.removeQueries({
				predicate: (query) =>
					typeof query.queryKey[0] === "string" &&
					query.queryKey[0].startsWith("batch-"),
			});

			return response.data;
		},
		...options,
	});
};

export const useGetBatches = (
	options?: QueryObserverOptions<{ data: { data: BatchTypes[] } }>
) => {
	return useQuery<{
		data: {
			data: BatchTypes[];
		};
	}>({
		queryKey: ["batches-get-all"],
		queryFn: async () => {
			const response = await getBatches();
			return response;
		},
		placeholderData: (prev) => prev,
		...options,
	});
};

export const useGetCalendars = (
	month_year: string,
	options?: QueryObserverOptions<{ data: PublicCalendarTypes[] }>
) => {
	return useQuery<{
		data: PublicCalendarTypes[];
	}>({
		queryKey: ["batches-get-all", month_year],
		queryFn: async () => {
			const response = await getCalendar(month_year);
			return response;
		},
		placeholderData: (prev) => prev,
		...options,
	});
};
