export type FactoryRouteType = {
	id?: string;
	name: string;
	name_en: string;
	description: string;
	description_en: string;
	image_path: string;
	factory_id?: string;
};

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

export async function postFactoryRoute(
	data: FactoryRouteType
): Promise<AxiosResponse<FactoryRouteType, AxiosError>> {
	return await apiConfig.post("admin/factory-routes", data);
}

export async function putFactoryRoute(
	data: FactoryRouteType
): Promise<AxiosResponse<FactoryRouteType, AxiosError>> {
	return await apiConfig.put(`admin/factory-routes/${data.id}`, data);
}

export async function getFactoryRoute(id: string): Promise<FactoryRouteType> {
	const response = await apiConfig.get(`admin/factory-routes/${id}`);

	return response.data;
}

export async function getFactoryRoutes(
	factory_id?: string
): Promise<{ data: FactoryRouteType[]; meta: Meta }> {
	const response = await apiConfig.get(
		`admin/factory-routes?factory_id=${factory_id}`
	);
	return response.data;
}

export async function deleteFactoryRoute(
	id: string
): Promise<{ message: string }> {
	return await apiConfig.delete(`admin/factory-routes/${id}`);
}

export const usePostFactoryRoute = (
	options?: MutationObserverOptions<FactoryRouteType, Error, FactoryRouteType>
) => {
	return useMutation<FactoryRouteType, Error, FactoryRouteType>({
		mutationKey: ["factory-route-post"],
		mutationFn: async (data: FactoryRouteType) => {
			const response = await postFactoryRoute(data);
			queryClient.removeQueries({
				predicate: (query) =>
					typeof query.queryKey[0] === "string" &&
					query.queryKey[0].startsWith("factory-route-"),
			});

			return response.data;
		},
		...options,
	});
};

export const useDeleteFactoryRoute = (
	options?: MutationObserverOptions<{ message: string }, Error, { id: string }>
) => {
	return useMutation<{ message: string }, Error, { id: string }>({
		mutationKey: ["factory-route-delete"],
		mutationFn: async ({ id }) => {
			const response = await deleteFactoryRoute(id);
			queryClient.removeQueries({
				predicate: (query) =>
					typeof query.queryKey[0] === "string" &&
					query.queryKey[0].startsWith("factory-route-"),
			});

			return response;
		},
		...options,
	});
};

export const usePutFactoryRoute = (
	options?: MutationObserverOptions<FactoryRouteType, Error, FactoryRouteType>
) => {
	return useMutation<FactoryRouteType, Error, FactoryRouteType>({
		mutationKey: ["factory-route-put"],
		mutationFn: async (data: FactoryRouteType) => {
			const response = await putFactoryRoute(data);
			queryClient.removeQueries({
				predicate: (query) =>
					typeof query.queryKey[0] === "string" &&
					query.queryKey[0].startsWith("factory-route-"),
			});

			return response.data;
		},
		...options,
	});
};

export const useGetFactoryRoutes = (
	factory_id: string,
	options?: QueryObserverOptions<{ data: FactoryRouteType[]; meta: Meta }>
) => {
	return useQuery<{ data: FactoryRouteType[]; meta: Meta }>({
		queryKey: ["factory-route-get-all", factory_id],
		queryFn: async () => {
			const response = await getFactoryRoutes(factory_id);
			return response;
		},
		placeholderData: (prev) => prev,
		...options,
	});
};

export const useGetFactoryRoute = (
	id: string,
	options?: QueryObserverOptions<FactoryRouteType>
) => {
	return useQuery<FactoryRouteType>({
		queryKey: ["factory-get", id],
		queryFn: async () => {
			const response = await getFactoryRoute(id);
			return response;
		},
		placeholderData: (prev) => prev,
		...options,
	});
};

export const useSaveFactoryRoutes = (
	options?: MutationObserverOptions<void, Error, FactoryRouteType[]>
) => {
	const postMutation = usePostFactoryRoute();
	const putMutation = usePutFactoryRoute();

	return useMutation<void, Error, FactoryRouteType[]>({
		mutationKey: ["factory-routes-batch"],
		mutationFn: async (routes: FactoryRouteType[]) => {
			for (const route of routes) {
				if (!route.id) {
					await postMutation.mutateAsync(route);
				} else {
					await putMutation.mutateAsync(route);
				}
			}
		},
		...options,
	});
};
