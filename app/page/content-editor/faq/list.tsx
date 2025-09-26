import { Tabs } from "@/components/custom/tabs/tabs";
import { TabsContent } from "@/components/custom/tabs/tabs-content";
import { TabsList } from "@/components/custom/tabs/tabs-list";
import { TabsTrigger } from "@/components/custom/tabs/tabs-trigger";
import { DataTable } from "@/components/layout/table/data-table";
import Container from "@/components/container";
import { useListFaq } from "./_functions/hooks/use-list-faq";

const FAQListPage = () => {
	const { table } = useListFaq();
	return (
		<Container>
			<Tabs defaultValue="contact">
				<TabsList className="w-[calc(100%/3)]">
					<TabsTrigger value="contact" className="cursor-default">
						FAQ
					</TabsTrigger>
				</TabsList>
				<TabsContent value="contact">
					<DataTable table={table} showPagination={false} />
				</TabsContent>
			</Tabs>
		</Container>
	);
};

export default FAQListPage;
