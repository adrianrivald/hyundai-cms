import Container from "@/components/container";
import { DataTable } from "@/components/layout/table/data-table";
import { useListArticle } from "./_functions/hooks/use-list-article";

const ArticlePage = () => {
	const { table, metadata } = useListArticle();
	return (
		<Container className="grid grid-cols-1">
			<DataTable table={table} showPagination={true} pagination={metadata} />
		</Container>
	);
};

export default ArticlePage;
