import apiConfig from "@/config/api";
import type { Meta } from "@/lib/convertPagination";
import { queryClient } from "@/lib/queryClient";
import {
	useMutation,
	type MutationObserverOptions,
	useQuery,
	type QueryObserverOptions,
} from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export type TourPackageType = {
	id?: string;
	name: string;
	description: string;
	image_path: string;
	minimum_participant: number;
	maximum_participant: number;
	factories: {
		id: number;
		name: string;
		description: string;
		image_path: string;
	}[];
	routes: {
		id: number;
		name: string;
		description: string;
		image_path: string;
		factory_id: number;
	}[];
};

export type TourPackagePostType = {
	id?: string;
	name: string;
	description: string;
	image_path?: string;
	minimum_participant: number;
	maximum_participant: number;
	factories: number[];
	routes: number[];
};

export async function postTourPackage(
	data: TourPackagePostType
): Promise<AxiosResponse<TourPackageType, AxiosError>> {
	return await apiConfig.post("admin/tour-packages", data);
}

export async function putTourPackage(
	data: TourPackagePostType
): Promise<AxiosResponse<TourPackageType, AxiosError>> {
	return await apiConfig.put(`admin/tour-packages/${data.id}`, data);
}

export async function getTourPackage(id: string): Promise<TourPackageType> {
	const response = await apiConfig.get(`admin/tour-packages/${id}`);

	return response.data;
}

export async function getTourPackages(
	search_query?: string
): Promise<{ data: TourPackageType[]; meta: Meta }> {
	const response = await apiConfig.get(
		`admin/tour-packages?search_query=${search_query}`
	);
	return response.data;
}

export async function deleteTourPackage(
	id: string
): Promise<{ message: string }> {
	return await apiConfig.delete(`admin/tour-packages/${id}`);
}

export const usePostTourPackage = (
	options?: MutationObserverOptions<TourPackageType, Error, TourPackagePostType>
) => {
	return useMutation<TourPackageType, Error, TourPackagePostType>({
		mutationKey: ["package-factory-post"],
		mutationFn: async (data: TourPackagePostType) => {
			const response = await postTourPackage(data);
			queryClient.removeQueries({
				predicate: (query) =>
					typeof query.queryKey[0] === "string" &&
					query.queryKey[0].startsWith("package-factory-"),
			});

			return response.data;
		},
		...options,
	});
};

export const useDeleteTourPackage = (
	options?: MutationObserverOptions<{ message: string }, Error, { id: string }>
) => {
	return useMutation<{ message: string }, Error, { id: string }>({
		mutationKey: ["package-factory-delete"],
		mutationFn: async ({ id }) => {
			const response = await deleteTourPackage(id);
			queryClient.removeQueries({
				predicate: (query) =>
					typeof query.queryKey[0] === "string" &&
					query.queryKey[0].startsWith("package-factory-"),
			});

			return response;
		},
		...options,
	});
};

export const usePutTourPackage = (
	options?: MutationObserverOptions<TourPackageType, Error, TourPackagePostType>
) => {
	return useMutation<TourPackageType, Error, TourPackagePostType>({
		mutationKey: ["package-factory-put"],
		mutationFn: async (data: TourPackagePostType) => {
			const response = await putTourPackage(data);
			queryClient.removeQueries({
				predicate: (query) =>
					typeof query.queryKey[0] === "string" &&
					query.queryKey[0].startsWith("package-factory-"),
			});

			return response.data;
		},
		...options,
	});
};

export const useGetTourPackages = (
	search_query: string,
	options?: QueryObserverOptions<{
		data: any[] | TourPackageType[] | any;
		meta: Meta;
	}>
) => {
	return useQuery<{ data: TourPackageType[]; meta: Meta }>({
		queryKey: ["package-factory-get-all", search_query],
		queryFn: async () => {
			const response = await getTourPackages(search_query);
			return response;
		},
		placeholderData: (prev) => prev,
		...options,
	});
};

export const useGetTourPackage = (
	id: string,
	options?: QueryObserverOptions<TourPackageType>
) => {
	return useQuery<TourPackageType>({
		queryKey: ["package-factory-get", id],
		queryFn: async () => {
			const response = await getTourPackage(id);
			return response;
		},
		placeholderData: (prev) => prev,
		...options,
	});
};
