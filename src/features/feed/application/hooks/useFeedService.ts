import { useCustomQuery, useCustomMutation, useCustomInfiniteQuery } from '@/core/hooks';
import { useAuthStore } from '@/core/store/zustand';
import { useDIContainer } from '@/core/di';
import { TYPES } from '@/core/di/types';
import { 
  CACHE_TIME_MAPPINGS, 
  convertQueryKeyToCacheKey,
  useCacheInvalidation 
} from '@/core/hooks/migrationUtils';
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

/**
 * Hook for accessing feed feature services via DI
 */
export const useFeedServices = () => {
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
 */
export const useFeed = (query: PostQuery = {}) => {
    const { data: authData, isAuthenticated } = useAuthStore();
    const { feedFeatureService } = useFeedServices();
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
 */
export const usePost = (postId: ResId) => {
    const { data: authData, isAuthenticated } = useAuthStore();
    const { feedDataService } = useFeedServices();
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
 */
export const useCreatePost = (toggleForm?: ConsumerFn) => {
    const { data: authData } = useAuthStore();
    const { feedFeatureService } = useFeedServices();
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
 */
export const useUpdatePost = (postId: ResId, toggleForm?: ConsumerFn) => {
    const { data: authData } = useAuthStore();
    const { feedFeatureService } = useFeedServices();
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
                        ...variables,
                        updateDate: new Date().toISOString()
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
 */
export const useDeletePost = () => {
    const { data: authData } = useAuthStore();
    const { feedFeatureService } = useFeedServices();
    const invalidateCache = useCacheInvalidation();

    return useCustomMutation(
        async ({ postId, userId }: { postId: ResId; userId: ResId }) => {
            return await feedFeatureService.deletePostWithBusinessLogic(postId, userId, authData.accessToken);
        },
        {
            onSuccess: (_, variables) => {
                console.log('Post deleted successfully:', variables.postId);
                
                // Comprehensive cache invalidation
                invalidateCache.invalidatePost(variables.postId);
                invalidateCache.invalidateFeed();
                invalidateCache.invalidateUser(variables.userId);
            },
            onError: (error, variables) => {
                console.error('Error deleting post:', error.message);
                alert(`Error deleting post: ${error.message}`);
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
                const postKey = convertQueryKeyToCacheKey(['posts', variables.postId]);
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
 * Hook for creating reposts with business validation
 */
export const useCreateRepost = (toggleForm?: ConsumerFn) => {
    const { data: authData } = useAuthStore();
    const { feedFeatureService } = useFeedServices();

    return useMutation({
        mutationFn: async (repostData: RepostRequest): Promise<PostResponse> => {
            return await feedFeatureService.createPostWithValidation(repostData as PostRequest, authData.accessToken);
        },
        onSuccess: (data) => {
            console.log('Repost created successfully:', data);
            toggleForm?.();
        },
        onError: (error) => {
            console.error('Error creating repost:', error.message);
            alert(`Error creating repost: ${error.message}`);
        },
    });
};

/**
 * Hook for post interactions (like, dislike, share, save)
 */
export const usePostInteraction = () => {
    const { data: authData } = useAuthStore();
    const { feedFeatureService } = useFeedServices();

    return useMutation({
        mutationFn: async ({ 
            postId, 
            userId, 
            interaction 
        }: { 
            postId: ResId; 
            userId: ResId; 
            interaction: 'like' | 'dislike' | 'share' | 'save' 
        }) => {
            return await feedFeatureService.interactWithPost(postId, userId, interaction, authData.accessToken);
        },
        onSuccess: (_, variables) => {
            console.log(`Post ${variables.interaction} successful:`, variables.postId);
        },
        onError: (error, variables) => {
            console.error(`Error ${variables.interaction} post:`, error.message);
        },
    });
};

/**
 * Hook for voting on polls with business logic
 */
export const useVotePoll = () => {
    const { data: authData } = useAuthStore();
    const { feedFeatureService } = useFeedServices();

    return useMutation({
        mutationFn: async (voteData: VoteBody) => {
            return await feedFeatureService.interactWithPost(voteData.postId, voteData.userId, 'vote', authData.accessToken);
        },
        onSuccess: (_, variables) => {
            console.log('Poll vote successful:', variables.postId);
        },
        onError: (error) => {
            console.error('Error voting on poll:', error.message);
        },
    });
};

/**
 * Hook for getting posts by user with caching
 */
export const useUserPosts = (userId: ResId, query: PostQuery = {}) => {
    const { data: authData, isAuthenticated } = useAuthStore();
    const { postDataService } = useFeedServices();

    return useInfiniteQuery({
        queryKey: ['userPosts', userId, query],
        queryFn: async ({ pageParam = 0 }) => {
            const userQuery = { ...query, userId, page: pageParam };
            return await postDataService.getPostsByUserId(userId, userQuery, authData.accessToken);
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.hasNext ? allPages.length : undefined;
        },
        enabled: isAuthenticated && !!userId,
        staleTime: 1000 * 60 * 3, // 3 minutes
        refetchInterval: 1000 * 60 * 6, // 6 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
    });
};

/**
 * Hook for getting saved posts with caching
 */
export const useSavedPosts = (query: PostQuery = {}) => {
    const { data: authData, isAuthenticated } = useAuthStore();
    const { postDataService } = useFeedServices();

    return useInfiniteQuery({
        queryKey: ['savedPosts', query],
        queryFn: async ({ pageParam = 0 }) => {
            const savedQuery = { ...query, page: pageParam };
            return await postDataService.getSavedPosts(savedQuery, authData.accessToken);
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.hasNext ? allPages.length : undefined;
        },
        enabled: isAuthenticated,
        staleTime: 1000 * 60 * 3, // 3 minutes
        refetchInterval: 1000 * 60 * 6, // 6 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
    });
};

/**
 * Hook for searching posts with caching
 */
export const useSearchPosts = (queryText: string, query: PostQuery = {}) => {
    const { data: authData, isAuthenticated } = useAuthStore();
    const { postDataService } = useFeedServices();

    return useQuery({
        queryKey: ['searchPosts', queryText, query],
        queryFn: async () => {
            return await postDataService.searchPosts(queryText, query, authData.accessToken);
        },
        enabled: isAuthenticated && !!queryText.trim(),
        staleTime: 1000 * 60 * 2, // 2 minutes for search results
        gcTime: 1000 * 60 * 5, // 5 minutes
    });
};

/**
 * Hook for post analytics and engagement metrics
 */
export const usePostAnalytics = (postId: ResId) => {
    const { data: authData, isAuthenticated } = useAuthStore();
    const { postFeatureService } = useFeedServices();

    return useQuery({
        queryKey: ['postAnalytics', postId],
        queryFn: async () => {
            return await postFeatureService.calculatePostEngagement(postId, authData.accessToken);
        },
        enabled: isAuthenticated && !!postId,
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchInterval: 1000 * 60 * 10, // 10 minutes
    });
};

/**
 * Hook for feed analytics and business insights
 */
export const useFeedAnalytics = (userId?: ResId) => {
    const { data: authData, isAuthenticated } = useAuthStore();
    const { feedFeatureService } = useFeedServices();

    return useQuery({
        queryKey: ['feedAnalytics', userId],
        queryFn: async () => {
            return await feedFeatureService.getFeedAnalytics(userId, authData.accessToken);
        },
        enabled: isAuthenticated,
        staleTime: 1000 * 60 * 15, // 15 minutes for analytics
        refetchInterval: 1000 * 60 * 30, // 30 minutes
    });
};
