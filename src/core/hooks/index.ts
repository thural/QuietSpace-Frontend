/**
 * Custom Hooks - Enterprise Edition
 *
 * This module provides comprehensive hooks for enterprise-grade features including:
 * - Custom query hooks with ICacheProvider integration
 * - WebSocket hooks for real-time communication
 * - Authentication hooks for enterprise auth
 * - Dependency injection container support
 * - Global state management with Zustand
 * - Optimistic updates and rollback
 * - Retry logic with exponential backoff
 * - Background refetching and invalidation
 * - Type-safe interfaces throughout
 */

// Core query hooks
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

// Global state management
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

// WebSocket hooks
export {
  useEnterpriseWebSocket,
  useFeatureWebSocket,
  useWebSocketConnection,
  useWebSocketMetrics
} from './useWebSocket';
export type {
  UseEnterpriseWebSocketOptions,
  UseFeatureWebSocketOptions,
  WebSocketConnectionState,
  WebSocketMetrics
} from './useWebSocket';

// Authentication hooks
export {
  useEnterpriseAuth,
  useFeatureAuth,
  useReactiveFeatureAuth
} from './useAuthentication';

// Re-export for convenience
export type { ICacheProvider, CacheConfig, CacheStats } from '@/core/cache';
