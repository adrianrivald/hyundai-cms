// import { Outlet } from "react-router";
// import { AppSidebar } from "@/components/app-sidebar";
// import {
// 	Breadcrumb,
// 	BreadcrumbList,
// 	BreadcrumbItem,
// 	BreadcrumbLink,
// 	BreadcrumbSeparator,
// 	BreadcrumbPage,
// } from "@/components/ui/breadcrumb";
// import { Separator } from "@/components/ui/separator";
// import {
// 	SidebarProvider,
// 	SidebarInset,
// 	SidebarTrigger,
// 	useSidebar,
// } from "@/components/ui/sidebar";
// import { ScrollArea } from "@radix-ui/react-scroll-area";

// const AuthLayout = () => {
// 	return (
// 		<div className="flex h-screen flex-col pt-[--navbar-height,0]">
// 			<div className="flex flex-1 overflow-hidden">
// 				<SidebarProvider className="fixed h-[94%]">
// 					{/* <LayoutSidebar /> */}
// 					{/* <TopBar /> */}
// 					<SidebarInset className="flex-1 mt-10">
// 						<ScrollArea>
// 							<main className="flex flex-1 flex-col gap-4 px-6 pt-10 pb-5 mb-[55px] ">
// 								<Outlet />
// 							</main>
// 						</ScrollArea>
// 					</SidebarInset>
// 				</SidebarProvider>
// 			</div>
// 		</div>
// 	);
// };

// export default AuthLayout;

import { AppSidebar } from "@/components/app-sidebar";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
	useSidebar,
} from "@/components/ui/sidebar";
import { Outlet } from "react-router";

export default function AuthLayout() {
	return (
		<div className="flex flex-1 overflow-hidden">
			<SidebarProvider className="fixed h-[94%]">
				<AppSidebar />
				<SidebarInset className="flex-1">
					<ScrollArea>
						<main className="flex flex-1 flex-col gap-4 px-6 pb-5 mb-[55px] ">
							<Outlet />
						</main>
					</ScrollArea>
				</SidebarInset>
			</SidebarProvider>
		</div>
	);
}
