import apiConfig from "@/config/api";
import { queryClient } from "@/lib/queryClient";
import type { BannerType } from "@/page/content-editor/homepage/_functions/models/banner";
import {
	type QueryObserverOptions,
	useQuery,
	useMutation,
	type MutationObserverOptions,
} from "@tanstack/react-query";
import type { AxiosResponse, AxiosError } from "axios";

export type TourDetailsType = {
	id: number;
	tour_number: string;
	name: string;
	purpose_of_visit: string;
	city: string;
	province: string;
	tour_date: string;
	slot: string;
	reschedule_reason: string;
	vehicles: {
		vehicle_type: string;
		vehicle_plate_number: string;
		id: number;
	}[];
	participants_count: number;
	participants_verified_count: number;
	participants_attended_count: number;
	tour_package: {
		id: number;
		tour_packages_type: string;
		name: string;
		description: string;
		image_path: string;
		minimum_participant: number;
		maximum_participant: number;
	};
	leader: {
		id: number;
		name: string;
		email: string;
		phone_number: string;
		verified_at: null;
		sex: string;
		dob: string;
		is_leader: boolean;
		is_special_need: boolean;
	};
	participants: ParticipantsType[];
};

export type ParticipantsType = {
	id: number;
	name: string;
	sex: string;
	dob: string;
	email: string;
	phone_number: string;
	is_leader: boolean;
	is_special_need: boolean;
	verified_at: string;
	attended_at: string;
};

export type ParticipantInputType = {
	id?: string;
	name: string;
	dob: string;
	sex: string;
	email: string;
	phone_number: string;
	is_special_need: boolean;
};

export async function getTourDetails(id: string): Promise<TourDetailsType> {
	const response = await apiConfig.get(`admin/tours/${id}`);

	return response.data.data;
}

export async function getProvinces(): Promise<{ data: string[] }> {
	const response = await apiConfig.get(`public/provinces`);

	return response.data;
}

export async function postParticipantTourGroup(
	tour_number: string,
	data: ParticipantInputType
): Promise<AxiosResponse<ParticipantInputType, AxiosError>> {
	return await apiConfig.post(`admin/participants/${tour_number}`, data);
}

export async function putParticipantTourGroup(
	data: ParticipantInputType
): Promise<AxiosResponse<ParticipantInputType, AxiosError>> {
	return await apiConfig.put(`admin/participants/${data.id}`, data);
}

export async function deleteParticipantTourGroup(
	id: string
): Promise<{ message: string }> {
	return await apiConfig.delete(`admin/participants/${id}`);
}

export const useGetTourDetails = (
	id: string,
	options?: QueryObserverOptions<TourDetailsType>
) => {
	return useQuery<TourDetailsType>({
		queryKey: ["tours-details", id],
		queryFn: async () => {
			const response = await getTourDetails(id);
			return response;
		},
		placeholderData: (prev) => prev,
		...options,
	});
};

export const useGetProvinces = (
	options?: QueryObserverOptions<{ data: string[] }>
) => {
	return useQuery<{ data: string[] }>({
		queryKey: ["provinces-all"],
		queryFn: async () => {
			const response = await getProvinces();
			return response;
		},
		placeholderData: (prev) => prev,
		...options,
	});
};

export const usePostParticipantTourGroup = (
	id: string,
	options?: MutationObserverOptions<
		ParticipantInputType,
		Error,
		ParticipantInputType
	>
) => {
	return useMutation<ParticipantInputType, Error, ParticipantInputType>({
		mutationKey: ["tour-participant-post"],
		mutationFn: async (data: ParticipantInputType) => {
			const response = await postParticipantTourGroup(id, data);
			queryClient.removeQueries({
				predicate: (query) =>
					typeof query.queryKey[0] === "string" &&
					query.queryKey[0].startsWith("tours-details"),
			});

			return response.data;
		},
		...options,
	});
};

export const useDeleteParticipantTourGroup = (
	options?: MutationObserverOptions<{ message: string }, Error, { id: string }>
) => {
	return useMutation<{ message: string }, Error, { id: string }>({
		mutationKey: ["tour-participant-delete"],
		mutationFn: async ({ id }) => {
			const response = await deleteParticipantTourGroup(id);
			queryClient.removeQueries({
				predicate: (query) =>
					typeof query.queryKey[0] === "string" &&
					query.queryKey[0].startsWith("tours-details"),
			});

			return response;
		},
		...options,
	});
};

export const usePutParticipantTourGroup = (
	options?: MutationObserverOptions<
		ParticipantInputType,
		Error,
		ParticipantInputType
	>
) => {
	return useMutation<ParticipantInputType, Error, ParticipantInputType>({
		mutationKey: ["tour-participant-put"],
		mutationFn: async (data: ParticipantInputType) => {
			const response = await putParticipantTourGroup(data);
			queryClient.removeQueries({
				predicate: (query) =>
					typeof query.queryKey[0] === "string" &&
					query.queryKey[0].startsWith("tours-details"),
			});

			return response.data;
		},
		...options,
	});
};
