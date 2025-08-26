import { DataTable } from "@/components/layout/table/data-table";
import { useListSocialMedia } from "../_functions/hooks/use-list-social-media";

const ListSocialMedia = () => {
	const { table } = useListSocialMedia();
	return (
		<div className="">
			<DataTable table={table} showPagination={false} />
		</div>
	);
};

export default ListSocialMedia;
