// Removed React Query dependency - now using custom data query system from core modules
import { useFeatureAuth } from '@/core/modules/authentication/hooks/useFeatureAuth';
import { useDIContainer } from '@/core/modules/dependency-injection';
import { TYPES } from '@/core/modules/dependency-injection/types';
import {
    CACHE_TIME_MAPPINGS,
    convertQueryKeyToCacheKey,
    useCacheInvalidation
} from '@/core/modules/hooks/migrationUtils';
import { useCustomInfiniteQuery } from '@/core/modules/hooks/useCustomInfiniteQuery';
import { useCustomMutation } from '@/core/modules/hooks/useCustomMutation';
import { useCustomQuery } from '@/core/modules/hooks/useCustomQuery';
import type { FeedItem } from '@/features/feed/data/services/FeedDataService';
import type { ICommentDataService } from '@/features/feed/data/services/interfaces/ICommentDataService';
import type { IFeedDataService } from '@/features/feed/data/services/interfaces/IFeedDataService';
import type { IPostDataService } from '@/features/feed/data/services/interfaces/IPostDataService';
import type {
    PostQuery,
    PostRequest,
    PostResponse,
    RepostRequest,
    VoteBody
} from '@/features/feed/domain';
import type { ResId } from '@/shared/api/models/common';
import { ConsumerFn } from '@/shared/types/genericTypes';

/**
 * Hook for accessing feed feature services via DI
 */
export const useFeedServices = () => {
    const container = useDIContainer();

    return {
        feedFeatureService: (container.tryGetByToken(TYPES.FEED_FEATURE_SERVICE) as any),
        postFeatureService: (container.tryGetByToken(TYPES.POST_FEATURE_SERVICE) as any),
        feedDataService: container.getByToken(TYPES.FEED_DATA_SERVICE) as IFeedDataService,
        postDataService: container.getByToken(TYPES.POST_DATA_SERVICE) as IPostDataService,
        commentDataService: container.getByToken(TYPES.COMMENT_DATA_SERVICE) as ICommentDataService,
    };
};

/**
 * Custom hook for loading feed with business logic and caching
 */
export const useFeed = (query: PostQuery = {}) => {
    const { token, isAuthenticated } = useFeatureAuth();
    const { feedFeatureService } = useFeedServices();

    return useCustomInfiniteQuery<FeedItem>(
        ['feed', query],
        async (pageParam: number = 0) => {
            const feedQuery = { ...query, page: pageParam };
            const result = await feedFeatureService.loadFeed(feedQuery, token || '');
            return {
                data: result.items,
                hasNextPage: result.pagination.hasNext,
                hasPreviousPage: result.pagination.hasPrev
            };
        },
        {
            enabled: isAuthenticated,
            staleTime: CACHE_TIME_MAPPINGS.FEED_STALE_TIME,
            cacheTime: CACHE_TIME_MAPPINGS.FEED_CACHE_TIME,
            refetchInterval: 5 * 60 * 1000, // 5 minutes
            refetchOnMount: true,
            refetchOnWindowFocus: false,
            initialPageParam: 0,
            getNextPageParam: (lastPage: unknown, allPages: unknown[]) => {
                const feedPage = lastPage as { hasNextPage: boolean };
                return feedPage.hasNextPage ? allPages.length : undefined;
            },
            onSuccess: (data: FeedItem[], allPages: unknown[]) => {
                console.log('Feed loaded successfully:', {
                    totalItems: data.length,
                    totalPages: allPages.length,
                    query
                });
            },
            onError: (error: Error) => {
                console.error('Error loading feed:', error);
            }
        }
    );
};

/**
 * Custom hook for getting a single post with business logic
 */
