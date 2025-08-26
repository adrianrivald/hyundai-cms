import Container from "@/components/container";
import { Tabs } from "@/components/custom/tabs";
import { TabsContent } from "@/components/custom/tabs-content";
import { TabsList } from "@/components/custom/tabs-list";
import { TabsTrigger } from "@/components/custom/tabs-trigger";

import { Grid } from "@/components/grid";
import { Typography } from "@/components/typography";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function Homepage() {
	return (
		<Container className="bg-[#f4f8ff]">
			<Tabs defaultValue="banner">
				<TabsList>
					<TabsTrigger value="banner">
						<div className="flex flex-row items-center gap-1 self-center">
							<Icon icon="mynaui:image" width="20" height="20" />
							Daftar Banner
						</div>
					</TabsTrigger>
					<TabsTrigger value="tour">
						<div className="flex flex-row items-center gap-1 self-center">
							<Icon icon="hugeicons:mentor" width="20" height="20" />
							Daftar Tour
						</div>
					</TabsTrigger>
					<TabsTrigger value="pabrik">
						<div className="flex flex-row items-center gap-1 self-center">
							<Icon icon="hugeicons:factory" width="20" height="20" />
							Daftar Pabrik
						</div>
					</TabsTrigger>
				</TabsList>

				<TabsContent value="banner">
					<Typography>Konten untuk Banner</Typography>
				</TabsContent>
				<TabsContent value="tour">
					<Typography>Konten untuk Tour</Typography>
				</TabsContent>
				<TabsContent value="pabrik">
					<Typography>Konten untuk Pabrik</Typography>
				</TabsContent>
			</Tabs>
		</Container>
	);
}
