import { DataTable } from "@/components/layout/table/data-table";
import { useListTour } from "../_functions/hooks/use-list-tour";
import Container from "@/components/container";

const ListTour = () => {
	const { table } = useListTour();
	return (
		<Container className="">
			<DataTable table={table} showPagination={false} />
		</Container>
	);
};

export default ListTour;