export const usePost = (postId: ResId) => {
    const { authData, isAuthenticated } = useFeatureAuth();
    const { feedDataService } = useFeedServices();

    return useCustomQuery<FeedItem>(
        ['post', postId],
        async (): Promise<FeedItem> => {
            if (!authData) {
                throw new Error('Authentication required to access post');
            }
            return await feedDataService.getPostWithComments(postId, authData.accessToken);
        },
        {
            enabled: isAuthenticated && !!postId,
            staleTime: CACHE_TIME_MAPPINGS.POST_STALE_TIME,
            cacheTime: CACHE_TIME_MAPPINGS.POST_CACHE_TIME,
            refetchInterval: 10 * 60 * 1000, // 10 minutes
            onSuccess: (data: FeedItem) => {
                console.log('Post loaded successfully:', {
                    postId: data.post.id,
                    title: data.post.title,
                    commentCount: data.comments?.content?.length || 0
                });
            },
            onError: (error: Error) => {
                console.error('Error loading post:', { postId, error: error.message });
            }
        }
    );
};

/**
 * Custom hook for creating posts with business validation
 */
export const useCreatePost = (toggleForm?: ConsumerFn) => {
    const { authData } = useFeatureAuth();
    const { feedFeatureService } = useFeedServices();
    const invalidateCache = useCacheInvalidation();

    return useCustomMutation<PostResponse, Error, PostRequest>(
        async (postData: PostRequest): Promise<PostResponse> => {
            if (!authData) {
                throw new Error('Authentication required to create post');
            }
            return await feedFeatureService.createPostWithValidation(postData, authData.accessToken);
        },
        {
            onSuccess: (data: PostResponse, _variables: PostRequest) => {
                console.log('Post created successfully:', data);
                toggleForm?.();

                // Invalidate all feed-related caches
                invalidateCache.invalidateFeed();

                // Also invalidate user-specific caches
                if (authData?.user?.id) {
                    invalidateCache.invalidateUser(authData.user.id);
                }
            },
            onError: (error: Error, _variables: PostRequest) => {
                console.error('Error creating post:', error.message);
                alert(`Error creating post: ${error.message}`);
            },
            retry: 2,
            retryDelay: 1000,
            invalidateQueries: ['feed', 'posts'],
            optimisticUpdate: (cache, variables: PostRequest) => {
                // Create optimistic post
                const optimisticPost: PostResponse = {
                    id: `temp-${Date.now()}`,
                    userId: variables.userId, // Use userId from variables
                    username: 'CurrentUser', // TODO: Get from auth context
                    title: variables.title || '', // Ensure title is always a string
                    text: variables.text,
                    createDate: new Date().toISOString(),
                    updateDate: new Date().toISOString(),
                    commentCount: 0,
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
    const { authData } = useFeatureAuth();
    const { feedFeatureService } = useFeedServices();
    const invalidateCache = useCacheInvalidation();

    return useCustomMutation<PostResponse, Error, PostRequest>(
        async (postData: PostRequest): Promise<PostResponse> => {
            if (!authData) {
                throw new Error('Authentication required to update post');
            }
            return await feedFeatureService.updatePostWithValidation(postId, postData, authData.accessToken);
        },
        {
            onSuccess: (data: PostResponse, variables: PostRequest) => {
                console.log('Post updated successfully:', data);
                toggleForm?.();

                // Invalidate post-specific caches
                invalidateCache.invalidatePost(postId);
                invalidateCache.invalidateFeed();
            },
            onError: (error: Error, variables: PostRequest) => {
                console.error('Error updating post:', error.message);
                alert(`Error updating post: ${error.message}`);
            },
            retry: 2,
            invalidateQueries: [`post:${postId}`, 'feed', 'posts'],
            optimisticUpdate: (cache, variables: PostRequest) => {
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
    const { authData } = useFeatureAuth();
    const { feedFeatureService } = useFeedServices();
    const invalidateCache = useCacheInvalidation();

    return useCustomMutation<void, Error, { postId: ResId; userId: ResId }>(
        async ({ postId, userId }: { postId: ResId; userId: ResId }) => {
            return await feedFeatureService.deletePostWithBusinessLogic(postId, userId, authData?.accessToken || '');
        },
        {
            onSuccess: (_: void, variables: { postId: ResId; userId: ResId }) => {
                console.log('Post deleted successfully:', variables.postId);

                // Comprehensive cache invalidation
                invalidateCache.invalidatePost(variables.postId);
                invalidateCache.invalidateFeed();
                invalidateCache.invalidateUser(variables.userId);
            },
            onError: (error: Error, variables: { postId: ResId; userId: ResId }) => {
                console.error('Error deleting post:', error.message);
                alert(`Error deleting post: ${error.message}`);
            },
            retry: 1,
            invalidateQueries: ['feed', 'posts'],
            optimisticUpdate: (cache, variables: { postId: ResId; userId: ResId }) => {
                // Optimistically remove post from all caches
                const postKey = convertQueryKeyToCacheKey(['posts', variables.postId]);
                cache.delete(postKey);

                const feedKey = convertQueryKeyToCacheKey(['feed', {}]);
                const existingFeed = cache.get(feedKey);

                if (existingFeed) {
                    const updatedFeed = {
                        ...existingFeed,
                        items: existingFeed.items.filter((item: any) => item.post.id !== variables.postId),
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
    const { authData } = useFeatureAuth();
    const { feedFeatureService } = useFeedServices();

    return useCustomMutation<PostResponse, Error, RepostRequest>(
        async (repostData: RepostRequest): Promise<PostResponse> => {
            if (!authData) {
                throw new Error('Authentication required to create repost');
            }
            // Transform RepostRequest to PostRequest for the service
            const postRequest: PostRequest = {
                text: repostData.text,
                userId: repostData.userId,
                viewAccess: 'anyone', // Default view access for reposts
                poll: null,           // Reposts don't have polls
                title: undefined,     // Reposts don't have titles
                photoData: undefined  // Reposts don't have additional photos
            };

            return await feedFeatureService.createPostWithValidation(postRequest, authData.accessToken);
        },
        {
            onSuccess: (data: PostResponse) => {
                console.log('Repost created successfully:', data);
                toggleForm?.();
            },
            onError: (error: Error) => {
                console.error('Error creating repost:', error.message);
                alert(`Error creating repost: ${error.message}`);
            },
        }
    );
};

/**
 * Hook for post interactions (like, dislike, share, save)
 */
export const usePostInteraction = () => {
    const { authData } = useFeatureAuth();
    const { feedFeatureService } = useFeedServices();

    return useCustomMutation<void, Error, {
        postId: ResId;
        userId: ResId;
        interaction: 'like' | 'dislike' | 'share' | 'save'
    }>(
        async ({
            postId,
            userId,
            interaction
        }: {
            postId: ResId;
            userId: ResId;
            interaction: 'like' | 'dislike' | 'share' | 'save'
        }) => {
            if (!authData) {
                throw new Error('Authentication required to interact with post');
            }
            return await feedFeatureService.interactWithPost(postId, userId, interaction, authData.accessToken);
        },
        {
            onSuccess: (_: void, variables: {
                postId: ResId;
                userId: ResId;
                interaction: 'like' | 'dislike' | 'share' | 'save'
            }) => {
                console.log(`Post ${variables.interaction} successful:`, variables.postId);
            },
            onError: (error: Error, variables: {
                postId: ResId;
                userId: ResId;
                interaction: 'like' | 'dislike' | 'share' | 'save'
            }) => {
                console.error(`Error ${variables.interaction} post:`, error.message);
            },
        }
    );
};

/**
 * Hook for voting on polls with business logic
 */
export const useVotePoll = () => {
    const { authData } = useFeatureAuth();
    const { feedFeatureService } = useFeedServices();

    return useCustomMutation<void, Error, VoteBody>(
        async (voteData: VoteBody) => {
            if (!authData) {
                throw new Error('Authentication required to vote on poll');
            }
            return await feedFeatureService.interactWithPost(voteData.postId, voteData.userId, 'vote', authData.accessToken);
        },
        {
            onSuccess: (_: void, variables: VoteBody) => {
                console.log('Poll vote successful:', variables.postId);
            },
            onError: (error: Error) => {
                console.error('Error voting on poll:', error.message);
            },
        }
    );
};

/**
 * Hook for getting posts by user with caching
 */
export const useUserPosts = (userId: ResId, query: PostQuery = {}) => {
    const { authData, isAuthenticated } = useFeatureAuth();
    const { postDataService } = useFeedServices();

    return useCustomInfiniteQuery<any>(
        ['userPosts', userId, query],
        async (pageParam: number = 0) => {
            if (!authData) {
                throw new Error('Authentication required to access user posts');
            }
            const userQuery = { ...query, userId, page: pageParam };
            const result = await postDataService.getPostsByUserId(userId, userQuery, authData.accessToken);
            return {
                data: result || [],
                hasNextPage: false, // Array doesn't have pagination info, assume no more pages
                hasPreviousPage: pageParam > 0
            };
        },
        {
            initialPageParam: 0,
            getNextPageParam: (lastPage: unknown, allPages: unknown[]) => {
                const page = lastPage as { hasNextPage: boolean };
                return page.hasNextPage ? allPages.length : undefined;
            },
            enabled: isAuthenticated && !!userId,
            staleTime: 1000 * 60 * 3, // 3 minutes
            cacheTime: 1000 * 60 * 10, // 10 minutes
            refetchInterval: 1000 * 60 * 6, // 6 minutes
        }
    );
};

/**
 * Hook for getting saved posts with caching
 */
export const useSavedPosts = (query: PostQuery = {}) => {
    const { authData, isAuthenticated } = useFeatureAuth();
    const { postDataService } = useFeedServices();

    return useCustomInfiniteQuery<any>(
        ['savedPosts', query],
        async (pageParam: number = 0) => {
            if (!authData) {
                throw new Error('Authentication required to access saved posts');
            }
            const savedQuery = { ...query, page: pageParam };
            const result = await postDataService.getPosts(savedQuery, authData.accessToken);
            return {
                data: result.content || [],
                hasNextPage: !result.last,
                hasPreviousPage: !result.first
            };
        },
        {
            initialPageParam: 0,
            getNextPageParam: (lastPage: unknown, allPages: unknown[]) => {
                const page = lastPage as { hasNextPage: boolean };
                return page.hasNextPage ? allPages.length : undefined;
            },
            enabled: isAuthenticated,
            staleTime: 1000 * 60 * 3, // 3 minutes
            cacheTime: 1000 * 60 * 10, // 10 minutes
            refetchInterval: 1000 * 60 * 6, // 6 minutes
        }
    );
};

/**
 * Hook for searching posts with caching
 */
export const useSearchPosts = (queryText: string, query: PostQuery = {}) => {
    const { authData, isAuthenticated } = useFeatureAuth();
    const { postDataService } = useFeedServices();

    return useCustomQuery<any>(
        ['searchPosts', queryText, query],
        async () => {
            if (!authData) {
                throw new Error('Authentication required to search posts');
            }
            return await postDataService.getPosts({ ...query, search: queryText }, authData.accessToken);
        },
        {
            enabled: isAuthenticated && !!queryText.trim(),
            staleTime: 1000 * 60 * 2, // 2 minutes for search results
            cacheTime: 1000 * 60 * 5, // 5 minutes
        }
    );
};

/**
 * Hook for post analytics and engagement metrics
 */
export const usePostAnalytics = (postId: ResId) => {
    const { authData, isAuthenticated } = useFeatureAuth();
    const { postFeatureService } = useFeedServices();

    return useCustomQuery<any>(
        ['postAnalytics', postId],
        async () => {
            if (!authData) {
                throw new Error('Authentication required to access post analytics');
            }
            return await postFeatureService.calculatePostEngagement(postId, authData.accessToken);
        },
        {
            enabled: isAuthenticated && !!postId,
            staleTime: 1000 * 60 * 5, // 5 minutes
            cacheTime: 1000 * 60 * 15, // 15 minutes
            refetchInterval: 1000 * 60 * 10, // 10 minutes
        }
    );
};

/**
 * Hook for feed analytics and business insights
 */
export const useFeedAnalytics = (userId?: ResId) => {
    const { authData, isAuthenticated } = useFeatureAuth();
    const { feedFeatureService } = useFeedServices();

    return useCustomQuery<any>(
        ['feedAnalytics', userId],
        async () => {
            if (!authData) {
                throw new Error('Authentication required to access feed analytics');
            }
            return await feedFeatureService.getFeedAnalytics(userId, authData.accessToken);
        },
        {
            enabled: isAuthenticated,
            staleTime: 1000 * 60 * 15, // 15 minutes for analytics
            cacheTime: 1000 * 60 * 30, // 30 minutes
            refetchInterval: 1000 * 60 * 30, // 30 minutes
        }
    );
};
