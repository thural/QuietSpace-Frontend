import { useCallback } from 'react';

/**
 * Feed Component Hook
 * 
 * High-level hook for React components that provides a clean API
 * for feed operations following the 7-layer architecture:
 * Component → Hook → DI → Service → Data → Cache/Repository/WebSocket
 * 
 * This is the highest layer that components should interact with
 */

// Type definitions for the hook
interface Post {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  likes: string[];
  likeCount: number;
  comments: any[];
  commentCount: number;
  createdAt: string;
  updatedAt: string;
  isOptimistic?: boolean;
}

interface Comment {
  id: string;
  postId: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  createdAt: string;
  isOptimistic?: boolean;
}

interface FeedOptions {
  page?: number;
  limit?: number;
  userId?: string;
  filters?: {
    contentType?: 'text' | 'image' | 'video';
    dateRange?: {
      start: string;
      end: string;
    };
  };
}

interface CreatePostData {
  content: string;
  images?: string[];
  tags?: string[];
}

interface CommentData {
  content: string;
  parentId?: string;
}

/**
 * Main feed component hook
 */
export function useFeedComponent(options: FeedOptions = {}) {
  // This would normally import and use the data layer hook
  // For now, we'll create a mock implementation that shows the structure
  
  const {
    page = 1,
    limit = 20,
    userId,
    filters = {},
  } = options;

  // Mock data - in real implementation this would come from useFeedDataLayer
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  /**
   * Load feed posts
   */
  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In real implementation:
      // const { data } = useFeedPosts(options);
      
      // Mock implementation:
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockPosts: Post[] = [
        {
          id: '1',
          content: 'Hello world!',
          author: { id: 'user1', name: 'John Doe', avatar: '/avatar1.jpg' },
          likes: ['user2', 'user3'],
          likeCount: 2,
          comments: [],
          commentCount: 0,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
        },
        {
          id: '2',
          content: 'This is a test post',
          author: { id: 'user2', name: 'Jane Smith', avatar: '/avatar2.jpg' },
          likes: ['user1'],
          likeCount: 1,
          comments: [],
          commentCount: 0,
          createdAt: '2024-01-15T09:30:00Z',
          updatedAt: '2024-01-15T09:30:00Z',
        },
      ];
      
      setPosts(mockPosts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  }, [page, limit, userId, filters]);

  /**
   * Create a new post
   */
  const createPost = useCallback(async (postData: CreatePostData) => {
    // In real implementation:
    // const { mutateAsync } = useCreatePost();
    // return await mutateAsync(postData);
    
    // Mock implementation with optimistic update:
    const tempId = `temp_${Date.now()}`;
    const optimisticPost: Post = {
      id: tempId,
      content: postData.content,
      author: { id: 'current-user', name: 'Current User', avatar: '/current-avatar.jpg' },
      likes: [],
      likeCount: 0,
      comments: [],
      commentCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isOptimistic: true,
    };

    // Optimistic update
    setPosts(prev => [optimisticPost, ...prev]);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Replace optimistic post with real post
      const realPost: Post = {
        ...optimisticPost,
        id: 'new-post-id',
        isOptimistic: false,
      };
      
      setPosts(prev => prev.map(post => 
        post.id === tempId ? realPost : post
      ));
      
      return realPost;
    } catch (err) {
      // Rollback optimistic update
      setPosts(prev => prev.filter(post => post.id !== tempId));
      throw err;
    }
  }, []);

  /**
   * Toggle like on a post
   */
  const toggleLike = useCallback(async (postId: string, userId: string) => {
    // In real implementation:
    // const { mutateAsync } = useTogglePostLike();
    // return await mutateAsync({ postId, userId });
    
    // Mock implementation with optimistic update:
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const isLiked = post.likes.includes(userId);
        const newLikes = isLiked 
          ? post.likes.filter(id => id !== userId)
          : [...post.likes, userId];
        
        return {
          ...post,
          likes: newLikes,
          likeCount: newLikes.length,
          isOptimistic: true,
        };
      }
      return post;
    }));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update with real data
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          const isLiked = post.likes.includes(userId);
          return {
            ...post,
            isOptimistic: false,
          };
        }
        return post;
      }));
      
    } catch (err) {
      // Rollback would happen here in real implementation
      console.error('Failed to toggle like:', err);
    }
  }, []);

  /**
   * Add comment to a post
   */
  const addComment = useCallback(async (postId: string, commentData: CommentData) => {
    // In real implementation:
    // const { mutateAsync } = useAddComment();
    // return await mutateAsync({ postId, commentData });
    
    // Mock implementation:
    const tempId = `temp_${Date.now()}`;
    const optimisticComment: Comment = {
      id: tempId,
      postId,
      content: commentData.content,
      author: { id: 'current-user', name: 'Current User', avatar: '/current-avatar.jpg' },
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };

    // Update post with new comment
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [optimisticComment, ...post.comments],
          commentCount: post.commentCount + 1,
        };
      }
      return post;
    }));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Replace optimistic comment with real comment
      const realComment: Comment = {
        ...optimisticComment,
        id: 'new-comment-id',
        isOptimistic: false,
      };
      
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments.map(comment => 
              comment.id === tempId ? realComment : comment
            ),
          };
        }
        return post;
      }));
      
      return realComment;
    } catch (err) {
      // Rollback optimistic update
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments.filter(comment => comment.id !== tempId),
            commentCount: post.commentCount - 1,
          };
        }
        return post;
      }));
      throw err;
    }
  }, []);

  /**
   * Refresh feed
   */
  const refresh = useCallback(() => {
    // In real implementation:
    // const { refetch } = useFeedPosts(options);
    // return refetch();
    
    return loadPosts();
  }, [loadPosts]);

  /**
   * Load more posts (pagination)
   */
  const loadMore = useCallback(async () => {
    // In real implementation:
    // const { fetchNextPage, hasNextPage } = useInfiniteFeedPosts(options);
    // if (hasNextPage) {
    //   await fetchNextPage();
    // }
    
    // Mock implementation:
    const nextPage = page + 1;
    // Simulate loading more posts
    await new Promise(resolve => setTimeout(resolve, 1000));
    // In real implementation, this would append new posts to the existing list
  }, [page]);

  // Load initial posts
  React.useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  return {
    // Data
    posts,
    loading,
    error,
    
    // Actions
    createPost,
    toggleLike,
    addComment,
    refresh,
    loadMore,
    
    // Computed values
    hasPosts: posts.length > 0,
    isEmpty: !loading && posts.length === 0,
    
    // Cache operations (exposed for advanced use cases)
    // In real implementation, these would come from cacheOperations
    updateCache: (postId: string, data: Partial<Post>) => {
      setPosts(prev => prev.map(post => 
        post.id === postId ? { ...post, ...data } : post
      ));
    },
    invalidateCache: () => {
      // In real implementation, this would invalidate the feed cache
      loadPosts();
    },
  };
}

