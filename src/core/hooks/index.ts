/**
 * Core Hooks Index
 *
 * Exports all custom query hooks for use throughout the application
 */

// Export custom query hooks from modules
export { useCustomQuery } from '../modules/hooks/useCustomQuery';
export { useCustomMutation } from '../modules/hooks/useCustomMutation';
export { useCustomInfiniteQuery } from '../modules/hooks/useCustomInfiniteQuery';

// Export types
export type { 
  QueryOptions, 
  QueryState, 
  CustomQueryResult 
} from '../modules/hooks/useCustomQuery';

export type { 
  MutationOptions, 
  MutationState, 
  CustomMutationResult 
} from '../modules/hooks/useCustomMutation';

export type {
  InfiniteQueryOptions,
  InfiniteQueryPage,
  InfiniteQueryState,
  CustomInfiniteQueryResult
} from '../modules/hooks/useCustomInfiniteQuery';
