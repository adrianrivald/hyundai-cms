import Container from "@/components/container";
import { Typography } from "@/components/typography";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useNavigate } from "react-router";
import { useListRescheduleApproval } from "./functions/hooks/use-list-reschedule-approval";
import { DataTable } from "@/components/layout/table/data-table";

const ReschedulePage = () => {
	const navigation = useNavigate();
	const { table, metadata } = useListRescheduleApproval();
	return (
		<Container className="bg-white p-6 rounded-md">
			<div className="mb-5">
				<div className="mt flex flex-row gap-4 items-center">
					<div
						onClick={() => {
							navigation("/calendar");
						}}
						className="cursor-pointer"
					>
						<Icon icon="fa7-solid:arrow-left" width="20" height="20" />
					</div>

					<Typography className="text-xl font-bold">
						Schedule Change Request
					</Typography>
				</div>
			</div>
			<DataTable table={table} showPagination={true} pagination={metadata} />
		</Container>
	);
};

export default ReschedulePage;
