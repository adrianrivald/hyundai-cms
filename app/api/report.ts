import apiConfig from "@/config/api";
import {
	type QueryObserverOptions,
	useQuery,
	type MutationObserverOptions,
	useMutation,
} from "@tanstack/react-query";

export type ReportVisitorType = {
	current_page: number;
	from: number;
	last_page: number;
	links: {
		url: string | null;
		label: string;
		active: boolean;
	}[];
	path: string;
	per_page: number;
	to: number;
	total: number;
	data: VisitorType;
};

export type VisitorType = {
	id: number;
	tour_id: number;
	name: string;
	dob: string;
	sex: string;
	email: string;
	phone_number: string;
	is_leader: boolean;
	is_special_need: false;
	verification_code: boolean;
	verified_at: string;
	attended_at: string;
	created_at: string;
	updated_at: string;
	deleted_at: string;
	age: number;
	tour: {
		id: number;
		tour_package_id: number;
		group_type: null;
		tour_number: string;
		name: string;
		purpose_of_visit: string;
		city: string;
		allow_marketing: number;
		tour_date: string;
		slot: string;
		is_approved: number;
		reschedule_reason: string;
		old_data: null;
		created_at: string;
		updated_at: string;
		deleted_at: null;
		tour_package: {
			id: number;
			tour_packages_type: string;
			name: string;
			description: string;
			image_path: string;
			minimum_participant: number;
			maximum_participant: number;
			created_at: string;
			updated_at: string;
			deleted_at: null;
		};
	};
};

export type ColumnVisitorType = {
	value: string;
	label: string;
};

// export async function postPublishFeedback(
// 	data: FeedbackPostImageTypes
// ): Promise<AxiosResponse<FeedbackPostImageTypes, AxiosError>> {
// 	return await apiConfig.post(`admin/feedbacks/${data?.id}/publish`, data);
// }

export async function getColumnsVisitor(): Promise<{
	data: ColumnVisitorType[];
}> {
	const response = await apiConfig.get(`admin/report/visitor/columns`);

	return response.data;
}

export async function getColumnsRegistration(): Promise<{
	data: ColumnVisitorType[];
}> {
	const response = await apiConfig.get(`admin/report/register/columns`);

	return response.data;
}

export async function postReportRegistrationExport(
	start_date: string,
	end_date: string,
	columns: string[]
): Promise<{ data: any }> {
	const body: Record<string, any> = {
		start_date,
		end_date,
		columns,
	};

	Object.keys(body).forEach((key) => {
		if (body[key] === "" || body[key] === undefined || body[key] === null) {
			delete body[key];
		}
	});

	const response = await apiConfig.post(`admin/report/register/export`, body);

	return response.data;
}

export async function getReportVisitorList(
	start_date: string,
	end_date: string,
	search: string,
	paginate: boolean = true,
	page: number = 1
): Promise<{ data: ReportVisitorType }> {
	const body: Record<string, any> = {
		start_date,
		end_date,
		search,
		paginate,
	};

	Object.keys(body).forEach((key) => {
		if (body[key] === "" || body[key] === undefined || body[key] === null) {
			delete body[key];
		}
	});

	const response = await apiConfig.post(
		`admin/report/visitor?page=${page}`,
		body
	);

	return response.data;
}

export const useGetReportVisitor = (
	start_date: string,
	end_date: string,
	search: string,
	page: number = 1,
	options?: QueryObserverOptions<{ data: ReportVisitorType }>
) => {
	return useQuery<{ data: ReportVisitorType }>({
		queryKey: [
			"report-visitor-all",
			search,
			page,
			start_date,
			end_date,
			search,
		],
		queryFn: async () => {
			const response = await getReportVisitorList(
				start_date,
				end_date,
				search,
				true,
				page
			);
			return response;
		},
		placeholderData: (prev) => prev,
		...options,
	});
};

export const useGetColumnVisitor = (
	options?: QueryObserverOptions<{ data: ColumnVisitorType[] }>
) => {
	return useQuery<{ data: ColumnVisitorType[] }>({
		queryKey: ["column-visitor-all"],
		queryFn: async () => {
			const response = await getColumnsVisitor();
			return response;
		},
		placeholderData: (prev) => prev,
		...options,
	});
};

export const useGetColumnRegistration = (
	options?: QueryObserverOptions<{ data: ColumnVisitorType[] }>
) => {
	return useQuery<{ data: ColumnVisitorType[] }>({
		queryKey: ["column-registration-all"],
		queryFn: async () => {
			const response = await getColumnsRegistration();
			return response;
		},
		placeholderData: (prev) => prev,
		...options,
	});
};

export const usePostExportRegistration = (
	options?: MutationObserverOptions<any, Error, any>
) => {
	return useMutation<any, Error, any>({
		mutationKey: ["export-registration"],
		mutationFn: async ({ start_date, end_date, columns }) => {
			const response = await postReportRegistrationExport(
				start_date,
				end_date,
				columns
			);

			console.log("dataa 12", response.data);

			return response.data;
		},
		...options,
	});
};
