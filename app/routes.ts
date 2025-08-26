import {
	type RouteConfig,
	index,
	route,
	layout,
	prefix,
} from "@react-router/dev/routes";

export default [
	route("login", "./routes/login.tsx"),
	layout("./routes/__layout/__auth.layout.tsx", [
		index("./routes/guard-route/dashboard/index.tsx"),
		route("calendar", "./routes/guard-route/calendar/index.tsx"),

		...prefix("user-management", [
			index("./routes/guard-route/user-management/index.tsx"),
		]),
		...prefix("report", [
			route(
				"activity-report",
				"./routes/guard-route/report/report-activity/index.tsx"
			),
			route(
				"registration-report",
				"./routes/guard-route/report/report-registration/index.tsx"
			),
			route("user-report", "./routes/guard-route/report/report-user/index.tsx"),
			route(
				"visitor-report",
				"./routes/guard-route/report/report-visitor/index.tsx"
			),
		]),

		...prefix("content-editor", [
			route("homepage", "./routes/guard-route/content-editor/homepage.tsx"),
		]),

		...prefix("post", [
			route("detail/:id", "./routes/guard-route/post/post-detail.tsx"),
		]),
	]),

	...prefix("qr-scan", [index("./routes/guard-route/qr-scan/index.tsx")]),
	route("dev", "./routes/dev.tsx"),
	route("not-authorized", "routes/not-authorized.tsx"),
] satisfies RouteConfig;
