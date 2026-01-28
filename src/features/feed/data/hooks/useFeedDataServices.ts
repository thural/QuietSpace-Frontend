/**
 * Feed Data Service Hooks
 * 
 * React hooks that use the feed data services with the Data Service Module hooks
 */

import { useCallback } from 'react';
import { useQuery, useMutation, useInfiniteQuery } from '@/core/dataservice';
import { useDIContainer } from '@/core/di';
import { 
  createFeedDataService, 
  createPostDataService, 
  createCommentDataService 
} from '../services/FeedDataServicesDI';
import type { 
  FeedItem, 
  FeedQuery, 
  FeedDataServiceConfig 
} from '../services/FeedDataService';
import type { 
  Post, 
  PostQuery as PostQueryType, 
  PostRequest, 
  PostUpdate 
} from '../services/PostDataService';
import type { 
  Comment, 
  CommentQuery as CommentQueryType, 
  CommentRequest 
} from '../services/CommentDataService';

/**
 * Hook for fetching feed data
 */
export function useFeed(query: FeedQuery = {}) {
  const container = useDIContainer();
  const dataService = createFeedDataService(container);
  
  return useQuery(
    ['feed', query],
    () => dataService.getFeed(query),
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
      refetchOnWindowFocus: true,
      retry: 3
    }
  );
}

/**
 * Hook for infinite feed scrolling
 */
export function useInfiniteFeed(query: FeedQuery = {}) {
  const container = useDIContainer();
  const dataService = createFeedDataService(container);
  
  return useInfiniteQuery(
    'feed',
    ({ pageParam = 1 }) => dataService.getFeedNextPage(pageParam, query),
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
      staleTime: 1 * 60 * 1000 // 1 minute
    }
  );
}

/**
 * Hook for feed statistics
 */
export function useFeedStats() {
  const container = useDIContainer();
  const dataService = createFeedDataService(container);
  
  return useQuery(
    'feed-stats',
    () => dataService.getFeedStats(),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchInterval: 2 * 60 * 1000 // Refresh every 2 minutes
    }
  );
}

/**
 * Hook for marking feed items as viewed
 */
export function useMarkAsViewed() {
  const container = useDIContainer();
  const dataService = createFeedDataService(container);
  
  return useMutation(
    (itemId: string) => dataService.markAsViewed(itemId),
    {
      onSuccess: () => {
        console.log('Item marked as viewed');
      },
      onError: (error) => {
        console.error('Failed to mark item as viewed:', error);
      }
    }
  );
}

/**
 * Hook for fetching posts
 */
export function usePosts(query: PostQueryType = {}) {
  const container = useDIContainer();
  const dataService = createPostDataService(container);
  
  return useQuery(
    ['posts', query],
    () => dataService.getPosts(query),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: true,
      retry: 3
    }
  );
}

/**
 * Hook for fetching a single post
 */
export function usePost(id: string) {
  const container = useDIContainer();
  const dataService = createPostDataService(container);
  
  return useQuery(
    ['post', id],
    () => dataService.getPost(id),
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
      enabled: !!id,
      retry: 3
    }
  );
}

/**
 * Hook for creating posts
 */
export function useCreatePost() {
  const container = useDIContainer();
  const dataService = createPostDataService(container);
  
  return useMutation(
    (postData: PostRequest) => dataService.createPost(postData),
    {
      onSuccess: (data) => {
        console.log('Post created successfully:', data);
      },
      onError: (error) => {
        console.error('Failed to create post:', error);
      }
    }
  );
}

/**
 * Hook for updating posts
 */
export function useUpdatePost() {
  const container = useDIContainer();
  const dataService = createPostDataService(container);
  
  return useMutation(
    ({ id, updates }: { id: string; updates: PostUpdate }) => 
      dataService.updatePost(id, updates),
    {
      onSuccess: (data) => {
        console.log('Post updated successfully:', data);
      },
      onError: (error) => {
        console.error('Failed to update post:', error);
      }
    }
  );
}

/**
 * Hook for deleting posts
 */
export function useDeletePost() {
  const container = useDIContainer();
  const dataService = createPostDataService(container);
  
  return useMutation(
    (id: string) => dataService.deletePost(id),
    {
      onSuccess: () => {
        console.log('Post deleted successfully');
      },
      onError: (error) => {
        console.error('Failed to delete post:', error);
      }
    }
  );
}

/**
 * Hook for toggling post likes
 */
export function useTogglePostLike() {
  const container = useDIContainer();
  const dataService = createPostDataService(container);
  
  return useMutation(
    ({ postId, userId }: { postId: string; userId: string }) => 
      dataService.togglePostLike(postId, userId),
    {
      onSuccess: (result) => {
        console.log('Post like toggled:', result);
      },
      onError: (error) => {
        console.error('Failed to toggle post like:', error);
      }
    }
  );
}

/**
 * Hook for fetching comments for a post
 */
export function useComments(postId: string, query: CommentQueryType = {}) {
  const container = useDIContainer();
  const dataService = createCommentDataService(container);
  
  return useQuery(
    ['comments', postId, query],
    () => dataService.getCommentsByPostId(postId, query),
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
      enabled: !!postId,
      retry: 3
    }
  );
}

/**
 * Hook for infinite comments scrolling
 */
export function useInfiniteComments(postId: string, query: CommentQueryType = {}) {
  const container = useDIContainer();
  const dataService = createCommentDataService(container);
  
  return useInfiniteQuery(
    ['comments', postId],
    ({ pageParam = 1 }) => dataService.getCommentsNextPage(postId, pageParam, query),
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
      enabled: !!postId
    }
  );
}

/**
 * Hook for creating comments
 */
export function useCreateComment() {
  const container = useDIContainer();
  const dataService = createCommentDataService(container);
  
  return useMutation(
    (commentData: CommentRequest) => dataService.createComment(commentData),
    {
      onSuccess: (data) => {
        console.log('Comment created successfully:', data);
      },
      onError: (error) => {
        console.error('Failed to create comment:', error);
      }
    }
  );
}

/**
 * Hook for deleting comments
 */
export function useDeleteComment() {
  const container = useDIContainer();
  const dataService = createCommentDataService(container);
  
  return useMutation(
    (id: string) => dataService.deleteComment(id),
    {
      onSuccess: () => {
        console.log('Comment deleted successfully');
      },
      onError: (error) => {
        console.error('Failed to delete comment:', error);
      }
    }
  );
}

/**
 * Hook for real-time feed updates
 */
export function useFeedUpdates(callback: (update: FeedItem) => void) {
  const container = useDIContainer();
  const dataService = createFeedDataService(container);
  
  const subscribe = useCallback(() => {
    return dataService.subscribeToFeedUpdates(callback);
  }, [dataService, callback]);
  
  return { subscribe };
}

/**
 * Hook for real-time post updates
 */
export function usePostUpdates(postId: string, callback: (update: Post) => void) {
  const container = useDIContainer();
  const dataService = createPostDataService(container);
  
  const subscribe = useCallback(() => {
    return dataService.subscribeToPostUpdates(postId, callback);
  }, [dataService, postId, callback]);
  
  return { subscribe };
}

/**
 * Hook for real-time comment updates
 */
export function useCommentUpdates(postId: string, callback: (update: Comment) => void) {
  const container = useDIContainer();
  const dataService = createCommentDataService(container);
  
  const subscribe = useCallback(() => {
    return dataService.subscribeToCommentUpdates(postId, callback);
  }, [dataService, postId, callback]);
  
  return { subscribe };
}
