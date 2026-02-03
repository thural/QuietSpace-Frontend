/**
 * Feed WebSocket Example Component
 * 
 * Demonstrates how to use the Feed WebSocket Adapter for real-time feed functionality.
 * Shows integration with enterprise WebSocket infrastructure while maintaining
 * backward compatibility with existing feed components.
 */

import React, { useEffect, useState, useCallback } from 'react';
import { useDIContainer } from '@/core/modules/dependency-injection';
import { 
  FeedWebSocketAdapter,
  type IFeedWebSocketAdapter,
  type FeedAdapterConfig,
  type FeedEventHandlers,
  type PostResponse,
  type FeedSubscriptionOptions
} from './index';
import { ResId } from '@/shared/api/models/common';

interface FeedWebSocketExampleProps {
  userId: ResId;
  onPostCreated?: (post: PostResponse) => void;
  onPostUpdated?: (post: PostResponse) => void;
  onPostDeleted?: (postId: ResId) => void;
  onTrendingUpdate?: (trendingPosts: PostResponse[]) => void;
}

/**
 * Example component demonstrating Feed WebSocket Adapter usage
 */
export const FeedWebSocketExample: React.FC<FeedWebSocketExampleProps> = ({
  userId,
  onPostCreated,
  onPostUpdated,
  onPostDeleted,
  onTrendingUpdate
}) => {
  const [adapter, setAdapter] = useState<IFeedWebSocketAdapter | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [trendingPosts, setTrendingPosts] = useState<PostResponse[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [config, setConfig] = useState<FeedAdapterConfig | null>(null);
  const [error, setError] = useState<string | null>(null);

  const container = useDIContainer();

  // Initialize adapter
  useEffect(() => {
    const initializeAdapter = async () => {
      try {
        // Create adapter instance
        const feedAdapter = new FeedWebSocketAdapter(
          container.resolve('enterpriseWebSocketService'),
          container.resolve('messageRouter'),
          container.resolve('webSocketCacheManager')
        );

        // Configure adapter
        const adapterConfig: Partial<FeedAdapterConfig> = {
          enableRealtimeUpdates: true,
          enableTrendingUpdates: true,
          enableBatchProcessing: true,
          enableFeedRefresh: true,
          enablePollUpdates: true,
          enableCommentUpdates: true,
          enableReactionUpdates: true,
          batchSize: 5,
          batchTimeout: 3000,
          updateInterval: 5000,
          trendingRefreshInterval: 30000,
          maxCacheSize: 1000,
          cacheTTL: 300000,
          enableContentFiltering: true,
          enableSpamDetection: true,
          enableEngagementTracking: true,
          enablePersonalization: true
        };

        await feedAdapter.initialize(adapterConfig);
        setConfig(feedAdapter.getConfig());

        // Set up event handlers
        const eventHandlers: FeedEventHandlers = {
          onPostCreated: (post) => {
            setPosts(prev => [post, ...prev]);
            onPostCreated?.(post);
          },
          onPostUpdated: (post) => {
            setPosts(prev => 
              prev.map(p => p.id === post.id ? post : p)
            );
            onPostUpdated?.(post);
          },
          onPostDeleted: (postId) => {
            setPosts(prev => prev.filter(p => p.id !== postId));
            onPostDeleted?.(postId);
          },
          onReactionAdded: (postId, userId, reactionType) => {
            console.log(`Reaction added: ${reactionType} to post ${postId} by user ${userId}`);
          },
          onReactionRemoved: (postId, userId, reactionType) => {
            console.log(`Reaction removed: ${reactionType} from post ${postId} by user ${userId}`);
          },
          onCommentAdded: (postId, comment) => {
            console.log(`Comment added to post ${postId} by ${comment.userId}: ${comment.content}`);
          },
          onCommentRemoved: (postId, commentId) => {
            console.log(`Comment ${commentId} removed from post ${postId}`);
          },
          onPollCreated: (postId, poll) => {
            console.log(`Poll created for post ${postId}`);
          },
          onPollVoted: (postId, pollId, userId, option) => {
            console.log(`User ${userId} voted ${option} in poll ${pollId} for post ${postId}`);
          },
          onFeedRefresh: (feedId, feedPosts) => {
            console.log(`Feed ${feedId} refreshed with ${feedPosts.length} posts`);
          },
          onTrendingUpdate: (trendingPosts) => {
            setTrendingPosts(trendingPosts);
            onTrendingUpdate?.(trendingPosts);
          },
          onBatchUpdate: (batch) => {
            console.log(`Batch update processed: ${batch.updates.length} updates`);
          },
          onConnectionChange: (connected) => {
            setIsConnected(connected);
          },
          onError: (error) => {
            setError(error.message);
          }
        };

        feedAdapter.setEventHandlers(eventHandlers);

        // Subscribe to posts
        const subscriptionOptions: FeedSubscriptionOptions = {
          includeTypes: ['text', 'image', 'video', 'poll'],
          includeReactions: true,
          includeComments: true,
          includePolls: true,
          includeTrending: true,
          priority: 'normal',
          enableBatching: true
        };

        const unsubscribePosts = feedAdapter.subscribeToPosts(
          (post) => {
            setPosts(prev => [post, ...prev]);
          },
          subscriptionOptions
        );

        const unsubscribeTrending = feedAdapter.subscribeToTrendingUpdates(
          (trending) => {
            setTrendingPosts(trending);
          }
        );

        const unsubscribeReactions = feedAdapter.subscribeToReactions(
          (postId, userId, reactionType, action) => {
            console.log(`Reaction ${action}: ${reactionType} on post ${postId} by user ${userId}`);
          }
        );

        const unsubscribeComments = feedAdapter.subscribeToComments(
          (postId, comment, action) => {
            console.log(`Comment ${action}: ${comment.content} on post ${postId}`);
          }
        );

        setAdapter(feedAdapter);
        setIsConnected(feedAdapter.isConnected);

        // Cleanup function
        return () => {
          unsubscribePosts();
          unsubscribeTrending();
          unsubscribeReactions();
          unsubscribeComments();
        };

      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to initialize adapter');
      }
    };

    initializeAdapter();
  }, [userId, container, onPostCreated, onPostUpdated, onPostDeleted, onTrendingUpdate]);

  // Update metrics periodically
  useEffect(() => {
    if (!adapter) return;

    const interval = setInterval(() => {
      const currentMetrics = adapter.getMetrics();
      setMetrics(currentMetrics);
    }, 5000);

    return () => clearInterval(interval);
  }, [adapter]);

  // Send test post
  const sendTestPost = useCallback(async () => {
    if (!adapter || !isConnected) {
      setError('Not connected to feed service');
      return;
    }

    try {
      const testPost: PostResponse = {
        id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        text: `Test post created at ${new Date().toLocaleTimeString()}`,
        createDate: new Date().toISOString(),
        likeCount: 0,
        commentCount: 0,
        metadata: {
          priority: 'normal',
          source: 'example_component'
        }
      };

      await adapter.sendPostCreated(testPost);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to send post');
    }
  }, [adapter, isConnected, userId]);

  // Send test reaction
  const sendTestReaction = useCallback(async (postId: string, reactionType: string) => {
    if (!adapter || !isConnected) return;

    try {
      await adapter.sendReactionAdded(postId as ResId, userId, reactionType);
    } catch (error) {
      console.error('Failed to send reaction:', error);
    }
  }, [adapter, isConnected, userId]);

  // Send test comment
  const sendTestComment = useCallback(async (postId: string, content: string) => {
    if (!adapter || !isConnected) return;

    try {
      const comment = {
        id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        postId: postId as ResId,
        userId,
        content,
        createdAt: new Date().toISOString(),
        likeCount: 0,
        replyCount: 0
      };

      await adapter.sendCommentAdded(postId as ResId, comment);
    } catch (error) {
      console.error('Failed to send comment:', error);
    }
  }, [adapter, isConnected, userId]);

  // Send test trending update
  const sendTestTrendingUpdate = useCallback(async () => {
    if (!adapter || !isConnected) return;

    try {
      const testTrendingPosts = posts.slice(0, 5).map(post => ({
        ...post,
        likeCount: Math.floor(Math.random() * 100) + 50,
        commentCount: Math.floor(Math.random() * 50) + 10
      }));

      await adapter.sendTrendingUpdate(testTrendingPosts);
    } catch (error) {
      console.error('Failed to send trending update:', error);
    }
  }, [adapter, isConnected, posts]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (adapter) {
        adapter.cleanup();
      }
    };
  }, [adapter]);

  return (
    <div className="feed-websocket-example">
      <div className="feed-header">
        <h3>Feed WebSocket Example</h3>
        <div className="connection-status">
          Status: {isConnected ? 'Connected' : 'Disconnected'}
        </div>
      </div>

      {error && (
        <div className="error-message">
          Error: {error}
        </div>
      )}

      <div className="feed-info">
        <div>User ID: {userId}</div>
        <div>Posts: {posts.length}</div>
        <div>Trending Posts: {trendingPosts.length}</div>
        {config && (
          <div>Batch Processing: {config.enableBatchProcessing ? 'Enabled' : 'Disabled'}</div>
        )}
      </div>

      <div className="metrics">
        <h4>Metrics:</h4>
        {metrics && (
          <pre>{JSON.stringify(metrics, null, 2)}</pre>
        )}
      </div>

      <div className="actions">
        <button onClick={sendTestPost} disabled={!isConnected}>
          Send Test Post
        </button>
        <button onClick={() => sendTestReaction('test_post_1', 'like')} disabled={!isConnected}>
          Send Test Like
        </button>
        <button onClick={() => sendTestComment('test_post_1', 'Test comment')} disabled={!isConnected}>
          Send Test Comment
        </button>
        <button onClick={sendTestTrendingUpdate} disabled={!isConnected}>
          Send Trending Update
        </button>
      </div>

      <div className="posts">
        <h4>Posts ({posts.length}):</h4>
        {posts.slice(0, 10).map((post) => (
          <div key={post.id} className="post-item">
            <div className="post-header">
              <strong>Post {post.id}</strong>
              <span className="post-time">
                {new Date(post.createDate).toLocaleTimeString()}
              </span>
            </div>
            <div className="post-content">{post.text}</div>
            <div className="post-stats">
              <span>Likes: {post.likeCount || 0}</span>
              <span>Comments: {post.commentCount || 0}</span>
            </div>
            <div className="post-actions">
              <button onClick={() => sendTestReaction(post.id, 'like')}>
                Like
              </button>
              <button onClick={() => sendTestComment(post.id, 'Nice post!')}>
                Comment
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="trending-posts">
        <h4>Trending Posts ({trendingPosts.length}):</h4>
        {trendingPosts.slice(0, 5).map((post) => (
          <div key={post.id} className="trending-post-item">
            <div className="trending-post-header">
              <strong>Trending Post {post.id}</strong>
              <span className="post-time">
                {new Date(post.createDate).toLocaleTimeString()}
              </span>
            </div>
            <div className="post-content">{post.text}</div>
            <div className="trending-stats">
              <span>Likes: {post.likeCount || 0}</span>
              <span>Comments: {post.commentCount || 0}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="configuration">
        <h4>Configuration:</h4>
        {config && (
          <pre>{JSON.stringify(config, null, 2)}</pre>
        )}
      </div>
    </div>
  );
};

export default FeedWebSocketExample;
