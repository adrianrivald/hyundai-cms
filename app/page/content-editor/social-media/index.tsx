import Container from "@/components/container";
import { Tabs } from "@/components/custom/tabs";
import { TabsContent } from "@/components/custom/tabs-content";
import { TabsList } from "@/components/custom/tabs-list";
import { TabsTrigger } from "@/components/custom/tabs-trigger";
import { useListSocialMedia } from "./_functions/hooks/use-list-social-media";
import { DataTable } from "@/components/layout/table/data-table";

const SocialMediaPage = () => {
	const { table } = useListSocialMedia();
	return (
		<Container>
			<Tabs defaultValue="social-media" className={"mt-5"}>
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
