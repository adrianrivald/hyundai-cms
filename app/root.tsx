import {
	isRouteErrorResponse,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useNavigation,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "./lib/queryClient";
import { NotistackProvider } from "./components/notistack-provider";
import { LoadingIndicator } from "./components/loading-indicator";
import NotFound from "./components/not-found";
import Cookies from "js-cookie";
import { Typography } from "./components/typography";
import { useForm } from "react-hook-form";
import FormProvider from "./components/RHForm/FormProvider";
import RHFTextField from "./components/RHForm/RHFTextField";
import { Button } from "./components/ui/button";
import AuthenticationPage from "./components/authentication";

export const links: Route.LinksFunction = () => [
	{ rel: "preconnect", href: "https://fonts.googleapis.com" },
	{
		rel: "preconnect",
		href: "https://fonts.gstatic.com",
		crossOrigin: "anonymous",
	},
	{
		rel: "stylesheet",
		href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
	},
];

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>

			<body>
				<NotistackProvider>
					<QueryClientProvider client={queryClient}>
						{children}
						<ReactQueryDevtools initialIsOpen={false} />
					</QueryClientProvider>
				</NotistackProvider>

				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	const navigation = useNavigation();
	const isNavigating = Boolean(navigation.location);
	const isAnyCookies = Cookies.get("hmmi_cookies");

	if (!isAnyCookies) {
		return <AuthenticationPage />;
	}

	return (
		<>
			{isNavigating && <LoadingIndicator />}
			<Outlet />
		</>
	);
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	let message = "Oops!";
	let details = "An unexpected error occurred.";
	let stack: string | undefined;

	if (isRouteErrorResponse(error)) {
		if (error.status === 404) {
			return <NotFound />;
		} else {
			message = "Error";
			details = error.statusText || details;
		}
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		details = error.message;
		stack = error.stack;
	}

	return (
		<main className="pt-16 p-4 container mx-auto">
			<h1>{message}</h1>
			<p>{details}</p>
			{stack && (
				<pre className="w-full p-4 overflow-x-auto">
					<code>{stack}</code>
				</pre>
			)}
		</main>
	);
}
