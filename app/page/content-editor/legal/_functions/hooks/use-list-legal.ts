import { useTableConfig } from "@/hooks/use-table-config";
import { useTableState } from "@/hooks/use-table-state";
import { dataLegalColumn } from "../columns/legal-column";
import { useGetGlobalVariables } from "@/api/global-variable";
import type { LegalContentType } from "../models/legal";

export function useListLegal() {
	const tableState = useTableState({});

	const { data, refetch } = useGetGlobalVariables({
		queryKey: ["global-variable-legal"],
		staleTime: 5 * 60 * 1000,
	});

	const table = useTableConfig({
		data:
			(data?.data
				.filter((item) => item.name === "legal")
				.filter((item) => item.var_value !== "" && item.var_value !== null)
				.flatMap((item) => {
					try {
						const parsed = JSON.parse(item.var_value) as any;
						return parsed.map((itm: any) => ({ ...itm, id: String(item.id) }));
					} catch {
						return [];
					}
				}) as LegalContentType[]) ?? [],
		columns: dataLegalColumn,
		tableState,
	});

	return {
		table,
		data,
		refetch,
	};
}
