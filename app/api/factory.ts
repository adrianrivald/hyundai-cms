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

export type FactoryType = {
	id?: string;
	name: string;
	description: string;
	image_path: string;
	routes?: {
		id: number;
		name: string;
		description: string;
		image_path: string;
		factory_id: string;
	}[];
	routes_count?: number;
};

export async function postFactory(
	data: FactoryType
): Promise<AxiosResponse<FactoryType, AxiosError>> {
	return await apiConfig.post("admin/factories", data);
}

export async function putFactory(
	data: FactoryType
): Promise<AxiosResponse<FactoryType, AxiosError>> {
	return await apiConfig.put(`admin/factories/${data.id}`, data);
}

export async function getFactory(id: string): Promise<FactoryType> {
	const response = await apiConfig.get(`admin/factories/${id}`);

	return response.data;
}

export async function getFactories(
	search_query?: string
): Promise<{ data: FactoryType[]; meta: Meta }> {
	const response = await apiConfig.get(
		`admin/factories?search_query=${search_query}`
	);
	return response.data;
}

export async function deleteFactory(id: string): Promise<{ message: string }> {
	return await apiConfig.delete(`admin/factories/${id}`);
}

export const usePostFactory = (
	options?: MutationObserverOptions<FactoryType, Error, FactoryType>
) => {
	return useMutation<FactoryType, Error, FactoryType>({
		mutationKey: ["banner-post"],
		mutationFn: async (data: FactoryType) => {
			const response = await postFactory(data);
			queryClient.removeQueries({
				predicate: (query) =>
					typeof query.queryKey[0] === "string" &&
					query.queryKey[0].startsWith("factory-"),
			});

			return response.data;
		},
		...options,
	});
};

export const useDeleteFactory = (
	options?: MutationObserverOptions<{ message: string }, Error, { id: string }>
) => {
	return useMutation<{ message: string }, Error, { id: string }>({
		mutationKey: ["factory-post"],
		mutationFn: async ({ id }) => {
			const response = await deleteFactory(id);
			queryClient.removeQueries({
				predicate: (query) =>
					typeof query.queryKey[0] === "string" &&
					query.queryKey[0].startsWith("factory-"),
			});

			return response;
		},
		...options,
	});
};

export const usePutFactory = (
	options?: MutationObserverOptions<FactoryType, Error, FactoryType>
) => {
	return useMutation<FactoryType, Error, FactoryType>({
		mutationKey: ["factory-put"],
		mutationFn: async (data: FactoryType) => {
			const response = await putFactory(data);
			queryClient.removeQueries({
				predicate: (query) =>
					typeof query.queryKey[0] === "string" &&
					query.queryKey[0].startsWith("factory-"),
			});

			return response.data;
		},
		...options,
	});
};

export const useGetFactories = (
	search_query: string,
	options?: QueryObserverOptions<{
		data: any[] | FactoryType[] | any;
		meta: Meta;
	}>
) => {
	return useQuery<{ data: FactoryType[]; meta: Meta }>({
		queryKey: ["factory-get-all", search_query],
		queryFn: async () => {
			const response = await getFactories(search_query);
			return response;
		},
		placeholderData: (prev) => prev,
		...options,
	});
};

export const useGetFactory = (
	id: string,
	options?: QueryObserverOptions<FactoryType>
) => {
	return useQuery<FactoryType>({
		queryKey: ["factory-get", id],
		queryFn: async () => {
			const response = await getFactory(id);
			return response;
		},
		placeholderData: (prev) => prev,
		...options,
	});
};
