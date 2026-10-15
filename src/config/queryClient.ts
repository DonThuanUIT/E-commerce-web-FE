import { QueryClient } from '@tanstack/react-query';

/**
 * Global QueryClient instance configured for caching and server state synchronization.
 *
 * Configured with 5-minute staleTime to avoid unnecessary refetches when navigating.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
