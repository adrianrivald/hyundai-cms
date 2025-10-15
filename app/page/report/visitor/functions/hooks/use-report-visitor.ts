import {
	getReportVisitorList,
	useGetReportVisitor,
	type VisitorType,
} from "@/api/report";
import { useTableConfig } from "@/hooks/use-table-config";
import { useTableFilter } from "@/hooks/use-table-filter";
import { useTableState } from "@/hooks/use-table-state";
import { convertPagination, type Meta } from "@/lib/convertPagination";
import { useEffect } from "react";
import { dataReportVisitor } from "../columns/report-visitor-column";

export function useReportVisitorList(
	start_date?: string,
	end_date?: string,
	search?: string
) {
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

	const { data: detail, refetch: fetchVisitor } = useGetReportVisitor(
		start_date || "",
		end_date || "",
		search || "",
		PageNumber
	);

	const meta: Meta = {
		current_page: detail?.data?.current_page || 0,
		from: detail?.data?.from || 0,
		last_page: detail?.data?.last_page || 0,
		links: detail?.data?.links || [],
		path: detail?.data?.path || "",
		per_page: detail?.data?.per_page || 0,
		to: detail?.data?.to || 0,
		total: detail?.data?.total || 0,
	};

	const table = useTableConfig({
		//@ts-ignore
		data: (detail?.data?.data || ([] as VisitorType[])) ?? [],
		columns: dataReportVisitor,
		tableState,
		pageCount: convertPagination(meta || ({} as Meta)).totalPages,
		meta: convertPagination(meta || ({} as Meta)),
	});

	return {
		table,
		detail,
		fetchVisitor,
		metadata: convertPagination(meta || ({} as Meta)),
	};
}
