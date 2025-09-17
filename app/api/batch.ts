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

export async function postBatch(
	data: string[]
): Promise<AxiosResponse<BatchTypes[], AxiosError>> {
	return await apiConfig.post("admin/slots", { slots: data });
}

export async function getBatches(): Promise<{ data: { data: BatchTypes[] } }> {
	const response = await apiConfig.get(`admin/slots`);
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
