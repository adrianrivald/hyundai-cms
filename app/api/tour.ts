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
	vehicle_type: string;
	vehicle_plate_number: string;
	participants_count: string;
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
	};
};

export async function getTourDetails(id: string): Promise<TourDetailsType> {
	const response = await apiConfig.get(`admin/tours/${id}`);

	return response.data.data;
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
