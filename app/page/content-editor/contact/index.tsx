import Container from "@/components/container";
import { Tabs } from "@/components/custom/tabs";
import { TabsContent } from "@/components/custom/tabs-content";
import { TabsList } from "@/components/custom/tabs-list";
import { TabsTrigger } from "@/components/custom/tabs-trigger";
import { DataTable } from "@/components/layout/table/data-table";
import { useListContact } from "./_functions/hooks/use-list-contact";

const ContactPage = () => {
	const { table } = useListContact();
	return (
		<Container>
			<Tabs defaultValue="contact">
				<TabsList className="w-[calc(100%/3)]">
					<TabsTrigger value="contact">Contact</TabsTrigger>
				</TabsList>
				<TabsContent value="contact">
					<DataTable table={table} showPagination={false} />
				</TabsContent>
			</Tabs>
		</Container>
	);
};

export default ContactPage;
