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
import type { Items } from "../sidebar/sidebar-config";
import { useActiveSidebarItem } from "./title-bar";

export default function HeaderBar() {
	const { toggleSidebar } = useSidebar();
	const title = useActiveSidebarItem();
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
									Gilang A R
								</Typography>
								<Typography className="text-[12px] text-right">
									Welcome!
								</Typography>
							</div>
							<div className="cursor-pointer">
								<img
									src="/favicon.ico"
									className="rounded-full h-[38px] w-[38px]"
								/>
							</div>
						</div>
					</PopoverTrigger>
					<PopoverContent>
						<Stack spacing={4}>
							<Stack direction="column" alignItems="center" spacing={3}>
								<H4 className="text-sm font-medium ">email@email.com</H4>
								<img
									className="w-[36px] h-[36px] rounded-[18px] object-fill"
									src={`/favicon.ico`}
									aria-label="profile-person"
								/>
								<Stack spacing={1} alignItems="center">
									<H4 className="text-base font-medium text-center">
										Gilang A R
									</H4>
									<H4 className="text-base font-medium text-center">
										Role Name
									</H4>
								</Stack>
							</Stack>
							<Separator />
							<div
								className="flex flex-row gap-2 justify-start cursor-pointer hover:bg-sidebar-accent hover:text-white px-2 py-1 rounded-md items-center"
								//onClick={() => setOpen(true)}
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
