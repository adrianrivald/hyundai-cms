import { usePostList } from "@/api/post";
import Container from "@/components/container";

import { useNavigate } from "react-router";

export default function DashboardPage() {
	const navigate = useNavigate();
	const { data, isLoading, error } = usePostList({
		queryKey: ["posts"],
	});

	if (isLoading) return <p>Loading...</p>;
	if (error) return <p>Error: {(error as Error).message}</p>;

	return (
		<Container>
			{data?.map((item, index) => {
				return (
					<div
						key={index}
						className="p-2 border-2 mb-2 rounded-md cursor-pointer"
						onClick={() => {
							navigate("/post/detail/" + item.id);
						}}
					>
						{item?.title}
					</div>
				);
			})}
		</Container>
	);
}
