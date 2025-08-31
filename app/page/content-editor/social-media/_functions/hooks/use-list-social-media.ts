import { useTableConfig } from "@/hooks/use-table-config";
import { useTableState } from "@/hooks/use-table-state";
import { dataSocmedColumn } from "../columns/social-media-column";
import { useGetGlobalVariables } from "@/api/global-variable";
import type { GlobalVariableTypes } from "@/types/GlobalVariableTypes";

export function useListSocialMedia() {
	const tableState = useTableState({});

	const { data, refetch } = useGetGlobalVariables({
		queryKey: ["global-variable-social-media"],
		staleTime: 5 * 60 * 1000,
	});

	const table = useTableConfig({
		data:
			(
				data?.data
					.filter((item) => item.name === "social_media")
					.filter((item) => !!item.var_value) as GlobalVariableTypes[]
			)?.map((item) => JSON.parse(item.var_value))?.[0] ?? [],
		columns: dataSocmedColumn,
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
