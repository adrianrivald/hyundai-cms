import Container from "@/components/container";
import { DataTable } from "@/components/layout/table/data-table";
import { useListArticle } from "./_functions/hooks/use-list-article";

const ArticlePage = () => {
	const { table, metadata } = useListArticle();
	return (
		<Container>
			<DataTable table={table} showPagination={true} pagination={metadata} />
		</Container>
	);
};

export default ArticlePage;
