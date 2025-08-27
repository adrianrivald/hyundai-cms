import { DataTable } from "@/components/layout/table/data-table";
import { useListFactory } from "../_functions/hooks/use-list-factory";
import Container from "@/components/container";

const ListFactory = () => {
	const { table } = useListFactory();
	return (
		<Container className="">
			<DataTable table={table} showPagination={false} />
		</Container>
	);
};

export default ListFactory;
