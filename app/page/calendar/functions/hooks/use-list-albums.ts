import { useTodosList } from "@/api/todos";
import { useTableConfig } from "@/hooks/use-table-config";
import { useTableState } from "@/hooks/use-table-state";
import type { AlbumTypes } from "@/types/PostTypes";
import { dataAlbumColumn } from "../column/column-album";

export function useListAlbum() {
	const tableState = useTableState({
		// initialColumnPinning: {
		//   right: ['ID_ACTION_COLUMN'],
		// },
	});
	// const debounceFilters = useDebounce(tableState.columnFilters, 1000)
	// const {Filters, Sorts, PageSize, PageNumber, setTableState, SearchValue} =
	//   useTableFilter()
	// useEffect(() => {
	//   setTableState({
	//     Filters: `${generateFilters(tableState.columnFilters) || ''}`,
	//     Sorts: generateSorts(tableState.sorting) ?? '-updatedDate',
	//     PageSize: tableState.pagination.pageSize,
	//     PageNumber: tableState.pagination.pageIndex + 1,
	//     SearchValue: tableState.searchValue,
	//   })
	// }, [
	//   debounceFilters,
	//   tableState.sorting,
	//   tableState.pagination,
	//   tableState.searchValue,
	//   setTableState,
	// ])

	const { data, refetch } = useTodosList({
		queryKey: ["todos"],
		staleTime: 5 * 60 * 1000,
	});

	const table = useTableConfig({
		data: (data?.slice(0, 10) as [] as AlbumTypes[]) ?? [],
		columns: dataAlbumColumn,
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
