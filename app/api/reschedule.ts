import apiConfig from "@/config/api";
import type { Meta } from "@/lib/convertPagination";
import { queryClient } from "@/lib/queryClient";
import {
	type MutationObserverOptions,
	useMutation,
	useQuery,
	type QueryObserverOptions,
} from "@tanstack/react-query";
import type { AxiosResponse, AxiosError } from "axios";

export interface RescheduleRequestType {
	id?: string;
	tour_date: string;
	slot: string;
	reschedule_reason: string;
}

export interface RescheduleNotificationType {
	id?: string;
	email: string;
}

export async function postRescheduleRequest(
	data: RescheduleRequestType
): Promise<AxiosResponse<RescheduleRequestType, AxiosError>> {
	return await apiConfig.post(`admin/tours/${data.id}/reschedule`, data);
}

export async function postRescheduleNotification(
	data: RescheduleNotificationType
): Promise<AxiosResponse<RescheduleNotificationType, AxiosError>> {
	return await apiConfig.post(
		`admin/tours/${data.id}/reschedule-notification`,
		data
	);
}

export const usePostRescheduleRequest = (
	options?: MutationObserverOptions<any, Error, RescheduleRequestType>
) => {
	return useMutation<any, Error, RescheduleRequestType>({
		mutationKey: ["reschedule-request"],
		mutationFn: async (data: RescheduleRequestType) => {
			const response = await postRescheduleRequest(data);
			queryClient.removeQueries({
				predicate: (query) =>
					typeof query.queryKey[0] === "string" &&
					(query.queryKey[0].startsWith("calendar-") ||
						query.queryKey[0].startsWith("tours-")),
			});

			return response.data;
		},
		...options,
	});
};

export const usePostRescheduleNotification = (
	options?: MutationObserverOptions<any, Error, RescheduleNotificationType>
) => {
	return useMutation<any, Error, RescheduleNotificationType>({
		mutationKey: ["reschedule-notification"],
		mutationFn: async (data: RescheduleNotificationType) => {
			const response = await postRescheduleNotification(data);

			return response.data;
		},
		...options,
	});
};

export type RescheduleApprovalType = {
	id: number;
	tour_number: string;
	name: string;
	purpose_of_visit: string;
	city: string;
	province: string;
	group_type: string;
	allow_marketing: number;
	tour_date: string;
	slot: string;
	old_data: {
		slot: string;
		tour_date: string;
	};
	reschedule_reason: string;
	participants_count: number;
	vehicles: {
		id: number;
		vehicle_type: string;
		vehicle_plate_number: string;
	}[];
};

export async function getRescheduleApprovalList(
	search_query?: string,
	page?: number
): Promise<{ data: RescheduleApprovalType[]; meta: Meta }> {
	const response = await apiConfig.get(
		`admin/reschedule-tours?search_query=${search_query}&page=${page}`
	);
	return response.data;
}

export async function postRescheduleApproval(
	approve: boolean,
	tour_id: string
): Promise<AxiosResponse<any, AxiosError>> {
	return await apiConfig.post(`admin/reschedule-tours/${tour_id}/review`, {
		approve,
	});
}

export const usePostRescheduleApproval = (
	options?: MutationObserverOptions<
		any,
		Error,
		{ approve: boolean; tour_id: string }
	>
) => {
	return useMutation<any, Error, { approve: boolean; tour_id: string }>({
		mutationKey: ["article-post"],
		mutationFn: async (data: { approve: boolean; tour_id: string }) => {
			const response = await postRescheduleApproval(
				data?.approve,
				data?.tour_id
			);
			queryClient.removeQueries({
				predicate: (query) =>
					typeof query.queryKey[0] === "string" &&
					query.queryKey[0].startsWith("reschedule-approval-"),
			});

			return response.data;
		},
		...options,
	});
};

export const useGetRescheduleApproval = (
	search_query: string,
	page?: number,
	options?: QueryObserverOptions<{ data: RescheduleApprovalType[]; meta: Meta }>
) => {
	return useQuery<{ data: RescheduleApprovalType[]; meta: Meta }>({
		queryKey: ["reschedule-approval-get-all", search_query, page],
		queryFn: async () => {
			const response = await getRescheduleApprovalList(search_query, page);
			return response;
		},
		placeholderData: (prev) => prev,
		...options,
	});
};
