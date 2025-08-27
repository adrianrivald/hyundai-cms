import Container from "@/components/container";
import { DataTable } from "@/components/layout/table/data-table";
import { useListUserManagement } from "./_functions/hooks/use-list-user-management";

const UserManagementPage = () => {
	const { table } = useListUserManagement();
	return (
		<Container>
			<DataTable table={table} showPagination={false} />
		</Container>
	);
};

export default UserManagementPage;
