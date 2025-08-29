import { TableHeader, TableRow } from "@/components/ui/table";
import type { HeaderGroup, RowData } from "@tanstack/react-table";
import DataTableHeadCell from "./data-table-head-cell";

export default function DataTableHead<T extends RowData>({
	headerGroups,
}: {
	headerGroups: HeaderGroup<T>[];
}) {
	return (
		<TableHeader className="">
			{headerGroups.map((headerGroup) => (
				<TableRow key={headerGroup.id}>
					{headerGroup.headers.map((header, index) => {
						return (
							<DataTableHeadCell
								key={header.id}
								header={header}
								index={index}
								totalHeaders={headerGroup.headers.length}
							/>
						);
					})}
				</TableRow>
			))}
		</TableHeader>
	);
}
