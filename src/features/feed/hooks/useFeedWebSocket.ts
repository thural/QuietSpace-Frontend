/**
 * Feed WebSocket Hook
 * 
 * Specialized hook for feed WebSocket functionality.
 * Provides feed-specific operations with enterprise integration.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { useDIContainer } from '@/core/di';
import type { PostResponse } from '../data/models/post';

// Define types inline to avoid module resolution issues
export interface FeedWebSocketMessage {
  id: string;
  type: string;
  feature: 'feed';
  messageType: 'post_created' | 'post_updated' | 'post_deleted' | 'reaction_added' | 'reaction_removed' |
  'comment_added' | 'comment_removed' | 'poll_created' | 'poll_updated' | 'poll_voted' |
  'feed_refresh' | 'trending_update' | 'batch_update';
  userId?: string;
  postId?: string;
  data: any;
  timestamp: number;
}

export interface FeedEventHandlers {
  onPostCreated?: (post: PostResponse) => void;
  onPostUpdated?: (post: PostResponse) => void;
  onPostDeleted?: (postId: string) => void;
  onReactionAdded?: (postId: string, userId: string, reactionType: string) => void;
  onReactionRemoved?: (postId: string, userId: string, reactionType: string) => void;
  onCommentAdded?: (postId: string, comment: any) => void;
  onCommentRemoved?: (postId: string, commentId: string) => void;
  onPollVoted?: (postId: string, pollId: string, userId: string, option: string) => void;
  onFeedRefresh?: (feedId: string, posts: PostResponse[]) => void;
  onTrendingUpdate?: (trendingPosts: PostResponse[]) => void;
  onBatchUpdate?: (updates: any) => void;
  onError?: (error: any) => void;
  onConnectionChange?: (isConnected: boolean) => void;
}

export interface FeedSubscriptionOptions {
  feedId?: string;
  filters?: {
    userId?: string;
    tags?: string[];
    contentType?: string;
  };
  realTime?: boolean;
}

export interface TrendingUpdateData {
  posts: PostResponse[];
  timestamp: number;
  algorithm: string;
  timeWindow: string;
}

export interface BatchUpdateData {
  updates: any[];
  batchId: string;
  timestamp: number;
  userId?: string;
}

export interface IFeedWebSocketAdapter {
  initialize(config: any): Promise<void>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  get isConnected(): boolean;
  sendPostCreated(post: PostResponse): Promise<void>;
  sendPostUpdated(post: PostResponse): Promise<void>;
  sendPostDeleted(postId: string): Promise<void>;
  sendReactionAdded(postId: string, userId: string, reactionType: string): Promise<void>;
  sendReactionRemoved(postId: string, userId: string, reactionType: string): Promise<void>;
  sendCommentAdded(postId: string, comment: any): Promise<void>;
  sendCommentRemoved(postId: string, commentId: string): Promise<void>;
  sendPollVoted(postId: string, pollId: string, userId: string, option: string): Promise<void>;
  sendFeedRefresh(feedId: string, posts: PostResponse[]): Promise<void>;
  sendTrendingUpdate(trendingPosts: PostResponse[]): Promise<void>;
  subscribeToPosts(callback: (post: PostResponse) => void, options?: FeedSubscriptionOptions): () => void;
  subscribeToPostUpdates(callback: (post: PostResponse) => void): () => void;
  subscribeToTrendingUpdates(callback: (trendingPosts: PostResponse[]) => void): () => void;
  subscribeToReactions(callback: (postId: string, userId: string, reactionType: string, action: 'added' | 'removed') => void): () => void;
  subscribeToComments(callback: (postId: string, comment: any, action: 'added' | 'removed' | 'updated') => void): () => void;
  subscribeToBatchUpdates(callback: (updates: BatchUpdateData) => void): () => void;
  setEventHandlers(handlers: FeedEventHandlers): void;
  getMetrics(): any;
}

// Feed hook configuration
export interface UseFeedWebSocketConfig {
  autoConnect?: boolean;
  enableRealtimeUpdates?: boolean;
  enableTrendingUpdates?: boolean;
  enableBatchProcessing?: boolean;
  enablePersonalization?: boolean;
  maxPosts?: number;
  batchSize?: number;
  batchTimeout?: number;
  trendingRefreshInterval?: number;
  enableContentFiltering?: boolean;
}

// Feed hook state
export interface FeedWebSocketState {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  posts: PostResponse[];
  trendingPosts: PostResponse[];
  updates: FeedWebSocketMessage[];
  batches: BatchUpdateData[];
  metrics: any;
  preferences: any;
}

// Feed hook return value
export interface UseFeedWebSocketReturn extends FeedWebSocketState {
  // Connection management
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;

  // Post operations
  createPost: (content: string, options?: any) => Promise<void>;
  updatePost: (postId: string, content: string, options?: any) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;

  // Engagement operations
  addReaction: (postId: string, reactionType: string) => Promise<void>;
  removeReaction: (postId: string, reactionType: string) => Promise<void>;
  addComment: (postId: string, content: string) => Promise<void>;
  removeComment: (postId: string, commentId: string) => Promise<void>;
  votePoll: (postId: string, pollId: string, option: string) => Promise<void>;

  // Subscription management
  subscribeToPosts: (callback: (post: PostResponse) => void, options?: FeedSubscriptionOptions) => () => void;
  subscribeToPostUpdates: (callback: (post: PostResponse) => void) => () => void;
  subscribeToTrending: (callback: (trendingPosts: PostResponse[]) => void) => () => void;
  subscribeToEngagement: (callback: (postId: string, type: string, data: any) => void) => () => void;
  subscribeToBatches: (callback: (batch: BatchUpdateData) => void) => () => void;

  // Feed operations
  refreshFeed: (feedId?: string) => Promise<void>;
  getTrendingPosts: (algorithm?: string, timeWindow?: string) => Promise<void>;

  // Preference management
  updatePreferences: (preferences: any) => Promise<void>;
  getPreferences: () => Promise<any>;

  // Utilities
  clearPosts: () => void;
  getMetrics: () => any;
  reset: () => void;
}

/**
 * Feed WebSocket hook
 */
