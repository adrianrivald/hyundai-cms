import { getMe } from "@/api/auth";
import HeaderBar from "@/components/layout/header/header-bar";
import { AppSidebar } from "@/components/layout/sidebar/app-sidebar";

import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import useToken from "@/hooks/use-token";
import { useEffect } from "react";
import { Outlet } from "react-router";

export default function AuthLayout() {
	const token = useToken();
	useEffect(() => {
		if (token) {
			getMe();
		}
	}, [token]);
	return (
		<div className="min-h-screen">
			<SidebarProvider>
				<AppSidebar />
				<SidebarInset className="bg-[#f4f8ff]">
					{/* <div className="flex h-screen flex-col"> */}
					<HeaderBar />
					<ScrollArea className="flex-1">
						<main className="h-full px-6 bg-[#f4f8ff] ">
							<Outlet />
						</main>
					</ScrollArea>
					{/* </div> */}
				</SidebarInset>
			</SidebarProvider>
		</div>
	);
}
