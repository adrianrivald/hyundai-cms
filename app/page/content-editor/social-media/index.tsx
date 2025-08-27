import Container from "@/components/container";
import { Tabs } from "@/components/custom/tabs/tabs";
import { TabsContent } from "@/components/custom/tabs/tabs-content";
import { TabsList } from "@/components/custom/tabs/tabs-list";
import { TabsTrigger } from "@/components/custom/tabs/tabs-trigger";
import { useListSocialMedia } from "./_functions/hooks/use-list-social-media";
import { DataTable } from "@/components/layout/table/data-table";

const SocialMediaPage = () => {
	const { table } = useListSocialMedia();
	return (
		<Container>
			<Tabs defaultValue="social-media">
				<TabsList className="w-[calc(100%/3)]">
					<TabsTrigger value="social-media">Social Media</TabsTrigger>
				</TabsList>
				<TabsContent value="social-media">
					<DataTable table={table} showPagination={false} />
				</TabsContent>
			</Tabs>
		</Container>
	);
};

export default SocialMediaPage;
