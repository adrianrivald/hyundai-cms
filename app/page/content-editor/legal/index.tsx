import Container from "@/components/container";
import { Tabs } from "@/components/custom/tabs/tabs";
import { TabsContent } from "@/components/custom/tabs/tabs-content";
import { TabsList } from "@/components/custom/tabs/tabs-list";
import { TabsTrigger } from "@/components/custom/tabs/tabs-trigger";
import { DataTable } from "@/components/layout/table/data-table";
import { useListLegal } from "./_functions/hooks/use-list-legal";

const LegalPage = () => {
	const { table } = useListLegal();
	return (
		<Container>
			<Tabs defaultValue="legal-content">
				<TabsList className="w-[calc(100%/3)]">
					<TabsTrigger value="legal-content">Legal Content</TabsTrigger>
				</TabsList>
				<TabsContent value="legal-content">
					<DataTable table={table} showPagination={false} />
				</TabsContent>
			</Tabs>
		</Container>
	);
};

export default LegalPage;
