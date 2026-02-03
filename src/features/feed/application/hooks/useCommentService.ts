import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/core/store/zustand';
import { useDIContainer } from '@/core/modules/dependency-injection';
import { TYPES } from '@/core/modules/dependency-injection/types';
import type { CommentRequest, CommentResponse } from '@/features/feed/data/models/comment';
import type { ResId } from '@/shared/api/models/common';
import { ConsumerFn } from '@/shared/types/genericTypes';

/**
 * Hook for accessing comment-related services via DI
 */
export const useCommentServices = () => {
    const container = useDIContainer();
    
    return {
        feedFeatureService: container.getByToken(TYPES.FEED_FEATURE_SERVICE),
        commentDataService: container.getByToken(TYPES.COMMENT_DATA_SERVICE),
    };
};

/**
 * Hook for getting comments by post ID with caching
 */
export const useComments = (postId: ResId, pageParams?: string) => {
    const { data: authData, isAuthenticated } = useAuthStore();
    const { commentDataService } = useCommentServices();

    return useQuery({
        queryKey: ['comments', postId, pageParams],
        queryFn: async () => {
            return await commentDataService.getCommentsByPostId(postId, pageParams);
        },
        enabled: isAuthenticated && !!postId,
        staleTime: 1000 * 60 * 3, // 3 minutes - matches comments TTL
        refetchInterval: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
    });
};

/**
 * Hook for getting the latest comment for a user on a post
 */
export const useLatestComment = (userId: ResId, postId: ResId) => {
    const { data: authData, isAuthenticated } = useAuthStore();
    const { commentDataService } = useCommentServices();

    return useQuery({
        queryKey: ['latestComment', userId, postId],
        queryFn: async () => {
            return await commentDataService.getLatestComment(userId, postId);
        },
        enabled: isAuthenticated && !!userId && !!postId,
        staleTime: 1000 * 60 * 2, // 2 minutes - frequently updated
        refetchInterval: 1000 * 60 * 3, // 3 minutes
        gcTime: 1000 * 60 * 5, // 5 minutes
    });
};

/**
 * Hook for creating comments with business validation
 */
export const useCreateComment = (onSuccess?: ConsumerFn, onError?: ConsumerFn) => {
    const { data: authData } = useAuthStore();
    const { feedFeatureService } = useCommentServices();

    return useMutation({
        mutationFn: async (commentData: CommentRequest): Promise<CommentResponse> => {
            return await feedFeatureService.createCommentWithValidation(commentData);
        },
        onSuccess: (data) => {
            console.log('Comment created successfully:', data);
            onSuccess?.();
        },
        onError: (error) => {
            console.error('Error creating comment:', error.message);
            onError?.();
            alert(`Error creating comment: ${error.message}`);
        },
    });
};

/**
 * Hook for deleting comments with business logic
 */
export const useDeleteComment = () => {
    const { data: authData } = useAuthStore();
    const { feedFeatureService } = useCommentServices();

    return useMutation({
        mutationFn: async ({ 
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
        onSuccess: (_, variables) => {
            console.log('Comment deleted successfully:', variables.commentId);
        },
        onError: (error) => {
            console.error('Error deleting comment:', error.message);
            alert(`Error deleting comment: ${error.message}`);
        },
    });
};

/**
 * Hook for batch loading comments for multiple posts
 */
export const useBatchComments = (postIds: ResId[], pageParams?: string) => {
    const { data: authData, isAuthenticated } = useAuthStore();
    const { commentDataService } = useCommentServices();

    return useQuery({
        queryKey: ['batchComments', postIds, pageParams],
        queryFn: async () => {
            return await commentDataService.getCommentsForMultiplePosts(postIds, pageParams);
        },
        enabled: isAuthenticated && postIds.length > 0,
        staleTime: 1000 * 60 * 3, // 3 minutes
        refetchInterval: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
    });
};

/**
 * Hook for comment cache management
 */
export const useCommentCacheManagement = () => {
    const { commentDataService } = useCommentServices();

    const invalidatePostComments = (postId: ResId) => {
        commentDataService.invalidatePostComments(postId);
    };

    const invalidateAllComments = () => {
        commentDataService.invalidateAllCommentCaches();
    };

    const getCacheStats = () => {
        return commentDataService.getCacheStats();
    };

    const warmupCache = async (postIds: ResId[], pageParams?: string) => {
        await commentDataService.warmupCache(postIds, pageParams);
    };

    const healthCheck = async () => {
        return await commentDataService.healthCheck();
    };

    return {
        invalidatePostComments,
        invalidateAllComments,
        getCacheStats,
        warmupCache,
        healthCheck,
    };
};
