import { useTodosList } from "@/api/todos";
import { useTableConfig } from "@/hooks/use-table-config";
import { useTableState } from "@/hooks/use-table-state";
import type { AlbumTypes } from "@/types/PostTypes";
import { dataContactColumn } from "../columns/contact-column";

export function useListContact() {
	const tableState = useTableState({});

	const { data, refetch } = useTodosList({
		queryKey: ["contact-list"],
		staleTime: 5 * 60 * 1000,
	});

	const table = useTableConfig({
		data: (data?.slice(0, 10) as [] as AlbumTypes[]) ?? [],
		columns: dataContactColumn,
		tableState,
		// pageCount: data?.meta?.totalPages ?? -1,
		// meta: data?.meta,
	});

	return {
		table,
		data,
		refetch,
	};
}
