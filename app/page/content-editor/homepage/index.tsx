import Container from "@/components/container";
import { Tabs } from "@/components/custom/tabs/tabs";
import { TabsContent } from "@/components/custom/tabs/tabs-content";
import { TabsList } from "@/components/custom/tabs/tabs-list";
import { TabsTrigger } from "@/components/custom/tabs/tabs-trigger";
import { Icon } from "@iconify/react/dist/iconify.js";
import ListBanner from "./banner/list";
import ListTour from "./tour/list";
import ListFactory from "./factory/list";
import ListYoutube from "./youtube/list";

export default function Homepage() {
	return (
		<Container className="bg-[#f4f8ff]">
			<Tabs defaultValue="banner">
				<TabsList>
					<TabsTrigger value="banner">
						<div className="flex flex-row items-center gap-1 self-center">
							<Icon icon="mynaui:image" width="20" height="20" />
							List Banner
						</div>
					</TabsTrigger>
					<TabsTrigger value="tour">
						<div className="flex flex-row items-center gap-1 self-center">
							<Icon icon="hugeicons:mentor" width="20" height="20" />
							List Tour
						</div>
					</TabsTrigger>
					<TabsTrigger value="pabrik">
						<div className="flex flex-row items-center gap-1 self-center">
							<Icon icon="hugeicons:factory" width="20" height="20" />
							List Factory
						</div>
					</TabsTrigger>
				</TabsList>

				<TabsContent value="banner">
					<ListBanner />
				</TabsContent>
				<TabsContent value="tour">
					<ListTour />
				</TabsContent>
				<TabsContent value="pabrik">
					<ListFactory />
				</TabsContent>
			</Tabs>

			<Tabs defaultValue="youtube" className={"mt-5"}>
				<TabsList className="w-[calc(100%/3)] ">
					<TabsTrigger value="youtube" className="cursor-default">
						YouTube Section
					</TabsTrigger>
				</TabsList>
				<TabsContent value="youtube">
					<ListYoutube />
				</TabsContent>
			</Tabs>
		</Container>
	);
}
