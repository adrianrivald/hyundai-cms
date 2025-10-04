import { useTableConfig } from "@/hooks/use-table-config";
import { useTableState } from "@/hooks/use-table-state";

import { dataFeedbackColumn } from "../columns/feedback-column";
import { useGetFeedbacks } from "@/api/feedback";

export function useListFeedback() {
	const tableState = useTableState({});

	const { data, refetch } = useGetFeedbacks("", 1, {
		queryKey: ["feedback-get-all"],
		staleTime: 5 * 60 * 1000,
	});

	const table = useTableConfig({
		data: data?.data || [],
		columns: dataFeedbackColumn as any,
		tableState,
	});

	return {
		table,
		data,
		refetch,
	};
}
