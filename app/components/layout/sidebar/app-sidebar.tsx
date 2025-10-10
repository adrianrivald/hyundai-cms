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
	SidebarFooter,
} from "../../ui/sidebar";
import { cn } from "@/lib/utils";
import { SIDEBAR_MENU, type Items } from "./sidebar-config";
import { Typography } from "../../typography";
import { useLocation, useNavigate } from "react-router";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { state, open } = useSidebar();
	const navigate = useNavigate();
	const location = useLocation();

	const isItemActive = (item: Items): boolean => {
		if (!location?.pathname) return false;

		if (item.url === "/" && location.pathname === "/") {
			return true;
		}

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
			className="sidebar-custom"
		>
			<SidebarHeader className={``}>
				<SidebarMenu
					className={cn(
						" px-2 py-2 flex items-center justify-between mt-1",
						!open && "px-0 py-1 "
					)}
				>
					<SidebarMenuItem>
						<img src={`/images/logo.webp`} alt="Logo" width={201} height={27} />
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent className="bg-[#f4f8ff] sidebar">
				<SidebarGroup
					className={`z-[10] gap-0 h-[125vh] max-h-[140vh] pt-8 ${(state === "expanded" || state === "collapsed") && "w-60"} bg-[#0D254D]`}
				>
					<SidebarMenu>
						{SIDEBAR_MENU().map((item: Items, index: number) => {
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
														"rounded-none px-4 h-10 cursor-pointer ",
														// itemIsActive && 'bg-yellow-300',
														!open &&
															"flex items-center group-data-[collapsible=icon]:!w-full "
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
															"ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180 text-white"
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
											" rounded-none px-4 h-10 group-data-[collapsible=icon]:!w-full  cursor-pointer",
											open && "justify-start"
										)}
										tooltip={item.title}
									>
										<Typography
											className={cn(
												"text-sm text-white ",
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
				{/* <img
					src="/images/bg-sidebar.webp"
					height={298}
					width={298}
					className="absolute bottom-[-5rem] left-[-5rem]"
				/> */}
			</SidebarContent>
			<SidebarFooter className="bg-[#0D254D] pl-5">
				{/* <SidebarMenuButton
					onClick={() => {
						logout();
					}}
					className={cn("rounded-md bg-[#0D254D] z-10 text-white")}
					tooltip={"Logout"}
				>
					<Typography className={cn("text-sm text-white ")}>Logout</Typography>
				</SidebarMenuButton> */}
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
