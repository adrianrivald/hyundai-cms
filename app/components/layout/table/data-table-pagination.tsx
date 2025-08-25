import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { RowData, Table, Table as TableType } from "@tanstack/react-table";
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	Search,
} from "lucide-react";
import { useState } from "react";

export type PaginationProps = {
	hidePageSearch?: boolean;
	hidePageNavigation?: boolean;
	hidePageSizeOptions?: boolean;
	hidePagination?: boolean;
	pageRangeDisplayed?: number;
	pageSizeOptions?: number[];
	totalItems?: number;
	allItemCount?: number;
};

type DataTablePaginationProps<T extends RowData> = {
	table: TableType<T>;
	pagination?: PaginationProps;
};

type LeftSidePaginationProps = {
	columnFilter?: any;
	totalItems?: number;
	allItemCount?: number;
	rowsLength?: number;
} & PageSizeOptionsProps;

function LeftSidePagination({
	pageSizeOptions,
	totalItems,
	rowsLength,
	setPageSize,
	pageSize,
}: LeftSidePaginationProps) {
	return (
		<div className="flex flex-row items-baseline space-x-[10px]">
			<p className="text-sm">Show</p>
			<PageSizeOptions
				pageSizeOptions={pageSizeOptions}
				setPageSize={setPageSize}
				pageSize={pageSize}
			/>
			<p className="text-sm">
				{`Entries. Showing ${rowsLength} of ${totalItems} data `}
			</p>
		</div>
	);
}

function GoToPagination<T>({
	maxPage,
	table,
}: {
	maxPage: number;
	table: Table<T>;
}) {
	const [goto, setGoto] = useState<string | number>("");

	return (
		<div className="relative">
			<Input
				value={goto}
				onChange={(event) => {
					const value = event.target.value;
					const numericValue = Number(value);

					if (Boolean(numericValue)) {
						if (numericValue < 1) {
							setGoto(1);
						} else if (numericValue > maxPage) {
							setGoto(maxPage);
						} else {
							setGoto(value);
						}
					} else {
						setGoto("");
					}
				}}
				onKeyDown={(event) => {
					if (event.key === "Enter" && !!Number(goto)) {
						table.setPageIndex(Number(goto) - 1);
					}
				}}
				className={cn(
					"h-[30px] w-[60px] border border-[#ababab] rounded-[4px] text-center text-sm px-1 pr-8",
					"focus-visible:ring-0"
				)}
			/>
			<Button
				onClick={() => {
					if (!!Number(goto)) {
						table.setPageIndex(Number(goto) - 1);
					}
				}}
				aria-label="search"
				variant="default"
				className="absolute bg-transparent top-1/2 right-1 transform -translate-y-1/2 h-5 w-5 p-2 flex items-center justify-center cursor-pointer"
			>
				<Search className="text-hmmi-grey-400" />
			</Button>
		</div>
	);
}

const ButtonPagination = ({
	isSelected,
	...props
	// biome-ignore lint/correctness/noUndeclaredVariables: <explanation>
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
	isSelected?: boolean;
}) => {
	return (
		<Button
			{...props}
			variant={isSelected ? "default" : "outline"}
			className={cn(
				"text-sm min-w-[20px] h-[30px] rounded-md border transition",
				isSelected
					? "bg-hmmi-primary-900 text-white border-transparent"
					: "border-gray-300 hover:border-gray-400",
				"disabled:bg-hmmi-grey-300 disabled:text-black"
			)}
			disabled={isSelected}
		/>
	);
};

export function DataTablePagination<T extends RowData>({
	table,
	pagination = {
		hidePagination: false,
	},
}: DataTablePaginationProps<T>) {
	let i = 0;

	if (pagination.hidePagination) {
		return null;
	}

	const columnFilter = table.getState().columnFilters;

	return (
		<div className="flex items-center justify-between p-4 bg-white">
			<div className="flex items-center gap-2">
				{!pagination.hidePageSizeOptions &&
				table.getPageOptions().length > 0 ? (
					<LeftSidePagination
						columnFilter={columnFilter}
						pageSizeOptions={pagination.pageSizeOptions}
						totalItems={pagination.totalItems}
						allItemCount={pagination.allItemCount}
						rowsLength={table.getRowModel().rows.length}
						setPageSize={table.setPageSize}
						pageSize={table.getState().pagination.pageSize}
					/>
				) : null}
			</div>
			<div className="flex items-center gap-1">
				{!pagination.hidePageNavigation && (
					<>
						{table.getCanPreviousPage() && (
							<>
								<ButtonPagination
									data-testid="buttonPaginationFirstPage"
									onClick={() => table.setPageIndex(0)}
								>
									<ChevronsLeft className="w-4 h-4" />
								</ButtonPagination>
								<ButtonPagination
									data-testid="buttonPaginationPrev"
									onClick={table.previousPage}
								>
									<ChevronLeft className="w-4 h-4" />
								</ButtonPagination>
							</>
						)}

						{table.getPageOptions().map((num) => {
							const pageRangeDisplay = pagination.pageRangeDisplayed ?? 5;
							const { pageIndex } = table.getState().pagination;
							if (num >= pageIndex) {
								i += 1;
								if (i <= pageRangeDisplay) {
									return (
										<ButtonPagination
											data-testid={`buttonPagination#${num + 1}`}
											key={num}
											onClick={() => table.setPageIndex(num)}
											isSelected={pageIndex === num}
										>
											{num + 1}
										</ButtonPagination>
									);
								}
							}
							return null;
						})}

						{table.getCanNextPage() && (
							<>
								<ButtonPagination
									data-testid="buttonPaginationNext"
									onClick={table.nextPage}
								>
									<ChevronRight className="w-4 h-4" />
								</ButtonPagination>
								<ButtonPagination
									data-testid="buttonPaginationLastPage"
									onClick={() => table.setPageIndex(table.getPageCount() - 1)}
								>
									<ChevronsRight className="w-4 h-4" />
								</ButtonPagination>
							</>
						)}
						{!pagination.hidePageSearch && (
							<>
								<Separator orientation="vertical" className="mx-2 h-5" />
								<div className="flex items-center gap-1">
									<p className="text-sm ">Go to Page</p>

									<GoToPagination
										maxPage={table.getPageOptions().length}
										table={table}
									/>

									<p className="text-sm">
										{`Max ${table.getPageOptions().length}`}
									</p>
								</div>
							</>
						)}
					</>
				)}
			</div>
		</div>
	);
}

type PageSizeOptionsProps = {
	placeholder?: string;
	pageSizeOptions?: number[];
	setPageSize?: (pageSize: number) => void;
	pageSize?: number;
};

function PageSizeOptions({
	pageSizeOptions = [10, 50, 100],
	setPageSize,
	pageSize,
}: PageSizeOptionsProps) {
	return (
		<Select
			value={pageSize ? String(pageSize) : ""}
			onValueChange={(value) => setPageSize && setPageSize(Number(value))}
		>
			<SelectTrigger
				className={cn(
					"text-sm py-[4px] px-[12px] shadow-md border-none w-16 h-8",
					"focus:outline-none focus:ring-0 focus:ring-offset-0"
				)}
			>
				<SelectValue placeholder="Select page size" />
			</SelectTrigger>
			<SelectContent>
				{pageSizeOptions.map((size) => (
					<SelectItem key={size} value={String(size)} className="text-[0.9rem]">
						{size}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
