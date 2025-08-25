import { Skeleton } from "@/components/ui/skeleton";
import { TableCell } from "@/components/ui/table";
import { Fragment } from "react";

export const DataTableCellSkeleton = ({
	cellLength,
}: {
	cellLength: number;
}) => {
	return (
		<Fragment>
			{Array.from({ length: cellLength }).map((_, j) => (
				<TableCell key={j} className="p-[5px] h-[52px]">
					<Skeleton />
				</TableCell>
			))}
		</Fragment>
	);
};
