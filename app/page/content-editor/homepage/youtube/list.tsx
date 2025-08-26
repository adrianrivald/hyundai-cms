import { DataTable } from "@/components/layout/table/data-table";
import { useListTour } from "../_functions/hooks/use-list-tour";
import { useListYoutube } from "../_functions/hooks/use-list-youtube";

const ListYoutube = () => {
	const { table } = useListYoutube();
	return (
		<div className="">
			<DataTable table={table} showPagination={false} />
		</div>
	);
};

export default ListYoutube;
