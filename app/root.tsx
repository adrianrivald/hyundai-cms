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
import AuthenticationPage from "./components/authentication";
import { useEffect } from "react";

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
  // PWA manifest
  { rel: "manifest", href: "/manifest.json" },
  // PWA icons
  {
    rel: "icon",
    href: "/icons/icon-192x192.png",
    sizes: "192x192",
    type: "image/png",
  },
  {
    rel: "icon",
    href: "/icons/icon-512x512.png",
    sizes: "512x512",
    type: "image/png",
  },
  { rel: "apple-touch-icon", href: "/icons/icon-192x192.png" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* PWA Meta Tags */}
        <meta name="theme-color" content="#153263" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Hyundai QR" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Hyundai QR" />
        <meta name="msapplication-TileColor" content="#153263" />
        <meta name="msapplication-tap-highlight" content="no" />
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

  // Register service worker for PWA functionality
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registered successfully:", registration);
        })
        .catch((error) => {
          console.log("Service Worker registration failed:", error);
        });
    }
  }, []);

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
