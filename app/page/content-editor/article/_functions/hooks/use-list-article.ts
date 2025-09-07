import { useTodosList } from "@/api/todos";
import { useTableConfig } from "@/hooks/use-table-config";
import { useTableState } from "@/hooks/use-table-state";
import type { AlbumTypes } from "@/types/PostTypes";
import { dataArticleList } from "../columns/article-column";
import { convertPagination, type Meta } from "@/lib/convertPagination";
import { useGetArticles } from "@/api/article";
import { useTableFilter } from "@/hooks/use-table-filter";
import { useEffect } from "react";

export function useListArticle() {
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

	const { data, refetch } = useGetArticles("", PageNumber, {
		queryKey: ["article-get-all", PageNumber],
		staleTime: 5 * 60 * 1000,
	});

	console.log("dataa", PageNumber);

	const table = useTableConfig({
		data: data?.data ?? [],
		columns: dataArticleList,
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
