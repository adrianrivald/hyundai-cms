import { useTodosList } from "@/api/todos";
import { useTableConfig } from "@/hooks/use-table-config";
import { useTableState } from "@/hooks/use-table-state";
import type { AlbumTypes } from "@/types/PostTypes";
import { dataWhistleblower } from "../columns/whistleblower-column";
import { convertPagination } from "@/lib/convertPagination";

export function useListWhistleblower() {
	const tableState = useTableState({});

	const { data, refetch } = useTodosList({
		queryKey: ["article-list"],
		staleTime: 5 * 60 * 1000,
	});

	const meta = {
		current_page: 1,
		from: 1,
		last_page: 4,
		links: [
			{
				url: null,
				label: "&laquo; Previous",
				active: false,
			},
			{
				url: "http://hmmi-api.test/api/admin/articles?page=1",
				label: "1",
				active: true,
			},
			{
				url: null,
				label: "Next &raquo;",
				active: false,
			},
		],
		path: "http://hmmi-api.test/api/admin/articles",
		per_page: 10,
		to: 10,
		total: 10,
	};

	const table = useTableConfig({
		data: (data?.slice(0, 10) as [] as AlbumTypes[]) ?? [],
		columns: dataWhistleblower,
		tableState,
		pageCount: convertPagination(meta).totalPages,
		meta: convertPagination(meta),
	});

	return {
		table,
		data,
		refetch,
		metadata: convertPagination(meta),
	};
}
