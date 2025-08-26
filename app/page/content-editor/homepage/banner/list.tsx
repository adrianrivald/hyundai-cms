import { DataTable } from "@/components/layout/table/data-table";
import { useListBanner } from "../_functions/hooks/use-list-banner";

const ListBanner = () => {
	const { table } = useListBanner();
	return (
		<div className="">
			<DataTable table={table} showPagination={false} />
		</div>
	);
};

export default ListBanner;
