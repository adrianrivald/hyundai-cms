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

					const phones = parsed.contact
						.map((c) => c.phone?.trim())
						.filter((p) => p); // remove empty

					const emails = parsed.contact
						.map((c) => c.email?.trim())
						.filter((e) => e); // remove empty

					const contactDisplay = parsed.contact
						.filter((c) => c.phone || c.email) // only show if at least one exists
						.map((c) => `${c.phone}${c.email ? ` (${c.email})` : ""}`)
						.join(", ");

					return {
						...parsed,
						id: item.id,
						phone: phones.join(", "),
						email: emails.join(", "),
						contactDisplay,
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
