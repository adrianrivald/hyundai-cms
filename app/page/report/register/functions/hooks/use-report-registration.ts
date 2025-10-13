import {
	getReportVisitorList,
	useGetReportVisitor,
	type RegistrationType,
	type VisitorType,
	useGetReportRegistration,
} from "@/api/report";
import { useTableConfig } from "@/hooks/use-table-config";
import { useTableFilter } from "@/hooks/use-table-filter";
import { useTableState } from "@/hooks/use-table-state";
import { convertPagination, type Meta } from "@/lib/convertPagination";
import { useEffect } from "react";
import { dataReportRegistration } from "../columns/report-registration-column";

export function useReportRegistrationList(
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

	const { data: detail, refetch: fetchVisitor } = useGetReportRegistration(
		start_date || "",
		end_date || "",
		search || "",
		PageNumber
	);

	const table = useTableConfig({
		data: (detail?.data || ([] as RegistrationType[])) ?? [],
		columns: dataReportRegistration,
		tableState,
		pageCount: convertPagination(detail?.meta || ({} as Meta)).totalPages,
		meta: convertPagination(detail?.meta || ({} as Meta)),
	});

	return {
		table,
		detail,
		fetchVisitor,
		metadata: convertPagination(detail?.meta || ({} as Meta)),
	};
}
