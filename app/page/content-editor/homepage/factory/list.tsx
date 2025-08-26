import { DataTable } from "@/components/layout/table/data-table";
import { useListFactory } from "../_functions/hooks/use-list-factory";

const ListFactory = () => {
	const { table } = useListFactory();
	return (
		<div className="">
			<DataTable table={table} showPagination={false} />
		</div>
	);
};

export default ListFactory;
