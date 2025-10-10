import Container from "@/components/container";
import { useReportVisitorList } from "./functions/hooks/use-report-visitor";
import { DataTable } from "@/components/layout/table/data-table";

const ReportVisitorPage = () => {
	const { table, metadata } = useReportVisitorList();
	return (
		<Container>
			<DataTable table={table} showPagination={true} pagination={metadata} />
		</Container>
	);
};

export default ReportVisitorPage;
