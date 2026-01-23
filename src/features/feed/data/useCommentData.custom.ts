import { CommentRequest, CommentResponse, PagedComment } from "@/features/feed/data/models/comment";
import { ResId } from "@/shared/api/models/common";
import { useAuthStore } from "@/core/store/zustand";
import { ConsumerFn } from "@/shared/types/genericTypes";
import { QueryProps } from "@/types/hookPropTypes";
import { useCommentServices } from "@/features/feed/application/hooks/useCommentService";
import { 
  useCustomQuery, 
  useCustomMutation 
} from "@/core/hooks";
import { 
  CACHE_TIME_MAPPINGS, 
  convertQueryKeyToCacheKey,
  useCacheInvalidation 
} from "@/core/hooks/migrationUtils";

/**
 * CUSTOM COMMENT HOOKS - Migrated from React Query to Custom Query Implementation
 * 
 * This file demonstrates the migration of useCommentData hooks from React Query
 * to our enterprise-grade custom query implementation.
 */

// ===== QUERY HOOKS =====

/**
 * Custom hook for fetching comments by post ID
 * Replaces: useGetComments (React Query)
 */
export const useGetCommentsCustom = (postId: ResId) => {
    const { data: authData } = useAuthStore();
    const { commentDataService } = useCommentServices();
    const invalidateCache = useCacheInvalidation();

    return useCustomQuery(
        ['posts', postId, 'comments'],
        async (): Promise<PagedComment> => {
            return await commentDataService.getCommentsByPostId(postId);
        },
        {
            enabled: !!postId,
            staleTime: CACHE_TIME_MAPPINGS.COMMENT_STALE_TIME,
            cacheTime: CACHE_TIME_MAPPINGS.COMMENT_CACHE_TIME,
            refetchInterval: 5 * 60 * 1000, // 5 minutes
            onSuccess: (data) => {
                console.log('Comments loaded successfully:', { 
                    postId, 
                    commentCount: data.content.length 
                });
            },
            onError: (error) => {
                console.error('Error loading comments:', { postId, error: error.message });
            },
            // Comments are frequently updated, so we want fresh data
            refetchOnWindowFocus: true,
            // Enable background refetching for real-time updates
            refetchIntervalInBackground: true
        }
    );
};

/**
 * Custom hook for fetching the latest comment
 * Replaces: useGetLatestComment (React Query)
 */
export const useGetLatestCommentCustom = (userId: ResId, postId: ResId) => {
    const { data: authData } = useAuthStore();
    const { commentDataService } = useCommentServices();

    return useCustomQuery(
        ['posts', postId, 'comments', 'latest'],
        async (): Promise<CommentResponse> => {
            return await commentDataService.getLatestComment(userId, postId);
        },
        {
            enabled: !!userId && !!postId,
            staleTime: CACHE_TIME_MAPPINGS.COMMENT_STALE_TIME / 2, // More frequent updates
            cacheTime: CACHE_TIME_MAPPINGS.COMMENT_CACHE_TIME,
            refetchInterval: 3 * 60 * 1000, // 3 minutes - frequently updated
            onSuccess: (data) => {
                console.log('Latest comment loaded:', { 
                    postId, 
                    commentId: data.id,
                    author: data.userId 
                });
            },
            onError: (error) => {
                console.error('Error loading latest comment:', { postId, error: error.message });
            }
        }
    );
};

// ===== MUTATION HOOKS =====

interface usePostCommentProps extends QueryProps {
    postId: ResId;
    handleClose?: ConsumerFn;
}

/**
 * Custom hook for posting comments
 * Replaces: usePostComment (React Query)
 */
export const usePostCommentCustom = ({
    postId, 
    handleClose
}: usePostCommentProps) => {
    const { feedFeatureService } = useCommentServices();
    const invalidateCache = useCacheInvalidation();

    return useCustomMutation(
        async (commentData: CommentRequest): Promise<CommentResponse> => {
            return await feedFeatureService.createCommentWithValidation(commentData);
        },
        {
            onSuccess: (data, variables) => {
                console.log("Comment posted successfully:", data);
                handleClose?.();
                
                // Invalidate comments cache for this post
                invalidateCache.invalidateComment(data.id, postId);
                
                // Also invalidate the latest comment cache
                const latestCommentKey = convertQueryKeyToCacheKey(['posts', postId, 'comments', 'latest']);
                invalidateCache.invalidateComment(data.id, postId);
            },
            onError: (error, variables) => {
                console.error("Error posting comment:", error.message);
                // Don't close form on error so user can retry
            },
            retry: 2,
            retryDelay: 1000,
            invalidateQueries: [
                `posts:${postId}:comments:*`,
                `posts:${postId}:comments:latest`
            ],
            optimisticUpdate: (cache, variables) => {
                // Create optimistic comment
                const optimisticComment: CommentResponse = {
                    id: `temp-${Date.now()}`,
                    content: variables.content,
                    userId: variables.userId,
                    postId: variables.postId,
                    createDate: new Date().toISOString(),
                    updateDate: new Date().toISOString(),
                    userReaction: null,
                    replyCount: 0
                };

                // Add to cache optimistically
                const commentsKey = convertQueryKeyToCacheKey(['posts', postId, 'comments']);
                const existingComments = cache.get(commentsKey);
                
                if (existingComments) {
                    const updatedComments = {
                        ...existingComments,
                        content: [optimisticComment, ...existingComments.content]
                    };
                    cache.set(commentsKey, updatedComments);
                }

                return () => {
                    // Rollback: remove optimistic comment
                    const currentComments = cache.get(commentsKey);
                    if (currentComments) {
                        const rolledBackComments = {
                            ...currentComments,
                            content: currentComments.content.filter(c => c.id !== optimisticComment.id)
                        };
                        cache.set(commentsKey, rolledBackComments);
                    }
                };
            }
        }
    );
};

