import { useQuery, useMutation, useInfiniteQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/core/store/zustand';
import { useDIContainer } from '@/core/di';
import { TYPES } from '@/core/di/types';
import type { 
    PostQuery, 
    PostResponse, 
    PostRequest, 
    RepostRequest, 
    VoteBody 
} from '@/features/feed/domain';
import type { FeedPage, FeedItem } from '@/features/feed/data/services/FeedDataService';
import type { ResId } from '@/shared/api/models/common';
import { ConsumerFn } from '@/shared/types/genericTypes';
import { 
  useCustomQuery, 
  useCustomMutation, 
  useCustomInfiniteQuery 
} from '@/core/hooks';
import { 
  CACHE_TIME_MAPPINGS, 
  convertQueryKeyToCacheKey,
  useCacheInvalidation 
} from '@/core/hooks/migrationUtils';

/**
 * CUSTOM FEED SERVICE HOOKS - Migrated from React Query to Custom Query Implementation
 * 
 * This file demonstrates the migration of useFeedService hooks from React Query
 * to our enterprise-grade custom query implementation.
 */

/**
 * Hook for accessing feed feature services via DI
 * This remains the same as it's just DI container access
 */
export const useFeedServicesCustom = () => {
    const container = useDIContainer();
    
    return {
        feedFeatureService: container.getByToken(TYPES.FEED_FEATURE_SERVICE),
        postFeatureService: container.getByToken(TYPES.POST_FEATURE_SERVICE),
        feedDataService: container.getByToken(TYPES.FEED_DATA_SERVICE),
        postDataService: container.getByToken(TYPES.POST_DATA_SERVICE),
        commentDataService: container.getByToken(TYPES.COMMENT_DATA_SERVICE),
    };
};

/**
 * Custom hook for loading feed with business logic and caching
 * Replaces: useFeed (React Query)
 */
export const useFeedCustom = (query: PostQuery = {}) => {
    const { data: authData, isAuthenticated } = useAuthStore();
    const { feedFeatureService } = useFeedServicesCustom();
    const invalidateCache = useCacheInvalidation();

    return useCustomInfiniteQuery(
        ['feed', query],
        async ({ pageParam = 0 }) => {
            const feedQuery = { ...query, page: pageParam };
            return await feedFeatureService.loadFeed(feedQuery, authData.accessToken);
        },
        {
            enabled: isAuthenticated,
            staleTime: CACHE_TIME_MAPPINGS.FEED_STALE_TIME,
            cacheTime: CACHE_TIME_MAPPINGS.FEED_CACHE_TIME,
            refetchInterval: 5 * 60 * 1000, // 5 minutes
            refetchOnMount: true,
            refetchOnWindowFocus: false,
            initialPageParam: 0,
            getNextPageParam: (lastPage, allPages) => {
                return lastPage.pagination.hasNext ? allPages.length : undefined;
            },
            onSuccess: (data, allPages) => {
                console.log('Feed loaded successfully:', { 
                    totalItems: data.length, 
                    totalPages: allPages.length,
                    query 
                });
            },
            onError: (error) => {
                console.error('Error loading feed:', error);
            },
            // Feed is critical data, so we want more aggressive caching
            cacheTime: 15 * 60 * 1000, // 15 minutes
            // Enable background updates for real-time feel
            refetchIntervalInBackground: true
        }
    );
};

/**
 * Custom hook for getting a single post with business logic
 * Replaces: usePost (React Query)
 */
export const usePostCustom = (postId: ResId) => {
    const { data: authData, isAuthenticated } = useAuthStore();
    const { feedDataService } = useFeedServicesCustom();
    const invalidateCache = useCacheInvalidation();

    return useCustomQuery(
        ['post', postId],
        async (): Promise<FeedItem> => {
            return await feedDataService.getPostWithComments(postId, authData.accessToken);
        },
        {
            enabled: isAuthenticated && !!postId,
            staleTime: CACHE_TIME_MAPPINGS.POST_STALE_TIME,
            cacheTime: CACHE_TIME_MAPPINGS.POST_CACHE_TIME,
            refetchInterval: 10 * 60 * 1000, // 10 minutes
            onSuccess: (data) => {
                console.log('Post loaded successfully:', { 
                    postId: data.post.id, 
                    title: data.post.title,
                    commentCount: data.comments.content.length 
                });
            },
            onError: (error) => {
                console.error('Error loading post:', { postId, error: error.message });
            },
            // Posts with comments are expensive to fetch, cache longer
            cacheTime: 20 * 60 * 1000 // 20 minutes
        }
    );
};

/**
 * Custom hook for creating posts with business validation
 * Replaces: useCreatePost (React Query)
 */
export const useCreatePostCustom = (toggleForm?: ConsumerFn) => {
    const { data: authData } = useAuthStore();
    const { feedFeatureService } = useFeedServicesCustom();
    const invalidateCache = useCacheInvalidation();

    return useCustomMutation(
        async (postData: PostRequest): Promise<PostResponse> => {
            return await feedFeatureService.createPostWithValidation(postData, authData.accessToken);
        },
        {
            onSuccess: (data, variables) => {
                console.log('Post created successfully:', data);
                toggleForm?.();
                
                // Invalidate all feed-related caches
                invalidateCache.invalidateFeed();
                
                // Also invalidate user-specific caches
                if (authData?.user?.id) {
                    invalidateCache.invalidateUser(authData.user.id);
                }
            },
            onError: (error, variables) => {
                console.error('Error creating post:', error.message);
                alert(`Error creating post: ${error.message}`);
            },
            retry: 2,
            retryDelay: 1000,
            invalidateQueries: ['feed', 'posts'],
            optimisticUpdate: (cache, variables) => {
                // Create optimistic post
                const optimisticPost: PostResponse = {
                    id: `temp-${Date.now()}`,
                    ...variables,
                    createDate: new Date().toISOString(),
                    updateDate: new Date().toISOString(),
                    userReaction: null,
                    replyCount: 0,
                    repostCount: 0,
                    likeCount: 0,
                    dislikeCount: 0,
                    isRepost: false,
                    originalPostId: null,
                    poll: null,
                    photos: [],
                    tags: [],
                    mentions: []
                };

                // Add to feed cache optimistically
                const feedKey = convertQueryKeyToCacheKey(['feed', {}]);
                const existingFeed = cache.get(feedKey);
                
                if (existingFeed) {
                    const updatedFeed = {
                        ...existingFeed,
                        items: [optimisticPost, ...existingFeed.items],
                        pagination: {
                            ...existingFeed.pagination,
                            total: existingFeed.pagination.total + 1
                        }
                    };
                    cache.set(feedKey, updatedFeed);
                }

                return () => {
                    // Rollback: remove optimistic post
                    console.log('Rolling back post creation');
                };
            }
        }
    );
};

/**
 * Custom hook for updating posts with business validation
 * Replaces: useUpdatePost (React Query)
 */
export const useUpdatePostCustom = (postId: ResId, toggleForm?: ConsumerFn) => {
    const { data: authData } = useAuthStore();
    const { feedFeatureService } = useFeedServicesCustom();
    const invalidateCache = useCacheInvalidation();

    return useCustomMutation(
        async (postData: PostRequest): Promise<PostResponse> => {
            return await feedFeatureService.updatePostWithValidation(postId, postData, authData.accessToken);
        },
        {
            onSuccess: (data, variables) => {
                console.log('Post updated successfully:', data);
                toggleForm?.();
                
                // Invalidate post-specific caches
                invalidateCache.invalidatePost(postId);
                invalidateCache.invalidateFeed();
            },
            onError: (error, variables) => {
                console.error('Error updating post:', error.message);
                alert(`Error updating post: ${error.message}`);
            },
            retry: 2,
            invalidateQueries: (variables) => [
                `post:${postId}`,
                'feed',
                'posts'
            ],
            optimisticUpdate: (cache, variables) => {
                // Optimistically update post in all caches
                const postKey = convertQueryKeyToCacheKey(['post', postId]);
                const existingPost = cache.get(postKey);
                
                if (existingPost) {
                    const updatedPost = {
                        ...existingPost,
                        post: {
                            ...existingPost.post,
                            ...variables,
                            updateDate: new Date().toISOString()
                        }
                    };
                    cache.set(postKey, updatedPost);
                }

                return () => {
                    console.log('Rolling back post update');
                };
            }
        }
    );
};

/**
 * Custom hook for deleting posts with business logic
 * Replaces: useDeletePost (React Query)
 */
export const useDeletePostCustom = () => {
    const { data: authData } = useAuthStore();
    const { feedFeatureService } = useFeedServicesCustom();
    const invalidateCache = useCacheInvalidation();

    return useCustomMutation(
        async ({ postId, userId }: { postId: ResId; userId: ResId }) => {
            return await feedFeatureService.deletePostWithBusinessLogic(postId, userId, authData.accessToken);
        },
        {
            onSuccess: (_, variables) => {
                console.log('Post deleted successfully:', variables);
                
                // Comprehensive cache invalidation
                invalidateCache.invalidatePost(variables.postId);
                invalidateCache.invalidateFeed();
                invalidateCache.invalidateUser(variables.userId);
            },
            onError: (error, variables) => {
                console.error('Error deleting post:', error.message);
            },
            retry: 1,
            invalidateQueries: (variables) => [
                `post:${variables.postId}`,
                'feed',
                'posts',
                `posts:${variables.userId}`
            ],
            optimisticUpdate: (cache, variables) => {
                // Optimistically remove post from all caches
                const postKey = convertQueryKeyToCacheKey(['post', variables.postId]);
                cache.delete(postKey);
                
                const feedKey = convertQueryKeyToCacheKey(['feed', {}]);
                const existingFeed = cache.get(feedKey);
                
                if (existingFeed) {
                    const updatedFeed = {
                        ...existingFeed,
                        items: existingFeed.items.filter(item => item.post.id !== variables.postId),
                        pagination: {
                            ...existingFeed.pagination,
                            total: Math.max(0, existingFeed.pagination.total - 1)
                        }
                    };
                    cache.set(feedKey, updatedFeed);
                }

                return () => {
                    console.log('Rolling back post deletion');
                };
            }
        }
    );
};

/**
 * Custom hook for interacting with posts (like, dislike, save, vote)
 * Enhanced version with more interaction types
 */
export const useInteractWithPostCustom = () => {
    const { data: authData } = useAuthStore();
    const { feedFeatureService } = useFeedServicesCustom();
    const invalidateCache = useCacheInvalidation();

    return useCustomMutation(
        async ({ 
            postId, 
            interactionType, 
            additionalData 
        }: { 
            postId: ResId; 
            interactionType: 'like' | 'dislike' | 'save' | 'vote' | 'share';
            additionalData?: any;
        }) => {
            let result;
            
            switch (interactionType) {
                case 'like':
                case 'dislike':
                    result = await feedFeatureService.interactWithPost(
                        postId, 
                        authData.user.id, 
                        interactionType, 
                        authData.accessToken
                    );
                    break;
                case 'save':
                    result = await feedFeatureService.interactWithPost(
                        postId, 
                        authData.user.id, 
                        'save', 
                        authData.accessToken
                    );
                    break;
                case 'vote':
                    result = await feedFeatureService.interactWithPost(
                        postId, 
                        authData.user.id, 
                        'vote', 
                        authData.accessToken
                    );
                    break;
                case 'share':
                    result = await feedFeatureService.createPostWithValidation(
                        additionalData as PostRequest, 
                        authData.accessToken
                    );
                    break;
                default:
                    throw new Error(`Unknown interaction type: ${interactionType}`);
            }
            
            return { postId, interactionType, result, additionalData };
        },
        {
            onSuccess: (data, variables) => {
                console.log(`Post ${variables.interactionType} successful:`, data);
                
                // Invalidate post-specific cache
                invalidateCache.invalidatePost(variables.postId);
                
                // If it's a share/repost, also invalidate feed
                if (variables.interactionType === 'share') {
                    invalidateCache.invalidateFeed();
                }
                
                // Invalidate user-specific caches for saved posts
                if (variables.interactionType === 'save' && authData?.user?.id) {
                    invalidateCache.invalidateUser(authData.user.id);
                }
            },
            onError: (error, variables) => {
                console.error(`Error ${variables.interactionType} post:`, error.message);
            },
            retry: 2,
            invalidateQueries: (variables) => [
                `post:${variables.postId}`,
                ...(variables.interactionType === 'share' ? ['feed'] : []),
                ...(variables.interactionType === 'save' && authData?.user?.id ? [`posts:${authData.user.id}`] : [])
            ],
            optimisticUpdate: (cache, variables) => {
                // Optimistic updates for different interaction types
                const postKey = convertQueryKeyToCacheKey(['post', variables.postId]);
                const existingPost = cache.get(postKey);
                
                if (existingPost) {
                    const updatedPost = { ...existingPost };
                    
                    switch (variables.interactionType) {
                        case 'like':
                            updatedPost.post.likeCount = (updatedPost.post.likeCount || 0) + 1;
                            if (updatedPost.post.userReaction?.reactionType === 'dislike') {
                                updatedPost.post.dislikeCount = Math.max(0, (updatedPost.post.dislikeCount || 0) - 1);
                            }
                            updatedPost.post.userReaction = { reactionType: 'like' };
                            break;
                        case 'dislike':
                            updatedPost.post.dislikeCount = (updatedPost.post.dislikeCount || 0) + 1;
                            if (updatedPost.post.userReaction?.reactionType === 'like') {
                                updatedPost.post.likeCount = Math.max(0, (updatedPost.post.likeCount || 0) - 1);
                            }
                            updatedPost.post.userReaction = { reactionType: 'dislike' };
                            break;
                        case 'save':
                            // Save state would be handled separately
                            break;
                    }
                    
                    cache.set(postKey, updatedPost);
                }

                return () => {
                    console.log(`Rolling back ${variables.interactionType} interaction`);
                };
            }
        }
    );
};

// ===== EXPORTS =====

/**
 * Export all custom feed service hooks with consistent naming
 */
export const useFeedServiceCustom = {
    // DI access
    useFeedServices: useFeedServicesCustom,
    
    // Queries
    useFeed: useFeedCustom,
    usePost: usePostCustom,
    
    // Mutations
    useCreatePost: useCreatePostCustom,
    useUpdatePost: useUpdatePostCustom,
    useDeletePost: useDeletePostCustom,
    useInteractWithPost: useInteractWithPostCustom
};
