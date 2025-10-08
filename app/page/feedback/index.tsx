import Container from "@/components/container";
import { useListFeedback } from "./functions/hooks/use-list-feedback";
import { DataTable } from "@/components/layout/table/data-table";

const FeedbackPage = () => {
	const { table, metadata } = useListFeedback();
	return (
		<Container>
			<DataTable table={table} showPagination={true} pagination={metadata} />
		</Container>
	);
};

export default FeedbackPage;
