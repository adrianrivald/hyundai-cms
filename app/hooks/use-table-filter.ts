import { create } from "zustand";

export interface TableFilterState
	extends Required<
		Pick<any, "Filters" | "Sorts" | "PageSize" | "PageNumber" | "SearchValue">
	> {
	setTableState: (params: Partial<TableFilterState>) => void;
}

export const useTableFilter = create<TableFilterState>((set) => ({
	Filters: null,
	Sorts: null,
	PageSize: 10,
	PageNumber: 1,
	SearchValue: null,

	setTableState: (params) =>
		set((state) => ({
			...state,
			...params,
		})),
}));
