import {
	type RouteConfig,
	index,
	route,
	layout,
	prefix,
} from "@react-router/dev/routes";

export default [
	index("routes/guard-route/home/home.tsx"),
	route("login", "./routes/login.tsx"),
	layout("./routes/__layout/__auth.layout.tsx", [
		...prefix("post", [
			route("list", "./routes/guard-route/post/post-list.tsx"),
			route("detail/:id", "./routes/guard-route/post/post-detail.tsx"),
		]),
	]),
	route("dev", "./routes/dev.tsx"),
	route("not-authorized", "routes/not-authorized.tsx"),
] satisfies RouteConfig;
