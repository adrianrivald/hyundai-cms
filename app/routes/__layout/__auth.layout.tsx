import HeaderBar from "@/components/layout/header/header-bar";
import { AppSidebar } from "@/components/layout/sidebar/app-sidebar";

import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router";

export default function AuthLayout() {
	return (
		<div className="min-h-screen">
			<SidebarProvider>
				<AppSidebar />
				<SidebarInset>
					{/* <div className="flex h-screen flex-col"> */}
					<HeaderBar />
					<ScrollArea className="flex-1">
						<main className="h-full px-6">
							<Outlet />
						</main>
					</ScrollArea>
					{/* </div> */}
				</SidebarInset>
			</SidebarProvider>
		</div>
	);
}
