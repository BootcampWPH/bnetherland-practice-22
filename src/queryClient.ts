import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, retryDelay: 700, refetchOnWindowFocus: false },
    mutations: { retry: false },
  },
})
