import { useTableConfig } from "@/hooks/use-table-config";
import { useTableState } from "@/hooks/use-table-state";
import { dataFactoryColumn } from "../columns/factory-column";
import { useGetFactories, type FactoryType } from "@/api/factory";

export function useListFactory() {
	const tableState = useTableState({});

	const { data, refetch } = useGetFactories("", {
		queryKey: ["factory-list"],
		staleTime: 5 * 60 * 1000,
	});

	const table = useTableConfig({
		data: (data?.data as [] as FactoryType[]) ?? [],
		columns: dataFactoryColumn,
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