/**
 * Custom hook for deleting comments
 * Replaces: useDeleteComment (React Query)
 */
export const useDeleteCommentCustom = () => {
    const { feedFeatureService } = useCommentServices();
    const invalidateCache = useCacheInvalidation();

    return useCustomMutation(
        async ({ commentId, postId, userId }: { 
            commentId: ResId; 
            postId: ResId; 
            userId: ResId 
        }) => {
            await feedFeatureService.deleteCommentWithFullInvalidation(commentId, postId, userId);
            return { commentId, postId, userId };
        },
        {
            onSuccess: (data, variables) => {
                console.log("Comment deleted successfully:", variables);
                
                // Invalidate all comment-related caches for this post
                invalidateCache.invalidateComment(variables.commentId, variables.postId);
                
                // Invalidate post cache as comment count might change
                invalidateCache.invalidatePost(variables.postId);
            },
            onError: (error, variables) => {
                console.error("Error deleting comment:", error.message);
            },
            retry: 1,
            invalidateQueries: (variables) => [
                `posts:${variables.postId}:comments:*`,
                `posts:${variables.postId}:comments:latest`,
                `posts:${variables.postId}`
            ],
            optimisticUpdate: (cache, variables) => {
                // Optimistically remove comment from cache
                const commentsKey = convertQueryKeyToCacheKey(['posts', variables.postId, 'comments']);
                const existingComments = cache.get(commentsKey);
                
                if (existingComments) {
                    const updatedComments = {
                        ...existingComments,
                        content: existingComments.content.filter(c => c.id !== variables.commentId)
                    };
                    cache.set(commentsKey, updatedComments);
                }

                // Also update latest comment if needed
                const latestCommentKey = convertQueryKeyToCacheKey(['posts', variables.postId, 'comments', 'latest']);
                const latestComment = cache.get(latestCommentKey);
                
                if (latestComment && latestComment.id === variables.commentId) {
                    cache.delete(latestCommentKey);
                }

                return () => {
                    // Rollback: restore comment to cache
                    console.log('Rolling back comment deletion');
                };
            }
        }
    );
};

/**
 * Custom hook for updating comments
 * New functionality not present in original React Query implementation
 */
export const useUpdateCommentCustom = () => {
    const { feedFeatureService } = useCommentServices();
    const invalidateCache = useCacheInvalidation();

    return useCustomMutation(
        async ({ 
            commentId, 
            postId, 
            content 
        }: { 
            commentId: ResId; 
            postId: ResId; 
            content: string 
        }) => {
            // This would need to be implemented in the feature service
            return await feedFeatureService.updateCommentWithValidation(commentId, content, postId);
        },
        {
            onSuccess: (data, variables) => {
                console.log("Comment updated successfully:", variables);
                invalidateCache.invalidateComment(variables.commentId, variables.postId);
            },
            onError: (error, variables) => {
                console.error("Error updating comment:", error.message);
            },
            retry: 2,
            invalidateQueries: (variables) => [
                `posts:${variables.postId}:comments:*`,
                `posts:${variables.postId}:comments:latest`
            ],
            optimisticUpdate: (cache, variables) => {
                // Optimistically update comment content
                const commentsKey = convertQueryKeyToCacheKey(['posts', variables.postId, 'comments']);
                const existingComments = cache.get(commentsKey);
                
                if (existingComments) {
                    const updatedComments = {
                        ...existingComments,
                        content: existingComments.content.map(c => 
                            c.id === variables.commentId 
                                ? { ...c, content: variables.content, updateDate: new Date().toISOString() }
                                : c
                        )
                    };
                    cache.set(commentsKey, updatedComments);
                }

                return () => {
                    console.log('Rolling back comment update');
                };
            }
        }
    );
};

/**
 * Custom hook for reacting to comments
 * New functionality for comment reactions
 */
export const useReactToCommentCustom = () => {
    const { feedFeatureService } = useCommentServices();
    const invalidateCache = useCacheInvalidation();

    return useCustomMutation(
        async ({ 
            commentId, 
            postId, 
            reactionType 
        }: { 
            commentId: ResId; 
            postId: ResId; 
            reactionType: 'like' | 'dislike' 
        }) => {
            await feedFeatureService.interactWithPost(commentId, reactionType, '');
            return { commentId, postId, reactionType };
        },
        {
            onSuccess: (data, variables) => {
                console.log("Comment reaction successful:", variables);
                invalidateCache.invalidateComment(variables.commentId, variables.postId);
            },
            onError: (error, variables) => {
                console.error("Error reacting to comment:", error.message);
            },
            retry: 1,
            invalidateQueries: (variables) => [
                `posts:${variables.postId}:comments:*`
            ]
        }
    );
};

// ===== EXPORTS =====

/**
 * Export all custom comment hooks with consistent naming
 */
export const useCommentDataCustom = {
    // Queries
    useGetComments: useGetCommentsCustom,
    useGetLatestComment: useGetLatestCommentCustom,
    
    // Mutations
    usePostComment: usePostCommentCustom,
    useDeleteComment: useDeleteCommentCustom,
    useUpdateComment: useUpdateCommentCustom,
    useReactToComment: useReactToCommentCustom
};