export function useFeedWebSocket(config: UseFeedWebSocketConfig = {}): UseFeedWebSocketReturn {
  const {
    autoConnect = true,
    enableRealtimeUpdates = true,
    enableTrendingUpdates = true,
    enableBatchProcessing = true,
    enablePersonalization = true,
    maxPosts = 100,
    batchSize = 10,
    batchTimeout = 2000,
    trendingRefreshInterval = 30000,
    enableContentFiltering = true
  } = config;

  const container = useDIContainer();
  const [state, setState] = useState<FeedWebSocketState>({
    isConnected: false,
    isConnecting: false,
    error: null,
    posts: [],
    trendingPosts: [],
    updates: [],
    batches: [],
    metrics: null,
    preferences: null
  });

  // Refs for cleanup and state management
  const adapterRef = useRef<IFeedWebSocketAdapter | null>(null);
  const subscriptionsRef = useRef<Map<string, () => void>>(new Map());
  const trendingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize adapter
  const initializeAdapter = useCallback(async () => {
    try {
      const adapter = container.resolve<IFeedWebSocketAdapter>('feedWebSocketAdapter');
      await adapter.initialize({
        enableRealtimeUpdates,
        enableTrendingUpdates,
        enableBatchProcessing,
        enablePersonalization,
        batchSize,
        batchTimeout,
        trendingRefreshInterval,
        maxCacheSize: maxPosts,
        cacheTTL: 300000,
        enableContentFiltering
      });

      adapterRef.current = adapter;

      // Set up event handlers
      const eventHandlers: FeedEventHandlers = {
        onPostCreated: (post) => {
          setState(prev => {
            const newPosts = [post, ...prev.posts.slice(0, maxPosts - 1)];
            return { ...prev, posts: newPosts };
          });
        },

        onPostUpdated: (post) => {
          setState(prev => ({
            ...prev,
            posts: prev.posts.map(p => p.id === post.id ? post : p)
          }));
        },

        onPostDeleted: (postId) => {
          setState(prev => ({
            ...prev,
            posts: prev.posts.filter(p => p.id !== postId)
          }));
        },

        onReactionAdded: (postId, userId, reactionType) => {
          setState(prev => ({
            ...prev,
            posts: prev.posts.map(p =>
              p.id === postId
                ? { ...p, likeCount: (p.likeCount || 0) + 1 }
                : p
            )
          }));
        },

        onReactionRemoved: (postId, userId, reactionType) => {
          setState(prev => ({
            ...prev,
            posts: prev.posts.map(p =>
              p.id === postId
                ? { ...p, likeCount: Math.max(0, (p.likeCount || 0) - 1) }
                : p
            )
          }));
        },

        onCommentAdded: (postId, comment) => {
          setState(prev => ({
            ...prev,
            posts: prev.posts.map(p =>
              p.id === postId
                ? { ...p, commentCount: (p.commentCount || 0) + 1 }
                : p
            )
          }));
        },

        onCommentRemoved: (postId, commentId) => {
          setState(prev => ({
            ...prev,
            posts: prev.posts.map(p =>
              p.id === postId
                ? { ...p, commentCount: Math.max(0, (p.commentCount || 0) - 1) }
                : p
            )
          }));
        },

        onPollVoted: (postId, pollId, userId, option) => {
          // Update poll vote counts - this would need more specific implementation
          setState(prev => ({
            ...prev,
            posts: prev.posts.map(p =>
              p.id === postId
                ? { ...p, engagementScore: (p.engagementScore || 0) + 1 }
                : p
            )
          }));
        },

        onFeedRefresh: (feedId, posts) => {
          setState(prev => ({
            ...prev,
            posts: posts.slice(0, maxPosts)
          }));
        },

        onTrendingUpdate: (trendingPosts) => {
          setState(prev => ({
            ...prev,
            trendingPosts: trendingPosts.slice(0, 50) // Keep top 50 trending
          }));
        },

        onBatchUpdate: (batch) => {
          setState(prev => ({
            ...prev,
            batches: [batch, ...prev.batches.slice(0, 49)] // Keep last 50 batches
          }));
        },

        onConnectionChange: (isConnected) => {
          setState(prev => ({
            ...prev,
            isConnected,
            isConnecting: false
          }));
        },

        onError: (error) => {
          setState(prev => ({
            ...prev,
            error: error.message,
            isConnecting: false
          }));
        }
      };

      adapter.setEventHandlers(eventHandlers);

      setState(prev => ({
        ...prev,
        isConnected: adapter.isConnected,
        metrics: adapter.getMetrics()
      }));

      // Load initial preferences
      if (enablePersonalization) {
        adapter.getPreferences().then(preferences => {
          setState(prev => ({ ...prev, preferences }));
        }).catch(error => {
          console.error('Failed to load feed preferences:', error);
        });
      }

    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to initialize feed adapter',
        isConnecting: false
      }));
    }
  }, [container, enableRealtimeUpdates, enableTrendingUpdates, enableBatchProcessing, enablePersonalization, batchSize, batchTimeout, trendingRefreshInterval, maxPosts, enableContentFiltering]);

  // Connect to WebSocket
  const connect = useCallback(async () => {
    if (!adapterRef.current) {
      await initializeAdapter();
    }

    if (!adapterRef.current) {
      throw new Error('Feed adapter not initialized');
    }

    setState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      await adapterRef.current.connect();

      setState(prev => ({
        ...prev,
        isConnected: true,
        isConnecting: false,
        error: null
      }));

      // Start trending updates if enabled
      if (enableTrendingUpdates && trendingIntervalRef.current) {
        trendingIntervalRef.current = setInterval(async () => {
          if (adapterRef.current) {
            try {
              await adapterRef.current.sendTrendingUpdate([]);
            } catch (error) {
              console.error('Failed to refresh trending posts:', error);
            }
          }
        }, trendingRefreshInterval);
      }

    } catch (error) {
      setState(prev => ({
        ...prev,
        isConnected: false,
        isConnecting: false,
        error: error instanceof Error ? error.message : 'Connection failed'
      }));
    }
  }, [initializeAdapter, enableTrendingUpdates, trendingRefreshInterval]);

  // Disconnect from WebSocket
  const disconnect = useCallback(async () => {
    if (trendingIntervalRef.current) {
      clearInterval(trendingIntervalRef.current);
      trendingIntervalRef.current = null;
    }

    // Clear all subscriptions
    subscriptionsRef.current.forEach(unsubscribe => unsubscribe());
    subscriptionsRef.current.clear();

    try {
      if (adapterRef.current) {
        await adapterRef.current.disconnect();
      }

      setState(prev => ({
        ...prev,
        isConnected: false,
        isConnecting: false,
        error: null
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Disconnection failed'
      }));
    }
  }, []);

  // Create post
  const createPost = useCallback(async (content: string, options?: any) => {
    if (!adapterRef.current) {
      throw new Error('Feed adapter not initialized');
    }

    try {
      const post: PostResponse = {
        id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: 'current_user', // This would come from auth context
        text: content,
        createDate: new Date().toISOString(),
        likeCount: 0,
        commentCount: 0,
        ...options
      };

      await adapterRef.current.sendPostCreated(post);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to create post'
      }));
      throw error;
    }
  }, []);

  // Update post
  const updatePost = useCallback(async (postId: string, content: string, options?: any) => {
    if (!adapterRef.current) {
      throw new Error('Feed adapter not initialized');
    }

    try {
      const post: PostResponse = {
        id: postId,
        userId: 'current_user',
        text: content,
        createDate: new Date().toISOString(),
        updateDate: new Date().toISOString(),
        ...options
      };

      await adapterRef.current.sendPostUpdated(post);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to update post'
      }));
      throw error;
    }
  }, []);

  // Delete post
  const deletePost = useCallback(async (postId: string) => {
    if (!adapterRef.current) {
      throw new Error('Feed adapter not initialized');
    }

    try {
      await adapterRef.current.sendPostDeleted(postId);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to delete post'
      }));
      throw error;
    }
  }, []);

  // Add reaction
  const addReaction = useCallback(async (postId: string, reactionType: string) => {
    if (!adapterRef.current) {
      throw new Error('Feed adapter not initialized');
    }

    try {
      await adapterRef.current.sendReactionAdded(postId, 'current_user', reactionType);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to add reaction'
      }));
      throw error;
    }
  }, []);

  // Remove reaction
  const removeReaction = useCallback(async (postId: string, reactionType: string) => {
    if (!adapterRef.current) {
      throw new Error('Feed adapter not initialized');
    }

    try {
      await adapterRef.current.sendReactionRemoved(postId, 'current_user', reactionType);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to remove reaction'
      }));
      throw error;
    }
  }, []);

  // Add comment
  const addComment = useCallback(async (postId: string, content: string) => {
    if (!adapterRef.current) {
      throw new Error('Feed adapter not initialized');
    }

    try {
      const comment = {
        id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        postId,
        userId: 'current_user',
        content,
        createdAt: new Date().toISOString(),
        likeCount: 0,
        replyCount: 0
      };

      await adapterRef.current.sendCommentAdded(postId, comment);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to add comment'
      }));
      throw error;
    }
  }, []);

  // Remove comment
  const removeComment = useCallback(async (postId: string, commentId: string) => {
    if (!adapterRef.current) {
      throw new Error('Feed adapter not initialized');
    }

    try {
      await adapterRef.current.sendCommentRemoved(postId, commentId);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to remove comment'
      }));
      throw error;
    }
  }, []);

  // Vote poll
  const votePoll = useCallback(async (postId: string, pollId: string, option: string) => {
    if (!adapterRef.current) {
      throw new Error('Feed adapter not initialized');
    }

    try {
      await adapterRef.current.sendPollVoted(postId, pollId, 'current_user', option);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to vote poll'
      }));
      throw error;
    }
  }, []);

  // Subscribe to posts
  const subscribeToPosts = useCallback((callback: (post: PostResponse) => void, options?: FeedSubscriptionOptions) => {
    if (!adapterRef.current) {
      throw new Error('Feed adapter not initialized');
    }

    const unsubscribe = adapterRef.current.subscribeToPosts(callback, options);
    subscriptionsRef.current.set('posts', unsubscribe);

    return () => {
      unsubscribe();
      subscriptionsRef.current.delete('posts');
    };
  }, []);

  // Subscribe to post updates
  const subscribeToPostUpdates = useCallback((callback: (post: PostResponse) => void) => {
    if (!adapterRef.current) {
      throw new Error('Feed adapter not initialized');
    }

    const unsubscribe = adapterRef.current.subscribeToPostUpdates(callback);
    subscriptionsRef.current.set('postUpdates', unsubscribe);

    return () => {
      unsubscribe();
      subscriptionsRef.current.delete('postUpdates');
    };
  }, []);

  // Subscribe to trending
  const subscribeToTrending = useCallback((callback: (trendingPosts: PostResponse[]) => void) => {
    if (!adapterRef.current) {
      throw new Error('Feed adapter not initialized');
    }

    const unsubscribe = adapterRef.current.subscribeToTrendingUpdates(callback);
    subscriptionsRef.current.set('trending', unsubscribe);

    return () => {
      unsubscribe();
      subscriptionsRef.current.delete('trending');
    };
  }, []);

  // Subscribe to engagement
  const subscribeToEngagement = useCallback((callback: (postId: string, type: string, data: any) => void) => {
    if (!adapterRef.current) {
      throw new Error('Feed adapter not initialized');
    }

    const unsubscribeReactions = adapterRef.current.subscribeToReactions((postId, userId, reactionType, action) => {
      callback(postId, 'reaction', { action, reactionType, userId });
    });

    const unsubscribeComments = adapterRef.current.subscribeToComments((postId, comment, action) => {
      callback(postId, 'comment', { action, comment });
    });

    const combinedUnsubscribe = () => {
      unsubscribeReactions();
      unsubscribeComments();
    };

    subscriptionsRef.current.set('engagement', combinedUnsubscribe);

    return combinedUnsubscribe;
  }, []);

  // Subscribe to batches
  const subscribeToBatches = useCallback((callback: (batch: BatchUpdateData) => void) => {
    if (!adapterRef.current) {
      throw new Error('Feed adapter not initialized');
    }

    const unsubscribe = adapterRef.current.subscribeToBatchUpdates(callback);
    subscriptionsRef.current.set('batches', unsubscribe);

    return () => {
      unsubscribe();
      subscriptionsRef.current.delete('batches');
    };
  }, []);

  // Refresh feed
  const refreshFeed = useCallback(async (feedId = 'main') => {
    if (!adapterRef.current) {
      throw new Error('Feed adapter not initialized');
    }

    try {
      await adapterRef.current.sendFeedRefresh(feedId, state.posts);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to refresh feed'
      }));
      throw error;
    }
  }, [state.posts]);

  // Get trending posts
  const getTrendingPosts = useCallback(async (algorithm = 'engagement', timeWindow = 'hour') => {
    if (!adapterRef.current) {
      throw new Error('Feed adapter not initialized');
    }

    try {
      await adapterRef.current.sendTrendingUpdate(state.trendingPosts);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to get trending posts'
      }));
      throw error;
    }
  }, [state.trendingPosts]);

  // Update preferences
  const updatePreferences = useCallback(async (preferences: any) => {
    if (!adapterRef.current) {
      throw new Error('Feed adapter not initialized');
    }

    try {
      // This would need to be implemented in the adapter
      setState(prev => ({ ...prev, preferences }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to update preferences'
      }));
      throw error;
    }
  }, []);

  // Get preferences
  const getPreferences = useCallback(async () => {
    if (!adapterRef.current) {
      throw new Error('Feed adapter not initialized');
    }

    try {
      // This would need to be implemented in the adapter
      return state.preferences;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to get preferences'
      }));
      throw error;
    }
  }, [state.preferences]);

  // Clear all posts
  const clearPosts = useCallback(() => {
    setState(prev => ({
      ...prev,
      posts: [],
      trendingPosts: [],
      updates: [],
      batches: []
    }));
  }, []);

  // Get metrics
  const getMetrics = useCallback(() => {
    if (!adapterRef.current) {
      return null;
    }

    const metrics = adapterRef.current.getMetrics();
    setState(prev => ({ ...prev, metrics }));
    return metrics;
  }, []);

  // Reset hook state
  const reset = useCallback(() => {
    disconnect();

    setState({
      isConnected: false,
      isConnecting: false,
      error: null,
      posts: [],
      trendingPosts: [],
      updates: [],
      batches: [],
      metrics: null,
      preferences: null
    });
  }, [disconnect]);

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      reset();
    };
  }, [autoConnect, connect, reset]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    ...state,
    connect,
    disconnect,
    createPost,
    updatePost,
    deletePost,
    addReaction,
    removeReaction,
    addComment,
    removeComment,
    votePoll,
    subscribeToPosts,
    subscribeToPostUpdates,
    subscribeToTrending,
    subscribeToEngagement,
    subscribeToBatches,
    refreshFeed,
    getTrendingPosts,
    updatePreferences,
    getPreferences,
    clearPosts,
    getMetrics,
    reset
  };
}

export default useFeedWebSocket;
