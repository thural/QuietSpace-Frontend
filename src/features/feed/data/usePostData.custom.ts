import useUserQueries from "@/features/profile/data/userQueries";
import { ResId } from "@/shared/api/models/common";
import { PostPage, PostRequest, PostResponse, RepostRequest, VoteBody } from "@/features/feed/data/models/post";
import { ConsumerFn } from "@/shared/types/genericTypes";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "@/core/store/zustand";
import { useFeedServices } from "@/features/feed/application/hooks/useFeedService";
import { 
  useCustomQuery, 
  useCustomMutation, 
  useCustomInfiniteQuery 
} from "@/core/hooks";
import { 
  CACHE_TIME_MAPPINGS, 
  convertQueryKeyToCacheKey,
  useCacheInvalidation 
} from "@/core/hooks/migrationUtils";
import type { PostQuery } from "@/features/feed/domain";

/**
 * CUSTOM HOOKS - Migrated from React Query to Custom Query Implementation
 * 
 * This file demonstrates the migration of usePostData hooks from React Query
 * to our enterprise-grade custom query implementation.
 */

// ===== INFINITE QUERY HOOKS =====

/**
 * Custom hook for fetching paginated posts
 * Replaces: useGetPagedPosts (React Query)
 */
export const useGetPagedPostsCustom = () => {
    const { data: authData, isAuthenticated } = useAuthStore();
    const { feedFeatureService } = useFeedServices();
    const invalidateCache = useCacheInvalidation();

    return useCustomInfiniteQuery(
        ['posts'],
        async ({ pageParam = 0 }) => {
            const query: PostQuery = { page: pageParam, size: 9 };
            const feed = await feedFeatureService.loadFeed(query, authData.accessToken);
            return {
                data: feed.items.map(item => item.post),
                hasNextPage: feed.pagination.hasNext,
                hasPreviousPage: feed.pagination.hasPrev
            };
        },
        {
            enabled: isAuthenticated,
            staleTime: CACHE_TIME_MAPPINGS.FEED_STALE_TIME,
            cacheTime: CACHE_TIME_MAPPINGS.FEED_CACHE_TIME,
            refetchInterval: 5 * 60 * 1000, // 5 minutes
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            initialPageParam: 0,
            getNextPageParam: (lastPage, allPages) => {
                return lastPage.hasNextPage ? allPages.length : undefined;
            },
            onSuccess: (data, allPages) => {
                console.log('Feed loaded successfully:', { 
                    totalItems: data.length, 
                    totalPages: allPages.length 
                });
            },
            onError: (error) => {
                console.error('Error loading feed:', error);
            }
        }
    );
};

/**
 * Custom hook for fetching saved posts
 * Replaces: useGetSavedPostsByUserId (React Query)
 */
export const useGetSavedPostsByUserIdCustom = (userId: ResId) => {
    const { data: authData, isAuthenticated } = useAuthStore();
    const { postDataService } = useFeedServices();

    return useCustomInfiniteQuery(
        ['posts', 'saved', userId],
        async ({ pageParam = 0 }): Promise<PostPage> => {
            const query: PostQuery = { page: pageParam, size: 9 };
            return await postDataService.getSavedPostsByUserId(userId, query, authData.accessToken);
        },
        {
            enabled: isAuthenticated && !!userId,
            staleTime: CACHE_TIME_MAPPINGS.POST_STALE_TIME,
            cacheTime: CACHE_TIME_MAPPINGS.POST_CACHE_TIME,
            refetchInterval: 5 * 60 * 1000,
            initialPageParam: 0,
            getNextPageParam: (lastPage, allPages) => {
                return !lastPage.last ? allPages.length : undefined;
            }
        }
    );
};

/**
 * Custom hook for fetching user posts
 * Replaces: useGetPostsByUserId (React Query)
 */
export const useGetPostsByUserIdCustom = (userId: ResId) => {
    const { data: authData, isAuthenticated } = useAuthStore();
    const { postDataService } = useFeedServices();

    return useCustomInfiniteQuery(
        ['posts', userId],
        async ({ pageParam = 0 }): Promise<PostPage> => {
            const query: PostQuery = { page: pageParam, size: 9 };
            return await postDataService.getPostsByUserId(userId, query, authData.accessToken);
        },
        {
            enabled: isAuthenticated && !!userId,
            staleTime: CACHE_TIME_MAPPINGS.POST_STALE_TIME,
            cacheTime: CACHE_TIME_MAPPINGS.POST_CACHE_TIME,
            refetchInterval: 5 * 60 * 1000,
            initialPageParam: 0,
            getNextPageParam: (lastPage, allPages) => {
                return !lastPage.last ? allPages.length : undefined;
            }
        }
    );
};

