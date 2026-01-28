import { useCallback, useEffect, useMemo } from 'react';
import { useDIContainer } from '@/core/di';
import { TYPES } from '@/core/di/types';
import type { ICacheProvider } from '@/core/cache';
import type { IWebSocketService } from '@/core/websocket/types';
import { useCustomQuery, useCustomMutation, useCustomInfiniteQuery } from '@/core/hooks';
import type { 
  QueryOptions, 
  MutationOptions, 
  InfiniteQueryOptions 
} from '@/core/hooks';
import { FeedDataLayer } from '@/features/feed/data/FeedDataLayer';

/**
 * Feed Data Layer Hook
 * 
 * Provides React hooks that integrate with the FeedDataLayer service
 * following the 7-layer architecture: Component → Hook → DI → Service → Data → Cache/Repository/WebSocket
 * 
 * This hook bridges the gap between React components and the intelligent data coordination layer
 */
export function useFeedDataLayer() {
  const container = useDIContainer();
  const cache = container.getByToken<ICacheProvider>(TYPES.CACHE_SERVICE);
  const webSocket = container.getByToken<IWebSocketService>(TYPES.WEBSOCKET_SERVICE);

  // Create data layer instance
  const dataLayer = useMemo(() => new FeedDataLayer(), []);

  // Cache configuration for optimal performance
  const CACHE_CONFIG = {
    // Real-time feed data - very short stale time
    FEED_REALTIME: {
      staleTime: 15 * 1000, // 15 seconds
      cacheTime: 2 * 60 * 1000, // 2 minutes
      refetchInterval: 30 * 1000, // 30 seconds
    },
    // Posts - medium stale time
    POSTS: {
      staleTime: 60 * 1000, // 1 minute
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchInterval: 2 * 60 * 1000, // 2 minutes
    },
    // Comments - shorter stale time
    COMMENTS: {
      staleTime: 30 * 1000, // 30 seconds
      cacheTime: 5 * 60 * 1000, // 5 minutes
      refetchInterval: 60 * 1000, // 1 minute
    },
    // User interactions - very short stale time
    INTERACTIONS: {
      staleTime: 10 * 1000, // 10 seconds
      cacheTime: 60 * 1000, // 1 minute
      refetchInterval: 15 * 1000, // 15 seconds
    },
  } as const;

  /**
   * Get feed posts with intelligent caching and WebSocket integration
   */
  const useFeedPosts = (options: {
    page?: number;
    limit?: number;
    userId?: string;
    filters?: any;
  } = {}) => {
    const { page = 1, limit = 20, userId, filters } = options;
    const queryKey = ['feed', userId || 'global', page, limit, filters];

    return useCustomQuery(
      queryKey,
      () => dataLayer.getFeedPosts(options),
      {
        ...CACHE_CONFIG.FEED_REALTIME,
        enabled: true,
      }
    );
  };

  /**
   * Get infinite feed posts with pagination
   */
  const useInfiniteFeedPosts = (options: {
    limit?: number;
    userId?: string;
    filters?: any;
  } = {}) => {
    const { limit = 20, userId, filters } = options;
    const queryKey = ['feed', 'infinite', userId || 'global', limit, filters];

    return useCustomInfiniteQuery(
      queryKey,
      ({ pageParam = 1 }) => dataLayer.getFeedPosts({
        ...options,
        page: pageParam,
      }).then(posts => ({
        data: posts,
        hasNextPage: posts.length === limit,
        hasPreviousPage: pageParam > 1,
      })),
      {
        ...CACHE_CONFIG.FEED_REALTIME,
        getNextPageParam: (lastPage, allPages) => {
          if (lastPage.data.length < limit) return undefined;
          return allPages.length + 1;
        },
        getPreviousPageParam: (firstPage, allPages) => {
          if (allPages.length <= 1) return undefined;
          return allPages.length - 1;
        },
      }
    );
  };

  /**
   * Get post details with caching
   */
  const usePost = (postId: string, options: QueryOptions = {}) => {
    const queryKey = ['post', postId];

    return useCustomQuery(
      queryKey,
      () => dataLayer.getPost(postId),
      {
        ...CACHE_CONFIG.POSTS,
        enabled: !!postId,
        ...options,
      }
    );
  };

  /**
   * Get post comments with caching
   */
  const usePostComments = (postId: string, options: {
    page?: number;
    limit?: number;
  } = {}) => {
    const { page = 1, limit = 50 } = options;
    const queryKey = ['comments', postId, page, limit];

    return useCustomQuery(
      queryKey,
      () => dataLayer.getPostComments(postId, options),
      {
        ...CACHE_CONFIG.COMMENTS,
        enabled: !!postId,
      }
    );
  };

  /**
   * Get infinite post comments
   */
  const useInfinitePostComments = (postId: string, options: {
    limit?: number;
  } = {}) => {
    const { limit = 50 } = options;
    const queryKey = ['comments', postId, 'infinite', limit];

    return useCustomInfiniteQuery(
      queryKey,
      ({ pageParam = 1 }) => dataLayer.getPostComments(postId, {
        ...options,
        page: pageParam,
      }).then(comments => ({
        data: comments,
        hasNextPage: comments.length === limit,
        hasPreviousPage: pageParam > 1,
      })),
      {
        ...CACHE_CONFIG.COMMENTS,
        getNextPageParam: (lastPage, allPages) => {
          if (lastPage.data.length < limit) return undefined;
          return allPages.length + 1;
        },
        enabled: !!postId,
      }
    );
  };

  /**
   * Create a new post with optimistic updates
   */
  const useCreatePost = (options: MutationOptions = {}) => {
    return useCustomMutation(
      (postData: any) => dataLayer.createPost(postData),
      {
        ...options,
        invalidateQueries: [['feed']],
        optimisticUpdate: true,
        websocketEvents: ['post.created'],
      }
    );
  };

  /**
   * Update post with optimistic updates
   */
  const useUpdatePost = (options: MutationOptions = {}) => {
    return useCustomMutation(
      ({ postId, updateData }: { postId: string; updateData: any }) => 
        dataLayer.updatePost(postId, updateData),
      {
        ...options,
        invalidateQueries: (variables) => [
          ['post', variables.postId],
          ['feed'],
        ],
        optimisticUpdate: true,
        websocketEvents: ['post.updated'],
      }
    );
  };

  /**
   * Like/unlike post with real-time updates
   */
  const useTogglePostLike = (options: MutationOptions = {}) => {
    return useCustomMutation(
      ({ postId, userId }: { postId: string; userId: string }) => 
        dataLayer.togglePostLike(postId, userId),
      {
        ...options,
        invalidateQueries: (variables) => [
          ['post', variables.postId],
          ['feed'],
        ],
        optimisticUpdate: true,
        websocketEvents: ['post.like.updated'],
      }
    );
  };

  /**
   * Add comment with optimistic updates
   */
  const useAddComment = (options: MutationOptions = {}) => {
    return useCustomMutation(
      ({ postId, commentData }: { postId: string; commentData: any }) => 
        dataLayer.addComment(postId, commentData),
      {
        ...options,
        invalidateQueries: (variables) => [
          ['comments', variables.postId],
          ['post', variables.postId],
        ],
        optimisticUpdate: true,
        websocketEvents: ['comment.created'],
      }
    );
  };

  /**
   * Manual cache operations for advanced use cases
   */
  const cacheOperations = {
    /**
     * Manually update cache entries
     */
    updateCache: useCallback(<T>(key: string | string[], data: T, ttl?: number) => {
      const cacheKey = Array.isArray(key) ? key.join(':') : key;
      const defaultTtl = CACHE_CONFIG.POSTS.cacheTime;
      cache.set(cacheKey, data, ttl || defaultTtl);
    }, [cache]),

    /**
     * Manually invalidate cache entries
     */
    invalidateCache: useCallback((key: string | string[]) => {
      const cacheKey = Array.isArray(key) ? key.join(':') : key;
      cache.invalidate(cacheKey);
    }, [cache]),

    /**
     * Get cache statistics for monitoring
     */
    getCacheStats: useCallback(() => {
      return cache.getStats();
    }, [cache]),

    /**
     * Set data manually for a specific query
     */
    setQueryData: useCallback(<T>(queryKey: string[], data: T) => {
      const cacheKey = queryKey.join(':');
      cache.set(cacheKey, data, CACHE_CONFIG.POSTS.cacheTime);
    }, [cache]),

    /**
     * Get cached data for a specific query
     */
    getQueryData: useCallback(<T>(queryKey: string[]): T | undefined => {
      const cacheKey = queryKey.join(':');
      const entry = cache.getEntry(cacheKey);
      return entry?.data as T;
    }, [cache]),
  };

  /**
   * WebSocket operations for real-time features
   */
  const webSocketOperations = {
    /**
     * Send WebSocket message
     */
    sendMessage: useCallback((message: any) => {
      return webSocket.send({
        ...message,
        timestamp: Date.now(),
      });
    }, [webSocket]),

    /**
     * Subscribe to WebSocket topic
     */
    subscribe: useCallback((topic: string, handler: (message: any) => void) => {
      return webSocket.subscribe(topic, handler);
    }, [webSocket]),

    /**
     * Check WebSocket connection status
     */
    isConnected: useCallback(() => {
      return webSocket.isConnected();
    }, [webSocket]),
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clean up WebSocket listeners and cache entries
      dataLayer.invalidateCache('feed:*');
      dataLayer.invalidateCache('post:*');
      dataLayer.invalidateCache('comments:*');
    };
  }, [dataLayer]);

  return {
    // Query hooks
    useFeedPosts,
    useInfiniteFeedPosts,
    usePost,
    usePostComments,
    useInfinitePostComments,

    // Mutation hooks
    useCreatePost,
    useUpdatePost,
    useTogglePostLike,
    useAddComment,

    // Utility operations
    cacheOperations,
    webSocketOperations,

    // Data layer instance for advanced usage
    dataLayer,
  };
}

