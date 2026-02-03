import { useCustomQuery, useCustomMutation, useCustomInfiniteQuery } from '@/core/hooks';
import { useAuthStore } from '@/core/store/zustand';
import { useDIContainer } from '@/core/modules/dependency-injection';
import { TYPES } from '@/core/modules/dependency-injection/types';
import type { FeedDataService } from '../FeedDataService';
import { createInfiniteQueryConfig, createPostInfiniteQueryConfig, createCommentInfiniteQueryConfig } from './paginationUtils';
import { createMutationConfig, createPostMutationConfig, createCommentMutationConfig, createInteractionMutationConfig } from './mutationUtils';
import { CACHE_TIME_MAPPINGS } from '@/core/hooks/migrationUtils';

/**
 * Hook factory utilities for creating standardized feed hooks
 * Eliminates DRY violations and provides consistent patterns
 */

/**
 * Creates standardized query hook with auth and service injection
 */
export const createQueryHook = <T>(
  queryKey: string[],
  queryFn: (feedDataService: FeedDataService, authData: any) => Promise<T>,
  options: any = {}
) => {
  const { data: authData, isAuthenticated } = useAuthStore();
  const feedDataService = useFeedDataService();

  return useCustomQuery(
    queryKey,
    () => queryFn(feedDataService, authData),
    {
      enabled: isAuthenticated,
      ...options
    }
  );
};

/**
 * Creates standardized infinite query hook with pagination
 */
export const createInfiniteQueryHook = <T>(
  queryKey: string[],
  queryFn: (feedDataService: FeedDataService, authData: any, pageParam: number) => Promise<T>,
  paginationOptions: { limit?: number; type?: 'feed' | 'post' | 'comment' | 'search' } = {},
  options: any = {}
) => {
  const { data: authData, isAuthenticated } = useAuthStore();
  const feedDataService = useFeedDataService();
  const { limit = 20, type = 'feed' } = paginationOptions;

  let paginationConfig;
  switch (type) {
    case 'post':
      paginationConfig = createPostInfiniteQueryConfig(limit);
      break;
    case 'comment':
      paginationConfig = createCommentInfiniteQueryConfig(limit);
      break;
    case 'search':
      paginationConfig = createInfiniteQueryConfig({ limit, staleTime: 30 * 1000, cacheTime: 2 * 60 * 1000 });
      break;
    default:
      paginationConfig = createInfiniteQueryConfig({ limit });
  }

  return useCustomInfiniteQuery(
    queryKey,
    async ({ pageParam = 0 }) => {
      return await queryFn(feedDataService, authData, pageParam + 1);
    },
    {
      enabled: isAuthenticated,
      ...paginationConfig,
      ...options
    }
  );
};

/**
 * Creates standardized mutation hook with error handling
 */
export const createMutationHook = <TVariables, TData>(
  mutationFn: (feedDataService: FeedDataService, authData: any, variables: TVariables) => Promise<TData>,
  operationName: string,
  options: { onSuccessCallback?: () => void; customErrorHandler?: (error: any) => void } = {}
) => {
  const { data: authData } = useAuthStore();
  const feedDataService = useFeedDataService();

  const mutationConfig = options.customErrorHandler
    ? createMutationConfig({ operationName, ...options })
    : createPostMutationConfig(operationName, options.onSuccessCallback);

  return useCustomMutation(
    (variables: TVariables) => mutationFn(feedDataService, authData, variables),
    mutationConfig
  );
};

/**
 * Creates standardized post mutation hook
 */
export const createPostMutationHook = <TVariables>(
  mutationFn: (feedDataService: FeedDataService, authData: any, variables: TVariables) => Promise<any>,
  operationName: string,
  onSuccessCallback?: () => void
) => createMutationHook(mutationFn, operationName, { onSuccessCallback });

/**
 * Creates standardized comment mutation hook
 */
export const createCommentMutationHook = <TVariables>(
  mutationFn: (feedDataService: FeedDataService, authData: any, variables: TVariables) => Promise<any>,
  operationName: string,
  onSuccessCallback?: () => void
) => createMutationHook(mutationFn, operationName, { onSuccessCallback });

/**
 * Creates standardized interaction mutation hook
 */
export const createInteractionMutationHook = <TVariables>(
  mutationFn: (feedDataService: FeedDataService, authData: any, variables: TVariables) => Promise<any>,
  operationName: string
) => createMutationHook(mutationFn, operationName, { customErrorHandler: (error) => console.error(`Error ${operationName} post:`, error) });

/**
 * Hook for accessing FeedDataService via DI (singleton pattern)
 */
export const useFeedDataService = (): FeedDataService => {
  const container = useDIContainer();
  return container.getByToken(TYPES.FEED_DATA_SERVICE);
};
