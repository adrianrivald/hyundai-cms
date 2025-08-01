import { usePostList } from "~/api/post";
import type { Route } from "./+types/post-list";
import React, { useEffect } from "react";
import apiConfig from "~/config/api";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

export default function PostList() {
	const { data, isLoading, error } = usePostList({
		queryKey: ["posts"],
	});

	console.log("dataa", data);

	if (isLoading) return <p>Loading...</p>;
	if (error) return <p>Error: {(error as Error).message}</p>;

	return (
		<div>
			hehehe
			{data?.map((item, index) => {
				return <div key={index}>{item?.title} </div>;
			})}
		</div>
	);
}
