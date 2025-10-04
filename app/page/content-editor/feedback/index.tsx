import Container from "@/components/container";
import { useListFeedback } from "./_functions/hooks/use-list-feedback";
import { DataTable } from "@/components/layout/table/data-table";

const FeedbackPage = () => {
	const { table } = useListFeedback();
	return (
		<Container>
			<DataTable table={table} showPagination={false} />
		</Container>
	);
};

export default FeedbackPage;
