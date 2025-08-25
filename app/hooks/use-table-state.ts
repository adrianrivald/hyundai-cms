import type {
	ColumnFiltersState,
	ColumnPinningState,
	PaginationState,
	RowSelectionState,
	SortingState,
	VisibilityState,
} from "@tanstack/react-table";
import { useState } from "react";

interface UseTableStateOptions {
	initialPageSize?: number;
	initialSorting?: SortingState;
	initialColumnFilters?: ColumnFiltersState;
	initialColumnVisibility?: VisibilityState;
	initialColumnPinning?: ColumnPinningState;
	initialGetRowCanExpand?: boolean;
}

export interface TableState {
	sorting: SortingState;
	setSorting: (
		updater: SortingState | ((prev: SortingState) => SortingState)
	) => void;
	columnFilters: ColumnFiltersState;
	setColumnFilters: (
		updater:
			| ColumnFiltersState
			| ((prev: ColumnFiltersState) => ColumnFiltersState)
	) => void;
	pagination: PaginationState;
	setPagination: (
		updater: PaginationState | ((prev: PaginationState) => PaginationState)
	) => void;
	columnVisibility: VisibilityState;
	setColumnVisibility: (
		updater: VisibilityState | ((prev: VisibilityState) => VisibilityState)
	) => void;
	rowSelection: RowSelectionState;
	setRowSelection: (
		updater:
			| RowSelectionState
			| ((prev: RowSelectionState) => RowSelectionState)
	) => void;
	columnPinning: ColumnPinningState;
	setColumnPinning: (
		updater:
			| ColumnPinningState
			| ((prev: ColumnPinningState) => ColumnPinningState)
	) => void;
	getRowCanExpand: () => boolean;
	searchValue: string;
	setSearchValue: (value: string) => void;
}

export function useTableState(options: UseTableStateOptions = {}): TableState {
	const [searchValue, setSearchValue] = useState("");
	const [sorting, setSorting] = useState<SortingState>(
		options.initialSorting ?? []
	);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
		options.initialColumnFilters ?? []
	);
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: options.initialPageSize ?? 10,
	});
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
		options.initialColumnVisibility ?? {}
	);
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
	const [columnPinning, setColumnPinning] = useState<ColumnPinningState>(
		options.initialColumnPinning ?? { left: [], right: [] }
	);

	const getRowCanExpand = () => options.initialGetRowCanExpand ?? false;

	return {
		sorting,
		setSorting,
		columnFilters,
		setColumnFilters,
		pagination,
		setPagination,
		columnVisibility,
		setColumnVisibility,
		rowSelection,
		setRowSelection,
		columnPinning,
		setColumnPinning,
		getRowCanExpand,
		searchValue,
		setSearchValue,
	};
}
