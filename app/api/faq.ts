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

export type FAQType = {
	id?: number;
	question_en: string;
	question_id: string;
	answer_en: string;
	answer_id: string;
};

export async function postFaq(
	data: FAQType
): Promise<AxiosResponse<FAQType, AxiosError>> {
	return await apiConfig.post("admin/faqs", data);
}

export async function putFaq(
	data: FAQType
): Promise<AxiosResponse<FAQType, AxiosError>> {
	return await apiConfig.put(`admin/faqs/${data.id}`, data);
}

export async function getFaq(id: string): Promise<FAQType> {
	const response = await apiConfig.get(`admin/faqs/${id}`);

	return response.data;
}

export async function getFaqs(
	search_query?: string
): Promise<{ data: FAQType[]; meta: Meta }> {
	const response = await apiConfig.get(
		`admin/faqs?search_query=${search_query}`
	);
	return response.data;
}

export async function deleteFaq(id: string): Promise<{ message: string }> {
	return await apiConfig.delete(`admin/faqs/${id}`);
}

export const usePostFaq = (
	options?: MutationObserverOptions<FAQType, Error, FAQType>
) => {
	return useMutation<FAQType, Error, FAQType>({
		mutationKey: ["faq-post"],
		mutationFn: async (data: FAQType) => {
			const response = await postFaq(data);
			queryClient.removeQueries({
				predicate: (query) =>
					typeof query.queryKey[0] === "string" &&
					query.queryKey[0].startsWith("faq-"),
			});

			return response.data;
		},
		...options,
	});
};

export const useDeleteFaq = (
	options?: MutationObserverOptions<{ message: string }, Error, { id: string }>
) => {
	return useMutation<{ message: string }, Error, { id: string }>({
		mutationKey: ["faq-delete"],
		mutationFn: async ({ id }) => {
			const response = await deleteFaq(id);
			queryClient.removeQueries({
				predicate: (query) =>
					typeof query.queryKey[0] === "string" &&
					query.queryKey[0].startsWith("faq-"),
			});

			return response;
		},
		...options,
	});
};

export const usePutFaq = (
	options?: MutationObserverOptions<FAQType, Error, FAQType>
) => {
	return useMutation<FAQType, Error, FAQType>({
		mutationKey: ["faq-put"],
		mutationFn: async (data: FAQType) => {
			const response = await putFaq(data);
			queryClient.removeQueries({
				predicate: (query) =>
					typeof query.queryKey[0] === "string" &&
					query.queryKey[0].startsWith("faq-"),
			});

			return response.data;
		},
		...options,
	});
};

export const useGetFaqs = (
	search_query: string,
	options?: QueryObserverOptions<{
		data: any[] | FAQType[] | any;
		meta: Meta;
	}>
) => {
	return useQuery<{ data: FAQType[]; meta: Meta }>({
		queryKey: ["faq-get-all", search_query],
		queryFn: async () => {
			const response = await getFaqs(search_query);
			return response;
		},
		placeholderData: (prev) => prev,
		...options,
	});
};

export const useGetTourPackage = (
	id: string,
	options?: QueryObserverOptions<FAQType>
) => {
	return useQuery<FAQType>({
		queryKey: ["faq-get", id],
		queryFn: async () => {
			const response = await getFaq(id);
			return response;
		},
		placeholderData: (prev) => prev,
		...options,
	});
};

export const useSaveFaq = (
	options?: MutationObserverOptions<void, Error, FAQType[]>
) => {
	const postMutation = usePostFaq();
	const putMutation = usePutFaq();

	return useMutation<void, Error, FAQType[]>({
		mutationKey: ["faq-batch-save"],
		mutationFn: async (routes: FAQType[]) => {
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
