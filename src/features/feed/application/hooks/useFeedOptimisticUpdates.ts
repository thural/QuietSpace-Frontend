/**
 * Feed Optimistic Update Strategies.
 * 
 * Client-side optimistic updates for Feed feature.
 * Provides immediate UI feedback while server operations complete.
 * Integrates with React Query for cache management.
 */

import { useCallback } from 'react';
import { useFeedUIStore } from '../stores/feedUIStore';
import { useFeedRepository } from '../../di/useFeedDI';
import type { PostRequest, RepostRequest } from '@api/schemas/inferred/post';
import type { PostResponse } from '@api/schemas/inferred/post';

/**
 * Optimistic update result
 */
export interface OptimisticUpdateResult {
    id: string;
    type: 'create' | 'update' | 'delete' | 'repost';
    timestamp: Date;
    data: any;
    rollback: () => Promise<void>;
}

/**
 * Feed optimistic updates hook
 */
export const useFeedOptimisticUpdates = () => {
    const repository = useFeedRepository();
    const {
        addOptimisticUpdate,
        removeOptimisticUpdate,
        clearOptimisticUpdates,
        setError
    } = useFeedUIStore();

    /**
     * Optimistically create a new post
     */
    const createPostOptimistic = useCallback(async (post: PostRequest): Promise<PostResponse> => {
        const tempId = `temp-${Date.now()}`;
        const tempPost: PostResponse = {
            id: tempId,
            userId: 'current-user', // This would come from auth store
            username: 'current_user',
            title: post.title,
            text: post.text,
            createDate: new Date().toISOString(),
            updateDate: new Date().toISOString(),
            likeCount: 0,
            dislikeCount: 0,
            commentCount: 0,
            poll: post.poll ? {
                votedOption: null,
                voteCount: 0,
                options: post.poll.options.map(opt => ({ label: opt, voteShare: '0%' })),
                dueDate: post.poll.dueDate
            } : null,
            repost: null,
            photo: null,
            userReaction: null
        };

        // Add optimistic update
        addOptimisticUpdate({
            id: tempId,
            type: 'create',
            timestamp: new Date(),
            data: tempPost
        });

        try {
            // Attempt actual creation
            const result = await repository.createPost(post, 'dummy-token'); // Token would come from DI
            
            // Remove optimistic update on success
            removeOptimisticUpdate(tempId);
            
            return result;
        } catch (error) {
            // Remove optimistic update on error
            removeOptimisticUpdate(tempId);
            setError('Failed to create post');
            throw error;
        }
    }, [repository, addOptimisticUpdate, removeOptimisticUpdate, setError]);

    /**
     * Optimistically update an existing post
     */
    const updatePostOptimistic = useCallback(async (postId: string, post: PostRequest): Promise<PostResponse> => {
        // Store original post for rollback
        let originalPost: PostResponse | null = null;
        
        try {
            // Get current post for rollback
            originalPost = await repository.getPostById(postId, 'dummy-token');
        } catch (error) {
            console.warn('Could not fetch original post for rollback:', error);
        }

        // Create optimistic version
        const optimisticPost: PostResponse = {
            ...originalPost,
            title: post.title,
            text: post.text,
            updateDate: new Date().toISOString(),
            poll: post.poll ? {
                votedOption: null,
                voteCount: originalPost?.poll?.voteCount || 0,
                options: post.poll.options.map(opt => ({ label: opt, voteShare: '0%' })),
                dueDate: post.poll.dueDate
            } : originalPost?.poll
        };

        // Add optimistic update
        addOptimisticUpdate({
            id: postId,
            type: 'update',
            timestamp: new Date(),
            data: optimisticPost
        });

        // Create rollback function
        const rollback = async () => {
            if (originalPost) {
                addOptimisticUpdate({
                    id: postId,
                    type: 'update',
                    timestamp: new Date(),
                    data: originalPost
                });
                
                // Remove rollback after delay
                setTimeout(() => {
                    removeOptimisticUpdate(postId);
                }, 1000);
            }
        };

        try {
            // Attempt actual update
            const result = await repository.editPost(postId, post, 'dummy-token');
            
            // Remove optimistic update on success
            removeOptimisticUpdate(postId);
            
            return result;
        } catch (error) {
            // Trigger rollback on error
            await rollback();
            setError('Failed to update post');
            throw error;
        }
    }, [repository, addOptimisticUpdate, removeOptimisticUpdate, setError]);

    /**
     * Optimistically delete a post
     */
    const deletePostOptimistic = useCallback(async (postId: string): Promise<void> => {
        // Store original post for rollback
        let originalPost: PostResponse | null = null;
        
        try {
            originalPost = await repository.getPostById(postId, 'dummy-token');
        } catch (error) {
            console.warn('Could not fetch original post for rollback:', error);
        }

        // Add optimistic update for deletion
        addOptimisticUpdate({
            id: postId,
            type: 'delete',
            timestamp: new Date(),
            data: { deleted: true, originalPost }
        });

        // Create rollback function
        const rollback = async () => {
            if (originalPost) {
                addOptimisticUpdate({
                    id: postId,
                    type: 'update',
                    timestamp: new Date(),
                    data: originalPost
                });
                
                // Remove rollback after delay
                setTimeout(() => {
                    removeOptimisticUpdate(postId);
                }, 1000);
            }
        };

        try {
            // Attempt actual deletion
            await repository.deletePost(postId, 'dummy-token');
            
            // Remove optimistic update on success
            removeOptimisticUpdate(postId);
            
        } catch (error) {
            // Trigger rollback on error
            await rollback();
            setError('Failed to delete post');
            throw error;
        }
    }, [repository, addOptimisticUpdate, removeOptimisticUpdate, setError]);

    /**
     * Optimistically create a repost
     */
    const createRepostOptimistic = useCallback(async (repost: RepostRequest): Promise<PostResponse> => {
        const tempId = `temp-repost-${Date.now()}`;
        
        // Add optimistic update
        addOptimisticUpdate({
            id: tempId,
            type: 'repost',
            timestamp: new Date(),
            data: { repost, isRepost: true }
        });

        try {
            // Attempt actual repost creation
            const result = await repository.createRepost(repost, 'dummy-token');
            
            // Remove optimistic update on success
            removeOptimisticUpdate(tempId);
            
            return result;
        } catch (error) {
            // Remove optimistic update on error
            removeOptimisticUpdate(tempId);
            setError('Failed to create repost');
            throw error;
        }
    }, [repository, addOptimisticUpdate, removeOptimisticUpdate, setError]);

    /**
     * Clear all optimistic updates
     */
    const clearAllOptimisticUpdates = useCallback(() => {
        clearOptimisticUpdates();
    }, [clearOptimisticUpdates]);

    return {
        createPostOptimistic,
        updatePostOptimistic,
        deletePostOptimistic,
        createRepostOptimistic,
        clearAllOptimisticUpdates
    };
};
