import { useTodosList } from "@/api/todos";
import { useTableConfig } from "@/hooks/use-table-config";
import { useTableState } from "@/hooks/use-table-state";
import type { AlbumTypes } from "@/types/PostTypes";
import { dataBannerColumn } from "../columns/banner-column";
import { useGetBanners } from "@/api/banner";

export function useListBanner() {
	const tableState = useTableState({});

	const { data, refetch } = useGetBanners("", {
		queryKey: ["banner-list"],
		staleTime: 60 * 60 * 1000,
	});

	const table = useTableConfig({
		data: data?.data ?? [],
		columns: dataBannerColumn,
		tableState,
	});

	return {
		table,
		data,
		refetch,
	};
}
