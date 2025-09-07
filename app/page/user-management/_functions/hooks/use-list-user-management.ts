import { useTableConfig } from "@/hooks/use-table-config";
import { useTableState } from "@/hooks/use-table-state";
import { dataUserManagementColumn } from "../columns/user-column";
import { useGetUsers, type UserType } from "@/api/user";

export function useListUserManagement() {
	const tableState = useTableState({});

	const { data, refetch } = useGetUsers("", {
		queryKey: ["user-get-all"],
		staleTime: 5 * 60 * 1000,
	});

	const table = useTableConfig({
		data: (data?.data as UserType[]) ?? [],
		columns: dataUserManagementColumn,
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
