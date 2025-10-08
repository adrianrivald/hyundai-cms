import { useTableConfig } from "@/hooks/use-table-config";
import { useTableState } from "@/hooks/use-table-state";
import { dataFeedbackColumn } from "../column/feedback-column";
import { useGetFeedbackReviewList } from "@/api/feedback";
import { useTableFilter } from "@/hooks/use-table-filter";
import { convertPagination, type Meta } from "@/lib/convertPagination";
import { useEffect } from "react";

export function useListFeedback() {
	const tableState = useTableState({});

	const { PageNumber, setTableState } = useTableFilter();

	useEffect(() => {
		setTableState({
			PageSize: tableState.pagination.pageSize,
			PageNumber: tableState.pagination.pageIndex + 1,
			SearchValue: tableState.searchValue,
		});
	}, [
		tableState.sorting,
		tableState.pagination,
		tableState.searchValue,
		setTableState,
	]);

	const { data, refetch } = useGetFeedbackReviewList("", PageNumber, {
		queryKey: ["feedbacks-review-get-all", PageNumber],
		staleTime: 5 * 60 * 1000,
	});

	const table = useTableConfig({
		data: data?.data ?? [],
		columns: dataFeedbackColumn,
		tableState,
		pageCount: convertPagination(data?.meta || ({} as Meta)).totalPages,
		meta: convertPagination(data?.meta || ({} as Meta)),
	});

	return {
		table,
		data,
		refetch,
		metadata: convertPagination(data?.meta || ({} as Meta)),
	};
}
