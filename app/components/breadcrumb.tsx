"use client";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router";

type Crumb = {
	label: string;
	href?: string; // optional, if not provided → it's the current page
};

type Props = {
	items: Crumb[];
};

export function DynamicBreadcrumb({ items }: Props) {
	return (
		<Breadcrumb>
			<BreadcrumbList>
				{items.map((item, index) => {
					const isLast = index === items.length - 1;

					return (
						<div key={index} className="flex items-center">
							{index > 0 && <BreadcrumbSeparator />}
							<BreadcrumbItem>
								{isLast || !item.href ? (
									<BreadcrumbPage>{item.label}</BreadcrumbPage>
								) : (
									<BreadcrumbLink asChild>
										<Link to={item.href}>{item.label}</Link>
									</BreadcrumbLink>
								)}
							</BreadcrumbItem>
						</div>
					);
				})}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
