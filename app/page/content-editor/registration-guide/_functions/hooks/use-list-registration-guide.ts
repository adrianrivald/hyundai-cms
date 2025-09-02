import { useTableConfig } from "@/hooks/use-table-config";
import { useTableState } from "@/hooks/use-table-state";

import { dataAboutUsColumn } from "../columns/registration-guide-column";
import { useGetGlobalVariables } from "@/api/global-variable";
import type { LegalContentType } from "@/page/content-editor/legal/_functions/models/legal";

export function useListAboutUs() {
	const tableState = useTableState({});

	const { data, refetch } = useGetGlobalVariables({
		queryKey: ["global-variable-registration-guide"],
		staleTime: 5 * 60 * 1000,
	});

	const table = useTableConfig({
		data:
			(data?.data
				.filter((item) => item.name === "registration_guide")
				.filter((item) => item.var_value !== "" && item.var_value !== null)
				.flatMap((item) => {
					try {
						const parsed = JSON.parse(item.var_value) as any;
						return parsed.map((itm: any) => ({ ...itm, id: String(item.id) }));
					} catch {
						return [];
					}
				}) as LegalContentType[]) ?? [],
		columns: dataAboutUsColumn,
		tableState,
	});

	return {
		table,
		data,
		refetch,
	};
}
