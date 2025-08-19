import { usePostList } from "@/api/post";
import { useNavigate } from "react-router";
import type { Route } from "./+types/post-list";
import {
	Breadcrumb,
	BreadcrumbList,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbSeparator,
	BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

export default function PostList() {
	const navigate = useNavigate();
	const { data, isLoading, error } = usePostList({
		queryKey: ["posts"],
	});

	if (isLoading) return <p>Loading...</p>;
	if (error) return <p>Error: {(error as Error).message}</p>;

	return (
		<div>
			<header className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4 mb-4">
				<SidebarTrigger className="-ml-1" />
				<Separator orientation="vertical" className="mr-2 h-4" />
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem className="hidden md:block">
							<BreadcrumbLink href="#">
								Building Your Application
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator className="hidden md:block" />
						<BreadcrumbItem>
							<BreadcrumbPage>Data Fetching</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</header>
			{data?.map((item, index) => {
				return (
					<div
						key={index}
						className="p-2 border-2 mb-2 rounded-md cursor-pointer"
						onClick={() => {
							navigate("/post/detail/" + item.id);
						}}
					>
						{item?.title}
					</div>
				);
			})}
		</div>
	);
}
