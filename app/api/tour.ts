import apiConfig from "@/config/api";
import { type QueryObserverOptions, useQuery } from "@tanstack/react-query";

export type TourDetailsType = {
	id: number;
	tour_number: string;
	name: string;
	purpose_of_visit: string;
	city: string;
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

export async function getTourDetails(id: string): Promise<TourDetailsType> {
	const response = await apiConfig.get(`admin/tours/${id}`);

	return response.data.data;
}

export async function getProvinces(): Promise<{ data: string[] }> {
	const response = await apiConfig.get(`public/provinces`);

	return response.data;
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
