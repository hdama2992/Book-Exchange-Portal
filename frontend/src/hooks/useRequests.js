import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { requestService } from '../services/api';
import { queryKeys } from '../lib/queryClient';

// Fetch incoming requests (requests to my books)
export function useIncomingRequests(userId) {
  return useQuery({
    queryKey: queryKeys.requests.incoming(userId),
    queryFn: () => requestService.getIncomingRequests(userId),
    enabled: !!userId,
  });
}

// Fetch outgoing requests (my requests to others)
export function useOutgoingRequests(userId) {
  return useQuery({
    queryKey: queryKeys.requests.outgoing(userId),
    queryFn: () => requestService.getMyRequests(userId),
    enabled: !!userId,
  });
}

// Create request mutation
export function useCreateRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestData) => requestService.createRequest(requestData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.requests.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.books.all });
    },
  });
}

// Approve request mutation
export function useApproveRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requestId, ownerId }) => requestService.approveRequest(requestId, ownerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.requests.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.books.all });
    },
  });
}

// Reject request mutation
export function useRejectRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requestId, ownerId, reason }) =>
      requestService.rejectRequest(requestId, ownerId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.requests.all });
    },
  });
}

// Mark as returned mutation
export function useMarkAsReturned() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requestId, ownerId }) => requestService.markAsReturned(requestId, ownerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.requests.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.books.all });
    },
  });
}

