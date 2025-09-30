import { useTodosList } from "@/api/todos";
import { useTableConfig } from "@/hooks/use-table-config";
import { useTableState } from "@/hooks/use-table-state";
import type { AlbumTypes } from "@/types/PostTypes";

import { convertPagination, type Meta } from "@/lib/convertPagination";

import { useTableFilter } from "@/hooks/use-table-filter";
import { useEffect } from "react";
import { dataTopMenuList } from "../columns/top-menu-column";
import { useGetTopMenus } from "@/api/top-menu";

export function useListTopMenu() {
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

	const { data, refetch } = useGetTopMenus("", {
		queryKey: ["top-menu-get-all", PageNumber],
		staleTime: 5 * 60 * 1000,
	});

	const table = useTableConfig({
		data: data?.data ?? [],
		columns: dataTopMenuList,
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
