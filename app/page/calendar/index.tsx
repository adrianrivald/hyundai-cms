import { DataTable } from "@/components/layout/table/data-table";
import { useListAlbum } from "./functions/hooks/use-list-albums";

export default function CalendarPage() {
	const { table, data } = useListAlbum();
	return (
		<div>
			<DataTable table={table} showPagination={true} />
		</div>
	);
}
