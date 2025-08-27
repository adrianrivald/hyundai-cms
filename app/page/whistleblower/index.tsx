import Container from "@/components/container";
import { DataTable } from "@/components/layout/table/data-table";
import { useListWhistleblower } from "./_functions/hooks/use-list-whistleblower";

const WhistleblowerPage = () => {
	const { table, metadata } = useListWhistleblower();
	return (
		<Container className="grid grid-cols-1">
			<DataTable table={table} showPagination={true} pagination={metadata} />
		</Container>
	);
};

export default WhistleblowerPage;
