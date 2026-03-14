import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

// Query Keys for type-safe query invalidation
export const queryKeys = {
  books: {
    all: ['books'],
    lists: () => [...queryKeys.books.all, 'list'],
    list: (filters) => [...queryKeys.books.lists(), filters],
    available: () => [...queryKeys.books.all, 'available'],
    details: () => [...queryKeys.books.all, 'detail'],
    detail: (id) => [...queryKeys.books.details(), id],
    userBooks: (userId) => [...queryKeys.books.all, 'user', userId],
    search: (query) => [...queryKeys.books.all, 'search', query],
  },
  requests: {
    all: ['requests'],
    incoming: (userId) => [...queryKeys.requests.all, 'incoming', userId],
    outgoing: (userId) => [...queryKeys.requests.all, 'outgoing', userId],
  },
  users: {
    all: ['users'],
    detail: (id) => [...queryKeys.users.all, id],
    me: () => [...queryKeys.users.all, 'me'],
  },
};

