import { useTableConfig } from "@/hooks/use-table-config";
import { useTableState } from "@/hooks/use-table-state";

import { dataYoutubeColumn } from "../columns/youtube-column";
import { useGetGlobalVariables } from "@/api/global-variable";
import type { GlobalVariableTypes } from "@/types/GlobalVariableTypes";

export function useListYoutube() {
	const tableState = useTableState({});

	const { data, refetch } = useGetGlobalVariables({
		queryKey: ["global-variable-youtube"],
		staleTime: 5 * 60 * 1000,
	});

	const table = useTableConfig({
		data:
			(data?.data
				.filter((item) => item.name === "ytb_link_video")
				.filter(
					(item) => item.var_value !== "" || item.var_value !== null
				) as GlobalVariableTypes[]) ?? [],
		columns: dataYoutubeColumn,
		tableState,
	});

	return {
		table,
		data,
		refetch,
	};
}
