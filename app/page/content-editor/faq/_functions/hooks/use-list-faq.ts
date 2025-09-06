import { useTableConfig } from "@/hooks/use-table-config";
import { useTableState } from "@/hooks/use-table-state";
import { dataContactColumn } from "../columns/faq-column";
import { useGetFaqs } from "@/api/faq";

export function useListFaq() {
	const tableState = useTableState({});

	const { data, refetch } = useGetFaqs("", {
		queryKey: ["faq-get-all"],
		staleTime: 5 * 60 * 1000,
	});

	const table = useTableConfig({
		data: data?.data || [],
		columns: dataContactColumn,
		tableState,
	});

	return {
		table,
		data,
		refetch,
	};
}
