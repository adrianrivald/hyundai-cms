import { DataTable } from "@/components/layout/table/data-table";
import { useListTour } from "../_functions/hooks/use-list-tour";

const ListTour = () => {
	const { table } = useListTour();
	return (
		<div className="">
			<DataTable table={table} showPagination={false} />
		</div>
	);
};

export default ListTour;
