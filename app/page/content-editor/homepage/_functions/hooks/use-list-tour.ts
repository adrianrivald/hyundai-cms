import { useTableConfig } from "@/hooks/use-table-config";
import { useTableState } from "@/hooks/use-table-state";
import { dataTourColumn } from "../columns/tour-column";
import { useGetTourPackages, type TourPackageType } from "@/api/tour-package";

export function useListTour() {
	const tableState = useTableState({});

	const { data, refetch } = useGetTourPackages("", {
		queryKey: ["package-factory-get-all"],
		staleTime: 5 * 60 * 1000,
	});

	const table = useTableConfig({
		data: (data?.data as TourPackageType[]) ?? [],
		columns: dataTourColumn,
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
