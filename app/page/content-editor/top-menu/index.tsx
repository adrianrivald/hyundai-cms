import Container from "@/components/container";
import { Tabs } from "@/components/custom/tabs/tabs";
import { TabsContent } from "@/components/custom/tabs/tabs-content";
import { TabsList } from "@/components/custom/tabs/tabs-list";
import { TabsTrigger } from "@/components/custom/tabs/tabs-trigger";

const TopMenuPage = () => {
	return (
		<Container>
			{" "}
			<Tabs defaultValue="top-menu">
				<TabsList className="w-[calc(100%/3)] ">
					<TabsTrigger value="top-menu" className="cursor-default">
						Top Menu
					</TabsTrigger>
				</TabsList>
				<TabsContent value="top-menu">
					{/* <DataTable table={table} showPagination={false} /> */}
				</TabsContent>
			</Tabs>
		</Container>
	);
};

export default TopMenuPage;
