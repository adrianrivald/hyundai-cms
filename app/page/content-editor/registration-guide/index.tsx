import Container from "@/components/container";
import { Tabs } from "@/components/custom/tabs/tabs";
import { TabsContent } from "@/components/custom/tabs/tabs-content";
import { TabsList } from "@/components/custom/tabs/tabs-list";
import { TabsTrigger } from "@/components/custom/tabs/tabs-trigger";
import { DataTable } from "@/components/layout/table/data-table";
import { useListAboutUs } from "./_functions/hooks/use-list-registration-guide";

const RegistrationGuidePage = () => {
	const { table } = useListAboutUs();
	return (
		<Container>
			<Tabs defaultValue="registration-guide">
				<TabsList className="w-[calc(100%/3)]">
					<TabsTrigger className="cursor-default" value="registration-guide">
						Registration Guide Content
					</TabsTrigger>
				</TabsList>
				<TabsContent value="registration-guide">
					<DataTable table={table} showPagination={false} />
				</TabsContent>
			</Tabs>
		</Container>
	);
};

export default RegistrationGuidePage;
