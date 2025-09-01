import { Stack } from "@/components/stack";
import { H4, Typography } from "@/components/typography";

import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useSidebar } from "@/components/ui/sidebar";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Separator } from "@radix-ui/react-separator";
import { useActiveSidebarItem } from "./title-bar";
import useUser from "@/hooks/use-user";
import { getLogout } from "@/api/auth";
import { useNavigate } from "react-router";
import Cookies from "js-cookie";

export default function HeaderBar() {
	const { toggleSidebar } = useSidebar();
	const title = useActiveSidebarItem();
	const navigate = useNavigate();
	const user = useUser();

	const logout = async () => {
		getLogout().then(() => {
			Cookies.remove("token");
			Cookies.remove("info");

			navigate("/login", { replace: true });
		});
	};

	return (
		<header className="bg-background sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2  px-4 border-hmmi-primary-800">
			<div className="pt-2 flex flex-row items-center justify-between w-full">
				<div className="flex gap-2 items-center">
					<Button
						startIcon={
							<Icon
								icon="ic:round-menu"
								width="24"
								height="24"
								className={`transition-transform duration-300`}
							/>
						}
						className="h-[24px] w-[24px]"
						variant={"ghost"}
						onClick={toggleSidebar}
					/>

					<Typography className="text-hmmi-grey-900 font-bold">
						{title?.title || ""}
					</Typography>
				</div>
				<Popover>
					<PopoverTrigger>
						<div className="flex flex-row gap-3 items-center cursor-pointer">
							<div>
								<Typography className="font-bold text-hmmi-primary-900 text-[14px] text-right">
									{user.name}
								</Typography>
								<Typography className="text-[12px] text-right">
									Welcome!
								</Typography>
							</div>
							<div className="cursor-pointer">
								<Icon
									icon="fluent:person-32-filled"
									width="38"
									height="38"
									className="border-[1px] border-black rounded-[19px]"
								/>
							</div>
						</div>
					</PopoverTrigger>
					<PopoverContent>
						<Stack spacing={4}>
							<Stack direction="column" alignItems="center" spacing={3}>
								<H4 className="text-sm font-medium ">{user.email}</H4>
								<Icon
									icon="fluent:person-32-filled"
									width="38"
									height="38"
									className="border-[1px] border-black rounded-[19px]"
								/>
								<Stack spacing={1} alignItems="center">
									<H4 className="text-base font-medium text-center">
										{user.name}
									</H4>
									<H4 className="text-base font-medium text-center">
										Role Name
									</H4>
								</Stack>
							</Stack>
							<Separator />
							<div
								className="flex flex-row gap-2 justify-start cursor-pointer hover:bg-sidebar-accent hover:text-white px-2 py-1 rounded-md items-center"
								onClick={() => logout()}
							>
								<Icon icon="mdi:logout" width="20" height="20" />
								<Typography>Logout</Typography>
							</div>
						</Stack>
					</PopoverContent>
				</Popover>
			</div>
		</header>
	);
}