/**
 * Hook for specific feed operations
 */
export function useFeedOperations() {
  const {
    useFeedPosts,
    useCreatePost,
    useTogglePostLike,
    useAddComment,
    cacheOperations,
  } = useFeedDataLayer();

  // Get feed posts
  const feedQuery = useFeedPosts();

  // Create post mutation
  const createPostMutation = useCreatePost({
    onSuccess: () => {
      // Invalidate feed cache to show new post
      cacheOperations.invalidateCache(['feed']);
    },
  });

  // Toggle like mutation
  const toggleLikeMutation = useTogglePostLike({
    onSuccess: (data, variables) => {
      // Update specific post cache
      cacheOperations.updateCache(['post', variables.postId], data);
    },
  });

  // Add comment mutation
  const addCommentMutation = useAddComment({
    onSuccess: (data, variables) => {
      // Invalidate comments cache for the post
      cacheOperations.invalidateCache(['comments', variables.postId]);
    },
  });

  return {
    feedQuery,
    createPostMutation,
    toggleLikeMutation,
    addCommentMutation,
    cacheOperations,
  };
}

/**
 * Hook for post-specific operations
 */
export function usePostOperations(postId: string) {
  const {
    usePost,
    usePostComments,
    useUpdatePost,
    useTogglePostLike,
    useAddComment,
    cacheOperations,
  } = useFeedDataLayer();

  // Get post details
  const postQuery = usePost(postId);

  // Get post comments
  const commentsQuery = usePostComments(postId);

  // Update post mutation
  const updatePostMutation = useUpdatePost({
    onSuccess: (data) => {
      // Update post cache
      cacheOperations.updateCache(['post', postId], data);
    },
  });

  // Toggle like mutation
  const toggleLikeMutation = useTogglePostLike({
    onSuccess: (data) => {
      // Update post cache with new like data
      cacheOperations.updateCache(['post', postId], data);
    },
  });

  // Add comment mutation
  const addCommentMutation = useAddComment({
    onSuccess: () => {
      // Invalidate comments cache
      cacheOperations.invalidateCache(['comments', postId]);
    },
  });

  return {
    postQuery,
    commentsQuery,
    updatePostMutation,
    toggleLikeMutation,
    addCommentMutation,
    cacheOperations,
  };
}
