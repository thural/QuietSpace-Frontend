/**
 * Enterprise Infinite Query Types
 * 
 * These types replace React Query's InfiniteData with our enterprise implementation
 */

export interface InfiniteData<TData = unknown> {
  pages: TData[];
  pageParams: unknown[];
}

export interface InfiniteQueryObserverResult<TData = unknown, TError = unknown> {
  data: InfiniteData<TData> | undefined;
  dataUpdatedAt: number;
  error: TError | null;
  errorUpdatedAt: number;
  failureCount: number;
  failureReason: TError | null;
  errorUpdateCount: number;
  isError: boolean;
  isFetched: boolean;
  isFetchedAfterMount: boolean;
  isFetching: boolean;
  isFetchingNextPage: boolean;
  isFetchingPreviousPage: boolean;
  isLoading: boolean;
  isPending: boolean;
  isPlaceholderData: boolean;
  isRefetching: boolean;
  isRefetchingError: boolean;
  isRefetching: boolean;
  isStale: boolean;
  isSuccess: boolean;
  hasNextPage: boolean | undefined;
  hasPreviousPage: boolean | undefined;
  fetchNextPage: () => Promise<void>;
  fetchPreviousPage: () => Promise<void>;
  refetch: () => Promise<void>;
}

export interface QueryObserverResult<TData = unknown, TError = unknown> {
  data: TData | undefined;
  dataUpdatedAt: number;
  error: TError | null;
  errorUpdatedAt: number;
  failureCount: number;
  failureReason: TError | null;
  errorUpdateCount: number;
  isError: boolean;
  isFetched: boolean;
  isFetchedAfterMount: boolean;
  isFetching: boolean;
  isLoading: boolean;
  isPending: boolean;
  isPlaceholderData: boolean;
  isRefetching: boolean;
  isRefetchingError: boolean;
  isStale: boolean;
  isSuccess: boolean;
  refetch: () => Promise<void>;
}

export interface MutationObserverResult<TData = unknown, TError = unknown, TVariables = void> {
  data: TData | undefined;
  dataUpdatedAt: number;
  error: TError | null;
  errorUpdatedAt: number;
  failureCount: number;
  failureReason: TError | null;
  errorUpdateCount: number;
  isError: boolean;
  isIdle: boolean;
  isPending: boolean;
  isSuccess: boolean;
  mutate: (variables: TVariables, options?: { onSuccess?: (data: TData) => void; onError?: (error: TError) => void }) => void;
  mutateAsync: (variables: TVariables) => Promise<TData>;
  reset: () => void;
}
