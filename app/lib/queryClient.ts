import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			//staleTime: 1000 * 60 * 5, // 5 minutes
			refetchInterval: false,
			refetchOnWindowFocus: false,
			refetchOnMount: false,
			refetchIntervalInBackground: false,
			retryOnMount: false,
			retry: false,
			staleTime: 30000,
		},
		mutations: {
			retry: false,
			retryDelay: 0,
		},
	},
});
