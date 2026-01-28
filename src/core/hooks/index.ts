/**
 * Custom Query Hooks - Enterprise Edition
 * 
 * This module provides a comprehensive replacement for React Query
 * with enterprise-grade features including:
 * - Custom caching with ICacheProvider integration
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

// Re-export for convenience
export type { ICacheProvider, CacheConfig, CacheStats } from '@/core/cache';
