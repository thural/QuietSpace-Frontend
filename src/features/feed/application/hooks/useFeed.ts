/**
 * Feed Hook - Proper Hook Layer Implementation
 * 
 * Provides UI logic and state transformation for feed operations.
 * Follows the correct architectural pattern: Component → Hook → DI Container → Service
 */

import { useCallback, useState } from 'react';
import { useService } from '@core/di';
import { TYPES } from '@core/di/types';
import { FeedFeatureService } from '../services/FeedService';
import type { PostResponse } from '@/features/feed/data/models/post';

export interface FeedState {
  posts: PostResponse[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
}

export interface FeedActions {
  loadPosts: (page?: number) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
  unlikePost: (postId: string) => Promise<void>;
  commentPost: (postId: string, content: string) => Promise<void>;
  repostPost: (postId: string, content?: string) => Promise<void>;
  refreshFeed: () => Promise<void>;
}

/**
 * Feed Hook - Provides feed functionality to components
 * 
 * This hook encapsulates all feed-related UI logic and state management.
 * Components should only use this hook, never access services directly.
 */
export const useFeed = (): FeedState & FeedActions => {
  const feedService = useService<FeedFeatureService>(TYPES.FEED_FEATURE_SERVICE);

  const [state, setState] = useState<FeedState>({
    posts: [],
    loading: false,
    error: null,
    hasMore: true
  });

  const loadPosts = useCallback(async (page: number = 0) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const feed = await feedService.loadFeed({ page, size: 20 }, 'mock-token');
      setState(prev => ({
        ...prev,
        posts: page === 0 ? feed.items?.map(item => item.post) || [] : [...prev.posts, ...(feed.items?.map(item => item.post) || [])],
        loading: false,
        hasMore: feed.items?.length === 20
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load posts'
      }));
    }
  }, [feedService]);

  const likePost = useCallback(async (postId: string) => {
    try {
      await feedService.interactWithPost('like', { postId, userId: 'mock-user-id' }, 'mock-token');
      setState(prev => ({
        ...prev,
        posts: prev.posts.map(post =>
          post.id === postId
            ? { ...post, likeCount: post.likeCount + 1, userReaction: { ...post.userReaction, type: 'like' } }
            : post
        )
      }));
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  }, [feedService]);

  const unlikePost = useCallback(async (postId: string) => {
    try {
      await feedService.interactWithPost('dislike', { postId, userId: 'mock-user-id' }, 'mock-token');
      setState(prev => ({
        ...prev,
        posts: prev.posts.map(post =>
          post.id === postId
            ? { ...post, likeCount: Math.max(0, post.likeCount - 1), userReaction: { ...post.userReaction, type: null } }
            : post
        )
      }));
    } catch (error) {
      console.error('Failed to unlike post:', error);
    }
  }, [feedService]);

  const commentPost = useCallback(async (postId: string, content: string) => {
    try {
      await feedService.createCommentWithValidation({
        postId: postId as any,
        userId: 'mock-user-id' as any,
        text: content
      });
      await loadPosts(0);
    } catch (error) {
      console.error('Failed to comment on post:', error);
    }
  }, [feedService, loadPosts]);

  const repostPost = useCallback(async (postId: string, content?: string) => {
    try {
      await feedService.createPostWithValidation({
        userId: 'mock-user-id' as any,
        text: content || '',
        viewAccess: 'anyone'
      }, 'mock-token');
      await loadPosts(0);
    } catch (error) {
      console.error('Failed to repost:', error);
    }
  }, [feedService, loadPosts]);

  const refreshFeed = useCallback(async () => {
    await loadPosts(0);
  }, [loadPosts]);

  return {
    ...state,
    loadPosts,
    likePost,
    unlikePost,
    commentPost,
    repostPost,
    refreshFeed
  };
};

export default useFeed;