// ===== SINGLE QUERY HOOKS =====

/**
 * Custom hook for fetching a single post
 * Replaces: useGetPostById (React Query)
 */
export const useGetPostByIdCustom = (postId: ResId) => {
    const { data: authData, isAuthenticated } = useAuthStore();
    const { feedDataService } = useFeedServices();
    const invalidateCache = useCacheInvalidation();

    return useCustomQuery(
        ['posts', postId],
        async (): Promise<PostResponse> => {
            const feedItem = await feedDataService.getPostWithComments(postId, authData.accessToken);
            return feedItem.post;
        },
        {
            enabled: isAuthenticated && !!postId,
            staleTime: CACHE_TIME_MAPPINGS.POST_STALE_TIME,
            cacheTime: CACHE_TIME_MAPPINGS.POST_CACHE_TIME,
            refetchInterval: 10 * 60 * 1000, // 10 minutes
            onSuccess: (data) => {
                console.log('Post loaded successfully:', { postId: data.id, title: data.title });
            },
            onError: (error) => {
                console.error('Error loading post:', { postId, error: error.message });
            }
        }
    );
};

// ===== MUTATION HOOKS =====

/**
 * Custom hook for creating posts
 * Replaces: useCreatePost (React Query)
 */
export const useCreatePostCustom = (toggleForm: ConsumerFn) => {
    const { data: authData } = useAuthStore();
    const { feedFeatureService } = useFeedServices();
    const invalidateCache = useCacheInvalidation();

    return useCustomMutation(
        async (postData: PostRequest | FormData): Promise<PostResponse> => {
            // Convert FormData to PostRequest if needed
            const postRequest = postData instanceof FormData ? 
                JSON.parse(postData.get('post') as string) : postData;
            return await feedFeatureService.createPostWithValidation(postRequest, authData.accessToken);
        },
        {
            onSuccess: (data, variables) => {
                console.log("Post created successfully:", data);
                toggleForm();
                
                // Invalidate feed cache to show new post
                invalidateCache.invalidateFeed();
                
                // Optimistically update cache if needed
                // This would be handled by the cacheUpdate function
            },
            onError: (error, variables) => {
                console.error("Error creating post:", error.message);
                toggleForm(); // Close form even on error for better UX
            },
            retry: 2,
            retryDelay: 1000,
            invalidateQueries: ['posts', 'feed'], // Will invalidate these cache keys
            optimisticUpdate: (cache, variables) => {
                // Return rollback function
                return () => {
                    // Rollback logic would go here
                    console.log('Rolling back optimistic post creation');
                };
            }
        }
    );
};

/**
 * Custom hook for creating reposts
 * Replaces: useCreateRepost (React Query)
 */
export const useCreateRepostCustom = (toggleForm: ConsumerFn) => {
    const { feedFeatureService } = useFeedServices();
    const invalidateCache = useCacheInvalidation();

    return useCustomMutation(
        async (repostData: RepostRequest): Promise<PostResponse> => {
            console.log("Creating repost:", repostData);
            return await feedFeatureService.createPostWithValidation(repostData as PostRequest, '');
        },
        {
            onSuccess: (data, variables) => {
                console.log("Repost created successfully:", data);
                toggleForm();
                invalidateCache.invalidateFeed();
            },
            onError: (error, variables) => {
                console.error("Error creating repost:", error.message);
                alert("Error reposting, try again later");
                toggleForm();
            },
            retry: 1,
            invalidateQueries: ['posts', 'feed']
        }
    );
};

/**
 * Custom hook for saving posts
 * Replaces: useSavePost (React Query)
 */
