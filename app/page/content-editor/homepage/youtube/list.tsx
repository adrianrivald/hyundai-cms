import { DataTable } from "@/components/layout/table/data-table";
import { useListYoutube } from "../_functions/hooks/use-list-youtube";
import Container from "@/components/container";

const ListYoutube = () => {
	const { table } = useListYoutube();
	return (
		<Container className="">
			<DataTable table={table} showPagination={false} />
		</Container>
	);
};

export default ListYoutube;
