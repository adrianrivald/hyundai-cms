import {
	type RouteConfig,
	index,
	route,
	layout,
	prefix,
} from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),
	route("login", "./routes/login.tsx"),
	layout("./routes/__layout/__auth.layout.tsx", [
		...prefix("post", [
			route("list", "./routes/post-list.tsx"),
			route("detail/:id", "./routes/post-detail.tsx"),
		]),
	]),
	route("dev", "./routes/dev.tsx"),
] satisfies RouteConfig;
