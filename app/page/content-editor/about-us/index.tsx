import Container from "@/components/container";
import { Tabs } from "@/components/custom/tabs/tabs";
import { TabsContent } from "@/components/custom/tabs/tabs-content";
import { TabsList } from "@/components/custom/tabs/tabs-list";
import { TabsTrigger } from "@/components/custom/tabs/tabs-trigger";
import { DataTable } from "@/components/layout/table/data-table";
import { useListAboutUs } from "./_functions/hooks/use-list-about-us";

const AboutUsPage = () => {
	const { table } = useListAboutUs();
	return (
		<Container>
			<Tabs defaultValue="about-us">
				<TabsList className="w-[calc(100%/3)]">
					<TabsTrigger className="cursor-default" value="about-us">
						About Us Content
					</TabsTrigger>
				</TabsList>
				<TabsContent value="about-us">
					<DataTable table={table} showPagination={false} />
				</TabsContent>
			</Tabs>
		</Container>
	);
};

export default AboutUsPage;
