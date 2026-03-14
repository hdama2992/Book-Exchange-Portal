import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookService } from '../services/api';
import { queryKeys } from '../lib/queryClient';

// Fetch all available books
export function useAvailableBooks() {
  return useQuery({
    queryKey: queryKeys.books.available(),
    queryFn: bookService.getAvailableBooks,
  });
}

// Fetch all books
export function useAllBooks() {
  return useQuery({
    queryKey: queryKeys.books.lists(),
    queryFn: bookService.getAllBooks,
  });
}

// Fetch single book
export function useBook(bookId) {
  return useQuery({
    queryKey: queryKeys.books.detail(bookId),
    queryFn: () => bookService.getBookById(bookId),
    enabled: !!bookId,
  });
}

// Fetch user's books
export function useUserBooks(userId) {
  return useQuery({
    queryKey: queryKeys.books.userBooks(userId),
    queryFn: () => bookService.getUserBooks(userId),
    enabled: !!userId,
  });
}

// Search books
export function useSearchBooks(query) {
  return useQuery({
    queryKey: queryKeys.books.search(query),
    queryFn: () => bookService.searchBooks(query),
    enabled: query?.length > 0,
  });
}

// Publish book mutation
export function usePublishBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookData, userId }) => bookService.publishBook(bookData, userId),
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: queryKeys.books.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.books.userBooks(variables.userId) });
    },
  });
}

// Update book mutation
export function useUpdateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookId, bookData }) => bookService.updateBook(bookId, bookData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.books.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.books.detail(variables.bookId) });
    },
  });
}

// Delete book mutation
export function useDeleteBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookId) => bookService.deleteBook(bookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.books.all });
    },
  });
}

