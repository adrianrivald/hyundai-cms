import apiConfig from "@/config/api";
import type { Meta } from "@/lib/convertPagination";
import { queryClient } from "@/lib/queryClient";
import type { GlobalVariableTypes } from "@/types/GlobalVariableTypes";
import {
	type MutationObserverOptions,
	useMutation,
	useQuery,
	type QueryObserverOptions,
} from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export async function getPublicGlobalVariable(
	global_variable_name: string
): Promise<{
	data: GlobalVariableTypes[];
	meta: Meta;
}> {
	const response = await apiConfig.get(
		`public/global-variables/${global_variable_name}`
	);

	return response.data;
}

export async function postGlobalVariable(
	data: GlobalVariableTypes
): Promise<AxiosResponse<GlobalVariableTypes, AxiosError>> {
	return await apiConfig.post("admin/global-variables", data);
}

export async function putGlobalVariable(
	data: GlobalVariableTypes
): Promise<AxiosResponse<GlobalVariableTypes, AxiosError>> {
	return await apiConfig.put(`admin/global-variables/${data?.id}`, data);
}

export async function getGlobalVariable(
	global_variable_id: string
): Promise<GlobalVariableTypes> {
	const response = await apiConfig.get(
		`admin/global-variables/${global_variable_id}`
	);

	return response.data;
}

export async function getGlobalVariables(): Promise<{
	data: GlobalVariableTypes[];
	meta: Meta;
}> {
	const response = await apiConfig.get(`admin/global-variables`);
	return response.data;
}

export async function deleteGlobalVariable(
	global_variable_id: string
): Promise<{ message: string }> {
	return await apiConfig.delete(`admin/global-variables/${global_variable_id}`);
}

export const usePostGlobalVariable = (
	options?: MutationObserverOptions<
		GlobalVariableTypes,
		Error,
		GlobalVariableTypes
	>
) => {
	return useMutation<GlobalVariableTypes, Error, GlobalVariableTypes>({
		mutationKey: ["global-variable-post"],
		mutationFn: async (data: GlobalVariableTypes) => {
			const response = await postGlobalVariable(data);
			queryClient.removeQueries({
				predicate: (query) =>
					typeof query.queryKey[0] === "string" &&
					query.queryKey[0].startsWith("global-variable-"),
			});

			return response.data;
		},
		...options,
	});
};

export const useDeleteGlobalVariable = (
	options?: MutationObserverOptions<{ message: string }, Error, { id: string }>
) => {
	return useMutation<{ message: string }, Error, { id: string }>({
		mutationKey: ["global-variable-delete"],
		mutationFn: async ({ id }) => {
			const response = await deleteGlobalVariable(id);
			queryClient.removeQueries({
				predicate: (query) =>
					typeof query.queryKey[0] === "string" &&
					query.queryKey[0].startsWith("global-variable-"),
			});

			return response;
		},
		...options,
	});
};

export const usePutGlobalVariable = (
	options?: MutationObserverOptions<
		GlobalVariableTypes,
		Error,
		GlobalVariableTypes
	>
) => {
	return useMutation<GlobalVariableTypes, Error, GlobalVariableTypes>({
		mutationKey: ["global-variable-put"],
		mutationFn: async (data: GlobalVariableTypes) => {
			const response = await putGlobalVariable(data);
			queryClient.removeQueries({
				predicate: (query) =>
					typeof query.queryKey[0] === "string" &&
					query.queryKey[0].startsWith("global-variable-"),
			});

			return response.data;
		},
		...options,
	});
};

export const useGetGlobalVariables = (
	options?: QueryObserverOptions<{ data: GlobalVariableTypes[]; meta: Meta }>
) => {
	return useQuery<{ data: GlobalVariableTypes[]; meta: Meta }>({
		queryKey: ["global-variable-get"],
		queryFn: async () => {
			const response = await getGlobalVariables();
			return response;
		},
		placeholderData: (prev) => prev,
		...options,
	});
};

export const useGetGlobalVariable = (
	id: string,
	options?: QueryObserverOptions<GlobalVariableTypes>
) => {
	return useQuery<GlobalVariableTypes>({
		queryKey: ["global-variable-get", id],
		queryFn: async () => {
			const response = await getGlobalVariable(id);
			return response;
		},
		placeholderData: (prev) => prev,
		...options,
	});
};

export const useGetPublicGlobalVariables = (
	id: string,
	options?: QueryObserverOptions<{ data: GlobalVariableTypes[]; meta: Meta }>
) => {
	return useQuery<{ data: GlobalVariableTypes[]; meta: Meta }>({
		queryKey: ["public-global-variable-get", id],
		queryFn: async () => {
			const response = await getPublicGlobalVariable(id);
			return response;
		},
		placeholderData: (prev) => prev,
		...options,
	});
};