/**
 * Individual post component hook
 */
export function usePostComponent(postId: string) {
  // This would normally use usePostOperations(postId)
  // For now, we'll show the structure
  
  const [post, setPost] = React.useState<Post | null>(null);
  const [comments, setComments] = React.useState<Comment[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  /**
   * Load post details
   */
  const loadPost = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In real implementation:
      // const { data } = usePost(postId);
      
      // Mock implementation:
      await new Promise(resolve => setTimeout(resolve, 500));
      const mockPost: Post = {
        id: postId,
        content: 'This is a post detail',
        author: { id: 'user1', name: 'John Doe', avatar: '/avatar1.jpg' },
        likes: ['user2'],
        likeCount: 1,
        comments: [],
        commentCount: 0,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      };
      
      setPost(mockPost);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load post');
    } finally {
      setLoading(false);
    }
  }, [postId]);

  /**
   * Load post comments
   */
  const loadComments = useCallback(async () => {
    try {
      // In real implementation:
      // const { data } = usePostComments(postId);
      
      // Mock implementation:
      await new Promise(resolve => setTimeout(resolve, 300));
      const mockComments: Comment[] = [
        {
          id: 'comment1',
          postId,
          content: 'Great post!',
          author: { id: 'user2', name: 'Jane Smith', avatar: '/avatar2.jpg' },
          createdAt: '2024-01-15T10:30:00Z',
        },
      ];
      
      setComments(mockComments);
    } catch (err) {
      console.error('Failed to load comments:', err);
    }
  }, [postId]);

  /**
   * Toggle like on this post
   */
  const toggleLike = useCallback(async (userId: string) => {
    if (!post) return;
    
    // In real implementation:
    // const { mutateAsync } = useTogglePostLike();
    // await mutateAsync({ postId, userId });
    
    // Mock optimistic update:
    const isLiked = post.likes.includes(userId);
    const newLikes = isLiked 
      ? post.likes.filter(id => id !== userId)
      : [...post.likes, userId];
    
    setPost({
      ...post,
      likes: newLikes,
      likeCount: newLikes.length,
      isOptimistic: true,
    });

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setPost(prev => prev ? { ...prev, isOptimistic: false } : null);
    } catch (err) {
      // Rollback
      setPost(post);
    }
  }, [post]);

  /**
   * Add comment to this post
   */
  const addComment = useCallback(async (commentData: CommentData) => {
    // In real implementation:
    // const { mutateAsync } = useAddComment();
    // return await mutateAsync({ postId, commentData });
    
    // Mock implementation:
    const tempId = `temp_${Date.now()}`;
    const optimisticComment: Comment = {
      id: tempId,
      postId,
      content: commentData.content,
      author: { id: 'current-user', name: 'Current User', avatar: '/current-avatar.jpg' },
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };

    setComments(prev => [optimisticComment, ...prev]);
    
    if (post) {
      setPost({
        ...post,
        commentCount: post.commentCount + 1,
      });
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const realComment: Comment = {
        ...optimisticComment,
        id: 'new-comment-id',
        isOptimistic: false,
      };
      
      setComments(prev => prev.map(comment => 
        comment.id === tempId ? realComment : comment
      ));
      
      return realComment;
    } catch (err) {
      // Rollback
      setComments(prev => prev.filter(comment => comment.id !== tempId));
      if (post) {
        setPost({
          ...post,
          commentCount: post.commentCount - 1,
        });
      }
      throw err;
    }
  }, [post]);

  // Load initial data
  React.useEffect(() => {
    loadPost();
    loadComments();
  }, [loadPost, loadComments]);

  return {
    // Data
    post,
    comments,
    loading,
    error,
    
    // Actions
    toggleLike,
    addComment,
    refresh: () => {
      loadPost();
      loadComments();
    },
    
    // Computed values
    isLikedByUser: (userId: string) => post?.likes.includes(userId) || false,
  };
}

// Add React import for the mock implementation
import React from 'react';
