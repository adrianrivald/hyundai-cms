import apiConfig from "@/config/api";
import type { Meta } from "@/lib/convertPagination";
import { queryClient } from "@/lib/queryClient";
import {
	useMutation,
	type MutationObserverOptions,
	type QueryObserverOptions,
	useQuery,
} from "@tanstack/react-query";
import type { AxiosResponse, AxiosError } from "axios";

export type FeedbackTypePost = {
	id?: number;
	name: string;
	description: string;
	is_publish: string;
	questions: {
		question_id: string;
		question_en: string;
		is_mandatory: string;
		form_type: string;
		answers?: {
			answer_id?: string;
			answer_en?: string;
		}[];
	}[];
};

export type FeedbackType = {
	id?: number;
	name: string;
	uri: string;
	is_publish: number;
	published_at: string;
	questions: {
		id?: number;
		delete?: string;
		question_id: string;
		question_en: string;
		is_mandatory?: number;
		is_deletable?: number;
		form_type: string;
		answers?: {
			id?: number;
			delete?: string;
			sort: number;
			answer_id?: string;
			answer_en?: string;
		}[];
		min_range?: number;
		max_range?: number;
		sort: number;
	}[];
	created_at: string;
	updated_at: string;
};

export async function postFeedback(
	data: FeedbackTypePost
): Promise<AxiosResponse<FeedbackType, AxiosError>> {
	return await apiConfig.post("admin/forms", data);
}

export async function putFeedback(
	data: FeedbackTypePost
): Promise<AxiosResponse<FeedbackType, AxiosError>> {
	return await apiConfig.put(`admin/forms/${data.id}`, data);
}

export async function getFeedback(id: string): Promise<FeedbackType> {
	const response = await apiConfig.get(`admin/forms/${id}`);

	return response.data.data;
}

export async function getFeedbackList(
	search_query?: string,
	page?: number
): Promise<{ data: FeedbackType[]; meta: Meta }> {
	const response = await apiConfig.get(
		`admin/forms?search_query=${search_query}&page=${page}`
	);
	return response.data;
}

export async function deleteFeedback(id: string): Promise<{ message: string }> {
	return await apiConfig.delete(`admin/forms/${id}`);
}

export const usePostFeedback = (
	options?: MutationObserverOptions<FeedbackType, Error, FeedbackTypePost>
) => {
	return useMutation<FeedbackType, Error, FeedbackTypePost>({
		mutationKey: ["feedback-post"],
		mutationFn: async (data: FeedbackTypePost) => {
			const response = await postFeedback(data);
			queryClient.removeQueries({
				predicate: (query) =>
					typeof query.queryKey[0] === "string" &&
					query.queryKey[0].startsWith("feedback-"),
			});

			return response.data;
		},
		...options,
	});
};

export const useDeleteFeedback = (
	options?: MutationObserverOptions<{ message: string }, Error, { id: string }>
) => {
	return useMutation<{ message: string }, Error, { id: string }>({
		mutationKey: ["feedback-post"],
		mutationFn: async ({ id }) => {
			const response = await deleteFeedback(id);
			queryClient.removeQueries({
				predicate: (query) =>
					typeof query.queryKey[0] === "string" &&
					query.queryKey[0].startsWith("feedback-"),
			});

			return response;
		},
		...options,
	});
};

export const usePutFeedback = (
	options?: MutationObserverOptions<FeedbackType, Error, FeedbackTypePost>
) => {
	return useMutation<FeedbackType, Error, FeedbackTypePost>({
		mutationKey: ["feedback-put"],
		mutationFn: async (data: FeedbackTypePost) => {
			const response = await putFeedback(data);
			queryClient.removeQueries({
				predicate: (query) =>
					typeof query.queryKey[0] === "string" &&
					query.queryKey[0].startsWith("feedback-"),
			});

			return response.data;
		},
		...options,
	});
};

export const useGetFeedbacks = (
	search_query: string,
	page?: number,
	options?: QueryObserverOptions<{ data: FeedbackType[]; meta: Meta }>
) => {
	return useQuery<{ data: FeedbackType[]; meta: Meta }>({
		queryKey: ["feedback-get-all", search_query, page],
		queryFn: async () => {
			const response = await getFeedbackList(search_query, page);
			return response;
		},
		placeholderData: (prev) => prev,
		...options,
	});
};

export const useGetFeedback = (
	id: string,
	options?: QueryObserverOptions<FeedbackType>
) => {
	return useQuery<FeedbackType>({
		queryKey: ["feedback-get", id],
		queryFn: async () => {
			const response = await getFeedback(id);
			return response;
		},
		placeholderData: (prev) => prev,
		...options,
	});
};

export type FeedbackListTypes = {
	id: number;
	tour_name: string;
	participant_name: string;
	is_publish: number;
	created_at: string;
	updated_at: string;
};

export type FeedbackDetailTypes = {
	id: number;
	tour_name: string;
	participant_name: string;
	is_publish: number;
	image_path: string;
	image: string;
	response: {
		id: number;
		form_type: string;
		id_question: number;
		question_id: string;
		question_en: string;
		answer_id: string;
		answer_en: string;
		value: null;
		created_at: string;
		updated_at: string;
	}[];
	created_at: string;
	updated_at: string;
};

export type FeedbackPostImageTypes = {
	id: string;
	image_path: string;
	image_name: string;
	image: string;
};

