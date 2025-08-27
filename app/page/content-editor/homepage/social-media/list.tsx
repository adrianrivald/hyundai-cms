import { DataTable } from "@/components/layout/table/data-table";
import { useListSocialMedia } from "../_functions/hooks/use-list-social-media";
import Container from "@/components/container";

const ListSocialMedia = () => {
	const { table } = useListSocialMedia();
	return (
		<Container className="">
			<DataTable table={table} showPagination={false} />
		</Container>
	);
};

export default ListSocialMedia;
