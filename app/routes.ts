import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),
	route("post-list", "./routes/post-list.tsx"),
] satisfies RouteConfig;
