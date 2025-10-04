import apiConfig from "@/config/api";
import { queryClient } from "@/lib/queryClient";
import {
	type MutationObserverOptions,
	useMutation,
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
