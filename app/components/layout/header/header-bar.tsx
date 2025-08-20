import { Typography } from "@/components/typography";
import {
	Breadcrumb,
	BreadcrumbList,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbSeparator,
	BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Separator } from "@radix-ui/react-separator";

export default function HeaderBar() {
	const { toggleSidebar, open } = useSidebar();
	return (
		<header className="bg-background sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b-2 px-4 border-hmmi-primary-800">
			<div className="pt-2 flex flex-row items-center justify-between w-full">
				<div className="flex gap-2 items-center">
					<Button
						startIcon={
							<Icon
								icon="ic:round-menu"
								width="24"
								height="24"
								className={`transition-transform duration-300 ${open ? "rotate-90" : "rotate-0"}`}
							/>
						}
						className="h-[24px] w-[24px]"
						variant={"ghost"}
						onClick={toggleSidebar}
					/>

					<Typography className="text-hmmi-grey-900 font-bold">
						Dashboard
					</Typography>
				</div>

				<div className="flex flex-row gap-3 items-center">
					<div>
						<Typography className="font-bold text-hmmi-primary-900 text-[14px] text-right">
							Gilang A R
						</Typography>
						<Typography className="text-[12px] text-right">Welcome!</Typography>
					</div>
					<div className="cursor-pointer">
						<img src="favicon.ico" className="rounded-full h-[38px] w-[38px]" />
					</div>
				</div>
			</div>
		</header>
	);
}
