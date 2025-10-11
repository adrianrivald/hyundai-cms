import apiConfig from "@/config/api";
import { queryClient } from "@/lib/queryClient";
import {
	useMutation,
	type MutationObserverOptions,
} from "@tanstack/react-query";

export type DashboardTourType = {
	registration_by_date: {
		date: string;
		count: {
			vip: number;
			"general-course": number;
			"student-course": number;
		};
	}[];
	tour_by_city: Record<string, number>;
	tour_by_package_type: {
		vip: number;
		"general-course": number;
		"student-course": number;
	};
	gender: {
		male: number;
		female: number;
	};
};

export async function postDashboardTour(
	start_date: string,
	end_date: string
): Promise<{ data: DashboardTourType }> {
	const response = await apiConfig.post(`admin/report/activity/tour`, {
		start_date,
		end_date,
	});
	return response.data;
}

export const usePostDashboardTour = (
	options?: MutationObserverOptions<
		{ data: DashboardTourType },
		Error,
		{ start_date: string; end_date: string }
	>
) => {
	return useMutation<
		{ data: DashboardTourType },
		Error,
		{ start_date: string; end_date: string }
	>({
		mutationKey: ["factory-post"],
		mutationFn: async (data: { start_date: string; end_date: string }) => {
			const response = await postDashboardTour(
				data?.start_date,
				data?.end_date
			);

			return response;
		},
		...options,
	});
};
