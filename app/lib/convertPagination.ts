import type { PaginationProps } from "@/components/layout/table/data-table";

export function convertPagination(meta: Meta): PaginationProps {
	const hasPreviousPage = meta.current_page > 1;
	const hasNextPage = meta.current_page < meta.last_page;

	return {
		hasPreviousPage,
		hasNextPage,
		previousPageNumber: hasPreviousPage ? meta.current_page - 1 : undefined,
		nextPageNumber: hasNextPage ? meta.current_page + 1 : undefined,
		pageSize: meta.per_page,
		pageSizeOptions: [10, 25, 50, 100], // Optional: adjust based on UI needs
		totalItems: meta.total,
		totalPages: meta.last_page,
		allItemCount: meta.total,
		hidePagination: false,
	};
}

export type Meta = {
	current_page: number;
	from: number;
	last_page: number;
	links: {
		url: string | null;
		label: string;
		active: boolean;
	}[];
	path: string;
	per_page: number;
	to: number;
	total: number;
};
