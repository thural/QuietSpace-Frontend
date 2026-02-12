/**
 * Query Hooks - Enterprise Edition
 *
 * Provides comprehensive query management hooks including:
 * - Custom query hooks with caching integration
 * - Mutation hooks with optimistic updates
 * - Infinite query hooks for pagination
 * - Query state management hooks
 * - WebSocket cache integration
 */

export { useCustomQuery } from './useCustomQuery';
export type { QueryOptions, QueryState, CustomQueryResult } from './useCustomQuery';

export { useCustomMutation } from './useCustomMutation';
export type { MutationOptions, MutationState, CustomMutationResult } from './useCustomMutation';

export { useCustomInfiniteQuery } from './useCustomInfiniteQuery';
export type {
  InfiniteQueryOptions,
  InfiniteQueryPage,
  InfiniteQueryState,
  CustomInfiniteQueryResult
} from './useCustomInfiniteQuery';

export {
  useQueryState,
  useIsFetching,
  useIsMutating,
  useGlobalLoading,
  useQuerySubscription,
  useMutationSubscription,
  useQueryStateStore
} from './useQueryState';
export type { GlobalQueryState } from './useQueryState';

export { useWebSocketCacheUpdater } from './useWebSocketCacheUpdater';
export type { WebSocketCacheUpdaterOptions } from './useWebSocketCacheUpdater';
