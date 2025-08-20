import * as React from "react";
import { ChevronDown } from "lucide-react";
import {
	Collapsible,
	CollapsibleTrigger,
	CollapsibleContent,
} from "@radix-ui/react-collapsible";
import {
	SidebarHeader,
	SidebarContent,
	SidebarGroup,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
	SidebarRail,
	Sidebar,
	useSidebar,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "../../ui/sidebar";
import { cn } from "@/lib/utils";
import { SIDEBAR_MENU, type Items } from "./sidebar-config";
import { Typography } from "../../typography";
import { useLocation, useNavigate } from "react-router";

// This is sample data.
const data = {
	navMain: [
		{
			title: "Post",
			url: "#",
			items: [],
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { state, open } = useSidebar();
	const navigate = useNavigate();
	const location = useLocation();

	const isItemActive = (item: Items): boolean => {
		if (!location?.pathname) return false;

		// Special handling for root path
		if (item.url === "/" && location.pathname === "/") {
			return true;
		}

		// For non-root, use startsWith to support sub-routes
		if (
			item.url &&
			item.url !== "/" &&
			location.pathname.startsWith(item.url)
		) {
			return true;
		}

		// Recursively check nested items
		return item.items?.some(isItemActive) ?? false;
	};

	return (
		<Sidebar
			{...props}
			collapsible="offcanvas"
			variant="sidebar"
			className="bg-white"
		>
			<SidebarHeader className="bg-white">
				<SidebarMenu
					className={cn(
						" px-2 py-2 rounded-lg flex items-center justify-between mt-1",
						!open && "px-0 py-1 "
					)}
				>
					<SidebarMenuItem>
						{open && (
							<img
								src={`/images/logo.webp`}
								alt="Logo"
								width={201}
								height={27}
							/>
						)}
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent
				className={`gap-0 ${state === "expanded" ? "w-56" : "w-13"} bg-[#153263] rounded-tr-[70px]`}
			>
				<SidebarGroup className="mt-8 bg-[#153263] z-[10]">
					<SidebarMenu>
						{SIDEBAR_MENU.map((item, index) => {
							const itemIsActive = isItemActive(item);
							if ((item.items?.length || 0) > 0) {
								return (
									<Collapsible
										key={item.title}
										asChild
										defaultOpen={itemIsActive}
										className="group/collapsible"
									>
										<SidebarMenuItem>
											<CollapsibleTrigger asChild>
												<SidebarMenuButton
													className={cn(
														"rounded-none px-4 h-10",
														// itemIsActive && 'bg-yellow-300',
														!open &&
															"flex items-center justify-center group-data-[collapsible=icon]:!w-full cursor-pointer"
													)}
													tooltip={item.title}
												>
													<Typography
														className={cn(
															"text-sm text-white",
															itemIsActive && "font-bold"
														)}
													>
														{item.title}
													</Typography>
													<ChevronDown
														className={cn(
															"ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180 text-white",
															!open && "hidden"
														)}
													/>
												</SidebarMenuButton>
											</CollapsibleTrigger>
											<CollapsibleContent>
												<SidebarMenuSub className="mx-0 px-0 border-none">
													{item.items?.map((subItem) => {
														const subIsActive = isItemActive(subItem);
														return (
															<SidebarMenuSubItem key={subItem.title}>
																<SidebarMenuSubButton
																	onClick={() => {
																		navigate(subItem.url);
																	}}
																	className={cn(
																		"rounded-none pl-8 h-10 cursor-pointer"
																	)}
																>
																	<Typography
																		className={cn(
																			"text-sm text-white",
																			subIsActive && "font-bold"
																		)}
																	>
																		{subItem.title}
																	</Typography>
																</SidebarMenuSubButton>
															</SidebarMenuSubItem>
														);
													})}
												</SidebarMenuSub>
											</CollapsibleContent>
										</SidebarMenuItem>
									</Collapsible>
								);
							}
							return (
								<SidebarMenuItem
									key={item.title + String(index)}
									onClick={() => {
										navigate(item.url);
									}}
								>
									<SidebarMenuButton
										className={cn(
											"rounded-none px-4 h-10 group-data-[collapsible=icon]:!w-full justify-center cursor-pointer",
											open && "justify-start"
										)}
										tooltip={item.title}
									>
										<Typography
											className={cn(
												"text-sm text-white",
												itemIsActive && "font-bold"
											)}
										>
											{item.title}
										</Typography>
									</SidebarMenuButton>
								</SidebarMenuItem>
							);
						})}
					</SidebarMenu>
				</SidebarGroup>
				<img
					src="/images/bg-sidebar.webp"
					height={298}
					width={298}
					className="absolute bottom-[-5rem] left-[-5rem]"
				/>
			</SidebarContent>

			<SidebarRail />
		</Sidebar>
	);
}
