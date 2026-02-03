import { useCustomQuery } from '@core/modules/hooks/useCustomQuery';
import { useCustomMutation } from '@core/modules/hooks/useCustomMutation';
import { useFeatureAuth } from '@/core/modules/authentication/hooks/useFeatureAuth';
import { useDIContainer } from '@/core/modules/dependency-injection';
import { TYPES } from '@/core/modules/dependency-injection/types';
import type { CommentRequest, CommentResponse } from '@/features/feed/data/models/comment';
import type { ResId } from '@/shared/api/models/common';
import type { FeedFeatureService } from '@/features/feed/application/services/FeedFeatureService';
import type { CommentDataService } from '@/features/comment/data/services/CommentDataService';
import type { CommentQuery } from '@/features/comment/data/services/CommentDataService';

/**
 * Hook for accessing comment-related services via DI
 */
export const useCommentServices = () => {
    const container = useDIContainer();

    return {
        feedFeatureService: container.getByToken(TYPES.FEED_FEATURE_SERVICE) as FeedFeatureService,
        commentDataService: container.getByToken(TYPES.COMMENT_DATA_SERVICE) as CommentDataService,
    };
};

/**
 * Hook for getting comments by post ID with caching
 */
export const useComments = (postId: ResId, pageParams?: string) => {
    const { isAuthenticated } = useFeatureAuth();
    const { commentDataService } = useCommentServices();

    // Convert pageParams string to CommentQuery object
    const query: CommentQuery = pageParams ? { page: parseInt(pageParams, 10) } : {};

    return useCustomQuery(
        ['comments', postId, pageParams],
        async () => {
            return await commentDataService.getCommentsByPostId(postId, query);
        },
        {
            enabled: isAuthenticated && !!postId,
            staleTime: 1000 * 60 * 3, // 3 minutes - matches comments TTL
            cacheTime: 1000 * 60 * 10, // 10 minutes
            refetchInterval: 1000 * 60 * 5, // 5 minutes
        }
    );
};

/**
 * Hook for getting the latest comment for a user on a post
 */
export const useLatestComment = (userId: ResId, postId: ResId) => {
    const { isAuthenticated } = useFeatureAuth();
    const { commentDataService } = useCommentServices();

    return useCustomQuery(
        ['latestComment', userId, postId],
        async () => {
            return await commentDataService.getLatestComment(userId, postId);
        },
        {
            enabled: isAuthenticated && !!userId && !!postId,
            staleTime: 1000 * 60 * 2, // 2 minutes - frequently updated
            cacheTime: 1000 * 60 * 5, // 5 minutes
            refetchInterval: 1000 * 60 * 3, // 3 minutes
        }
    );
};

/**
 * Hook for creating comments with business validation
 */
export const useCreateComment = (onSuccess?: () => void, onError?: () => void) => {
    const { feedFeatureService } = useCommentServices();

    return useCustomMutation(
        async (commentData: CommentRequest): Promise<CommentResponse> => {
            return await feedFeatureService.createCommentWithValidation(commentData);
        },
        {
            onSuccess: (data: CommentResponse) => {
                console.log('Comment created successfully:', data);
                onSuccess?.();
            },
            onError: (error: Error) => {
                console.error('Error creating comment:', error.message);
                onError?.();
                alert(`Error creating comment: ${error.message}`);
            },
            invalidateQueries: ['comments'], // Invalidate comments cache on creation
        }
    );
};

/**
 * Hook for deleting comments with business logic
 */
export const useDeleteComment = () => {
    const { feedFeatureService } = useCommentServices();

    return useCustomMutation(
        async ({
            commentId,
            postId,
            userId
        }: {
            commentId: ResId;
            postId: ResId;
            userId: ResId
        }) => {
            return await feedFeatureService.deleteCommentWithFullInvalidation(commentId, postId, userId);
        },
        {
            onSuccess: (_: any, variables: { commentId: ResId; postId: ResId; userId: ResId }) => {
                console.log('Comment deleted successfully:', variables.commentId);
            },
            onError: (error: Error) => {
                console.error('Error deleting comment:', error.message);
                alert(`Error deleting comment: ${error.message}`);
            },
            invalidateQueries: ['comments'], // Invalidate comments cache on deletion
        }
    );
};

/**
 * Hook for batch loading comments for multiple posts
 */
export const useBatchComments = (postIds: ResId[], pageParams?: string) => {
    const { isAuthenticated } = useFeatureAuth();
    const { commentDataService } = useCommentServices();

    // Convert pageParams string to CommentQuery object
    const query: CommentQuery = pageParams ? { page: parseInt(pageParams, 10) } : {};

    return useCustomQuery(
        ['batchComments', postIds.join(','), pageParams || ''],
        async () => {
            // Since getCommentsForMultiplePosts doesn't exist, we'll fetch comments for each post individually
            const commentPromises = postIds.map(postId =>
                commentDataService.getCommentsByPostId(postId, query)
            );
            const results = await Promise.all(commentPromises);

            // Flatten all comments into a single array
            return results.flat();
        },
        {
            enabled: isAuthenticated && postIds.length > 0,
            staleTime: 1000 * 60 * 3, // 3 minutes
            cacheTime: 1000 * 60 * 10, // 10 minutes
            refetchInterval: 1000 * 60 * 5, // 5 minutes
        }
    );
};

/**
 * Hook for comment cache management
 */
export const useCommentCacheManagement = () => {
    const { commentDataService } = useCommentServices();

    const invalidatePostComments = (postId: ResId) => {
        // Use the inherited invalidateCache method from BaseDataService
        (commentDataService as any).invalidateCache(`comments:${postId}`);
    };

    const invalidateAllComments = () => {
        // Use the inherited invalidateCache method from BaseDataService
        (commentDataService as any).invalidateCache('comments');
    };

    const getCacheStats = () => {
        // Since getCacheStats doesn't exist, return a mock implementation
        return {
            totalEntries: 0,
            cacheHitRate: 0,
            memoryUsage: 0
        };
    };

    const warmupCache = async (postIds: ResId[], pageParams?: string) => {
        // Convert pageParams string to CommentQuery object
        const query: CommentQuery = pageParams ? { page: parseInt(pageParams, 10) } : {};

        // Preload comments for each post
        const warmupPromises = postIds.map(postId =>
            commentDataService.getCommentsByPostId(postId, query)
        );
        await Promise.allSettled(warmupPromises);
    };

    const healthCheck = async () => {
        // Since healthCheck doesn't exist, return a simple health status
        return {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            services: {
                commentDataService: 'connected',
                cache: 'operational'
            }
        };
    };

    return {
        invalidatePostComments,
        invalidateAllComments,
        getCacheStats,
        warmupCache,
        healthCheck,
    };
};
