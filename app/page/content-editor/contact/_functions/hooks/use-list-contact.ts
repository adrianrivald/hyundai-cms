import { useTableConfig } from "@/hooks/use-table-config";
import { useTableState } from "@/hooks/use-table-state";
import { dataContactColumn } from "../columns/contact-column";
import { useGetGlobalVariables } from "@/api/global-variable";
import type { ContactType } from "../models/contact";

export function useListContact() {
	const tableState = useTableState({});

	const { data, refetch } = useGetGlobalVariables({
		queryKey: ["global-variable-contact"],
		staleTime: 5 * 60 * 1000,
	});

	const table = useTableConfig({
		data:
			data?.data
				.filter((item) => item.name === "contact")
				.filter((item) => item.var_value !== "" && item.var_value !== null)
				.map((item) => {
					const parsed = JSON.parse(item.var_value) as ContactType;
					return {
						...parsed,
						id: item.id,
						phone: parsed.contact.map((c) => c.phone).join(", "),
						email: parsed.contact.map((c) => c.email).join(", "),
						contactDisplay: parsed.contact
							.map((c) => `${c.phone} (${c.email})`)
							.join(", "),
					};
				}) ?? [],
		columns: dataContactColumn,
		tableState,
	});

	return {
		table,
		data,
		refetch,
	};
}