export const useSavePostCustom = () => {
    const { feedFeatureService } = useFeedServices();
    const { getSignedUser } = useUserQueries();
    const user = getSignedUser();
    const invalidateCache = useCacheInvalidation();

    return useCustomMutation(
        async (postId: ResId): Promise<Response> => {
            await feedFeatureService.interactWithPost(postId, user.id, 'save', '');
            return new Response('Post saved successfully');
        },
        {
            onSuccess: (data, postId) => {
                console.log("Post saved successfully:", postId);
                // Invalidate user-specific saved posts cache
                if (user) {
                    invalidateCache.invalidateUser(user.id);
                }
            },
            onError: (error, postId) => {
                console.error("Error saving post:", error.message);
                alert("Error saving post, try again later");
            },
            retry: 2,
            invalidateQueries: (variables) => [`posts:saved:${variables}`]
        }
    );
};

/**
 * Custom hook for deleting posts
 * Replaces: useDeletePost (React Query)
 */
export const useDeletePostCustom = (postId: ResId) => {
    const { feedFeatureService } = useFeedServices();
    const { getSignedUserElseThrow } = useUserQueries();
    const user = getSignedUserElseThrow();
    const invalidateCache = useCacheInvalidation();

    return useCustomMutation(
        async (): Promise<Response> => {
            await feedFeatureService.deletePostWithBusinessLogic(postId, user.id, '');
            return new Response('Post deleted successfully');
        },
        {
            onSuccess: (data, variables) => {
                console.log("Post deleted successfully:", postId);
                
                // Invalidate all relevant caches
                invalidateCache.invalidatePost(postId);
                invalidateCache.invalidateFeed();
                invalidateCache.invalidateUser(user.id);
            },
            onError: (error, variables) => {
                console.error("Error deleting post:", error.message);
            },
            retry: 1,
            invalidateQueries: ['posts', 'feed', `posts:${user.id}`],
            optimisticUpdate: (cache, variables) => {
                // Optimistically remove post from cache
                const cacheKey = convertQueryKeyToCacheKey(['posts', postId]);
                cache.delete(cacheKey);
                
                return () => {
                    // Rollback: restore post to cache
                    console.log('Rolling back post deletion');
                };
            }
        }
    );
};

/**
 * Custom hook for searching posts
 * Replaces: useQueryPosts (React Query)
 */
export const useQueryPostsCustom = (setPostQueryResult: (posts: PostResponse[]) => void) => {
    const { postDataService } = useFeedServices();

    return useCustomMutation(
        async (queryText: string): Promise<PostPage> => {
            return await postDataService.searchPosts(queryText, {}, '');
        },
        {
            onSuccess: (data, variables) => {
                console.log("Search completed successfully:", { 
                    query: variables, 
                    resultCount: data.content.length 
                });
                setPostQueryResult(data.content);
            },
            onError: (error, variables) => {
                console.error("Error searching posts:", error.message);
                setPostQueryResult([]);
            },
            retry: 1
        }
    );
};

/**
 * Custom hook for voting on polls
 * Replaces: useVotePoll (React Query)
 */
export const useVotePollCustom = (postId: ResId) => {
    const { feedFeatureService } = useFeedServices();
    const { getSignedUserElseThrow } = useUserQueries();
    const user = getSignedUserElseThrow();
    const invalidateCache = useCacheInvalidation();

    return useCustomMutation(
        async (voteData: VoteBody): Promise<Response> => {
            await feedFeatureService.interactWithPost(postId, user.id, 'vote', '');
            return new Response('Vote successful');
        },
        {
            onSuccess: (data, variables) => {
                console.log("Vote successful:", { postId, voteData });
                invalidateCache.invalidatePost(postId);
            },
            onError: (error, variables) => {
                console.error("Error voting:", error.message);
            },
            retry: 2,
            invalidateQueries: (variables) => [`posts:${postId}`]
        }
    );
};

// ===== EXPORTS =====

/**
 * Export all custom hooks with consistent naming
 */
export const usePostDataCustom = {
    // Infinite queries
    useGetPagedPosts: useGetPagedPostsCustom,
    useGetSavedPostsByUserId: useGetSavedPostsByUserIdCustom,
    useGetPostsByUserId: useGetPostsByUserIdCustom,
    useGetRepliedPostsByUserId: useGetRepliedPostsByUserIdCustom,
    
    // Single queries
    useGetPostById: useGetPostByIdCustom,
    
    // Mutations
    useCreatePost: useCreatePostCustom,
    useCreateRepost: useCreateRepostCustom,
    useSavePost: useSavePostCustom,
    useEditPost: useEditPostCustom,
    useQueryPosts: useQueryPostsCustom,
    useDeletePost: useDeletePostCustom,
    useVotePoll: useVotePollCustom
};