export async function postPublishFeedback(
	data: FeedbackPostImageTypes
): Promise<AxiosResponse<FeedbackPostImageTypes, AxiosError>> {
	return await apiConfig.post(`admin/feedbacks/${data?.id}/publish`, data);
}

export async function getFeedbackReviewList(
	search_query?: string,
	page?: number
): Promise<{ data: FeedbackDetailTypes[]; meta: Meta }> {
	const response = await apiConfig.get(
		`admin/feedbacks?search_query=${search_query}&page=${page}`
	);
	return response.data;
}

export async function getFeedbackReviewDetail(
	id: string
): Promise<FeedbackDetailTypes> {
	const response = await apiConfig.get(`admin/feedbacks/${id}`);
	return response.data.data;
}

export async function getFeedbackReviewPublish(
	id: string
): Promise<FeedbackDetailTypes> {
	const response = await apiConfig.get(`admin/feedbacks/${id}/publish`);
	return response.data;
}

export const useGetFeedbackReviewList = (
	search_query: string,
	page?: number,
	options?: QueryObserverOptions<{ data: FeedbackListTypes[]; meta: Meta }>
) => {
	return useQuery<{ data: FeedbackListTypes[]; meta: Meta }>({
		queryKey: ["feedbacks-review-get-all", search_query, page],
		queryFn: async () => {
			const response = await getFeedbackReviewList(search_query, page);
			return response;
		},
		placeholderData: (prev) => prev,
		...options,
	});
};

export const useGetFeedbackReviewDetail = (
	id: string,
	options?: QueryObserverOptions<FeedbackDetailTypes>
) => {
	return useQuery<FeedbackDetailTypes>({
		queryKey: ["feedbacks-review-get", id],
		queryFn: async () => {
			const response = await getFeedbackReviewDetail(id);
			return response;
		},
		placeholderData: (prev) => prev,
		...options,
	});
};

export const useGetFeedbackReviewPublish = (
	id: string,
	options?: QueryObserverOptions<FeedbackDetailTypes>
) => {
	return useQuery<FeedbackDetailTypes>({
		queryKey: ["feedbacks-review-publish", id],
		queryFn: async () => {
			const response = await getFeedbackReviewPublish(id);
			queryClient.removeQueries({
				predicate: (query) =>
					typeof query.queryKey[0] === "string" &&
					query.queryKey[0].startsWith("feedbacks-"),
			});
			return response;
		},
		placeholderData: (prev) => prev,
		...options,
	});
};

export const usePostImageFeedbackPublish = (
	options?: MutationObserverOptions<
		FeedbackPostImageTypes,
		Error,
		FeedbackPostImageTypes
	>
) => {
	return useMutation<FeedbackPostImageTypes, Error, FeedbackPostImageTypes>({
		mutationKey: ["feedbacks-post-publish"],
		mutationFn: async (data: FeedbackPostImageTypes) => {
			const response = await postPublishFeedback(data);
			queryClient.removeQueries({
				predicate: (query) =>
					typeof query.queryKey[0] === "string" &&
					query.queryKey[0].startsWith("feedbacks-"),
			});

			return response.data;
		},
		...options,
	});
};

export type FeedbackDashboardType = {
	rating_average: number;
	rating_count: {
		"5": number;
		"4": number;
		"3": number;
		"2": number;
		"1": number;
	};
	feedbacks: {
		id: number;
		tour_id: number;
		participant_id: number;
		is_publish: number;
		created_at: string;
		updated_at: string;
		deleted_at: string;
		tour: {
			id: number;
			name: string;
			purpose_of_visit: "industrial-visit";
			city: string;
			province: string;
			allow_marketing: number;
			tour_date: string;
			slot: string;
		};
		participant: {
			id: number;
			tour_id: number;
			name: string;
			dob: string;
			sex: string;
			email: string;
			phone_number: string;
			is_leader: boolean;
			is_special_need: boolean;
			is_participant: boolean;
			verification_code: string;
			verified_at: string;
			attended_at: string;
			created_at: string;
			updated_at: string;
			deleted_at: string;
		};
		responses: {
			id: number;
			tour_feedback_id: number;
			feedback_form_id: number;
			feedback_form_question_id: number;
			form_type: string;
			feedback_form_answer_id: string;
			value: string;
			deleted_at: string;
			created_at: string;
			updated_at: string;
		}[];
	}[];
};

export async function getFeedbackDashboard(
	start_date: string = "",
	end_date: string = ""
): Promise<{ data: FeedbackDashboardType }> {
	const body: Record<string, any> = {
		start_date,
		end_date,
	};

	Object.keys(body).forEach((key) => {
		if (body[key] === "" || body[key] === undefined || body[key] === null) {
			delete body[key];
		}
	});
	const response = await apiConfig.post(`admin/report/activity/feedback`, body);
	return response.data;
}

export const useGetFeedbackDashboard = (
	start_date: string,
	end_date: string,
	options?: QueryObserverOptions<{ data: FeedbackDashboardType }>
) => {
	return useQuery<{ data: FeedbackDashboardType }>({
		queryKey: ["feedback-dashboard-get-all", start_date, end_date],
		queryFn: async () => {
			const response = await getFeedbackDashboard(start_date, end_date);
			return response;
		},
		placeholderData: (prev) => prev,
		...options,
	});
};
