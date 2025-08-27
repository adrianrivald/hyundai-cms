import { DataTable } from "@/components/layout/table/data-table";
import { useListBanner } from "../_functions/hooks/use-list-banner";
import Container from "@/components/container";

const ListBanner = () => {
	const { table } = useListBanner();
	return (
		<Container className="">
			<DataTable table={table} showPagination={false} />
		</Container>
	);
};

export default ListBanner;
