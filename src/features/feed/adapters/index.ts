/**
 * Feed WebSocket Adapters
 * 
 * Exports all feed WebSocket adapter components and types.
 * Provides enterprise-grade WebSocket functionality for feed features.
 */

// Main adapter
export { FeedWebSocketAdapter } from './FeedWebSocketAdapter';

// Message handlers
export { FeedMessageHandlers } from './FeedMessageHandlers';

// Migration utilities
export { 
  useFeedSocketMigration,
  useFeedMigrationMonitor,
  type FeedMigrationConfig,
  type FeedMigrationState,
  type UseFeedSocketMigrationReturn
} from './FeedSocketMigration';

// Types and interfaces
export {
  // Core types
  type FeedWebSocketMessage,
  type FeedMessageData,
  type ReactionData,
  type CommentData,
  type PollVoteData,
  type TrendingUpdateData,
  type FeedRefreshData,
  type BatchUpdateData,
  
  // Configuration
  type FeedAdapterConfig,
  
  // Metrics and monitoring
  type FeedAdapterMetrics,
  type FeedWebSocketError,
  
  // Event handlers
  type FeedEventHandlers,
  
  // Subscriptions
  type FeedSubscriptionOptions,
  type FeedQueue,
  type QueuedUpdate,
  
  // Cache
  type FeedCacheKeys,
  
  // Feature configuration
  type FeedWebSocketFeatureConfig,
  
  // Interfaces
  type IFeedWebSocketAdapter,
  type IFeedWebSocketFactory,
  
  // Type guards
  isFeedWebSocketMessage,
  isFeedMessageData,
  isReactionData,
  isCommentData,
  isPollVoteData,
  isTrendingUpdateData,
  isBatchUpdateData,
  isFeedWebSocketError
} from './FeedWebSocketTypes';

// Constants
export const FEED_WEBSOCKET_FEATURE_NAME = 'feed';

export const DEFAULT_FEED_ADAPTER_CONFIG = {
  enableRealtimeUpdates: true,
  enableTrendingUpdates: true,
  enableBatchProcessing: true,
  enableFeedRefresh: true,
  enablePollUpdates: true,
  enableCommentUpdates: true,
  enableReactionUpdates: true,
  batchSize: 10,
  batchTimeout: 2000,
  updateInterval: 5000,
  trendingRefreshInterval: 30000,
  maxCacheSize: 1000,
  cacheTTL: 300000,
  enableContentFiltering: true,
  enableSpamDetection: true,
  enableEngagementTracking: true,
  enablePersonalization: true
};

export const FEED_CACHE_KEYS: FeedCacheKeys = {
  posts: (postId: string) => `feed:post:${postId}`,
  userFeed: (userId: string) => `feed:user:${userId}:feed`,
  trending: (algorithm: string, timeWindow: string) => `feed:trending:${algorithm}:${timeWindow}`,
  comments: (postId: string) => `feed:post:${postId}:comments`,
  reactions: (postId: string) => `feed:post:${postId}:reactions`,
  polls: (postId: string) => `feed:post:${postId}:poll`,
  batch: (batchId: string) => `feed:batch:${batchId}`,
  userPreferences: (userId: string) => `feed:user:${userId}:preferences`,
  engagement: (postId: string) => `feed:post:${postId}:engagement`
};

export const FEED_WEBSOCKET_EVENTS = {
  // Post events
  POST_CREATED: 'feed:post:created',
  POST_UPDATED: 'feed:post:updated',
  POST_DELETED: 'feed:post:deleted',
  POST_PROCESSED: 'feed:post:processed',
  
  // Engagement events
  REACTION_ADDED: 'feed:reaction:added',
  REACTION_REMOVED: 'feed:reaction:removed',
  COMMENT_ADDED: 'feed:comment:added',
  COMMENT_REMOVED: 'feed:comment:removed',
  COMMENT_UPDATED: 'feed:comment:updated',
  SHARE_ADDED: 'feed:share:added',
  SAVE_ADDED: 'feed:save:added',
  
  // Poll events
  POLL_CREATED: 'feed:poll:created',
  POLL_UPDATED: 'feed:poll:updated',
  POLL_VOTED: 'feed:poll:voted',
  POLL_ENDED: 'feed:poll:ended',
  
  // Feed events
  FEED_REFRESH: 'feed:refresh',
  FEED_UPDATED: 'feed:updated',
  FEED_CLEARED: 'feed:cleared',
  
  // Trending events
  TRENDING_UPDATED: 'feed:trending:updated',
  TRENDING_REFRESH: 'feed:trending:refresh',
  
  // Batch events
  BATCH_STARTED: 'feed:batch:started',
  BATCH_PROCESSED: 'feed:batch:processed',
  BATCH_FAILED: 'feed:batch:failed',
  BATCH_TIMEOUT: 'feed:batch:timeout',
  
  // Connection events
  FEED_CONNECTED: 'feed:connected',
  FEED_DISCONNECTED: 'feed:disconnected',
  FEED_RECONNECTING: 'feed:reconnecting',
  FEED_ERROR: 'feed:error',
  
  // Cache events
  FEED_CACHE_INVALIDATED: 'feed:cache:invalidated',
  FEED_CACHE_CLEARED: 'feed:cache:cleared',
  FEED_CACHE_WARMED: 'feed:cache:warmed'
} as const;

export const FEED_CONTENT_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  VIDEO: 'video',
  POLL: 'poll',
  LINK: 'link',
  MIXED: 'mixed'
} as const;

export const FEED_PRIORITIES = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  URGENT: 'urgent'
} as const;

export const FEED_ALGORITHMS = {
  ENGAGEMENT: 'engagement',
  VELOCITY: 'velocity',
  HYBRID: 'hybrid',
  PERSONALIZED: 'personalized',
  TRENDING: 'trending'
} as const;

export const FEED_TIME_WINDOWS = {
  HOUR: 'hour',
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month'
} as const;

export const FEED_ERROR_TYPES = {
  CONNECTION: 'connection',
  POST: 'post',
  VALIDATION: 'validation',
  PROCESSING: 'processing',
  BATCH: 'batch',
  CACHE: 'cache',
  SPAM: 'spam',
  RATE_LIMIT: 'rate_limit'
} as const;

export const FEED_ERROR_SEVERITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
} as const;

// Utility functions
export function createFeedMessage(
  userId: string,
  content: string,
  options?: Partial<FeedMessageData>
): FeedMessageData {
  return {
    id: `feed_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    content: content.trim(),
    createdAt: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0,
    repostCount: 0,
    shareCount: 0,
    metadata: {
      priority: FEED_PRIORITIES.NORMAL,
      source: 'websocket_adapter',
      ...options?.metadata
    },
    ...options
  };
}

export function createReactionData(
  postId: string,
  userId: string,
  reactionType: string
): ReactionData {
  return {
    postId,
    userId,
    reactionType,
    timestamp: Date.now(),
    metadata: {
      source: 'websocket_adapter'
    }
  };
}

export function createCommentData(
  postId: string,
  userId: string,
  content: string,
  parentId?: string
): CommentData {
  return {
    id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    postId,
    userId,
    content: content.trim(),
    createdAt: new Date().toISOString(),
    likeCount: 0,
    replyCount: 0,
    parentId,
    metadata: {
      edited: false,
      moderated: false
    }
  };
}

export function createPollVoteData(
  postId: string,
  pollId: string,
  userId: string,
  option: string
): PollVoteData {
  return {
    postId,
    pollId,
    userId,
    option,
    timestamp: Date.now(),
    metadata: {
      source: 'websocket_adapter',
      device: 'web'
    }
  };
}

export function createTrendingUpdateData(
  posts: any[],
  algorithm: string = FEED_ALGORITHMS.ENGAGEMENT,
  timeWindow: string = FEED_TIME_WINDOWS.HOUR
): TrendingUpdateData {
  return {
    posts,
    timestamp: Date.now(),
    algorithm: algorithm as any,
    timeWindow: timeWindow as any,
    maxResults: 50
  };
}

export function createBatchUpdateData(
  updates: any[],
  userId?: string
): BatchUpdateData {
  return {
    updates,
    batchId: `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
    userId,
    metadata: {
      totalUpdates: updates.length,
      validUpdates: updates.length,
      source: 'websocket_adapter'
    }
  };
}

export function sanitizeFeedContent(content: string): string {
  return content
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

export function isValidFeedContent(content: string, maxLength: number = 2000): boolean {
  const sanitized = sanitizeFeedContent(content);
  return sanitized.length > 0 && sanitized.length <= maxLength;
}

export function getFeedContentType(post: any): string {
  if (post.poll) {
    return FEED_CONTENT_TYPES.POLL;
  }

  const hasImage = post.photo || (post.media && post.media.some((m: string) => m.includes('image')));
  const hasVideo = post.media && post.media.some((m: string) => m.includes('video'));

  if (hasImage && hasVideo) {
    return FEED_CONTENT_TYPES.MIXED;
  } else if (hasImage) {
    return FEED_CONTENT_TYPES.IMAGE;
  } else if (hasVideo) {
    return FEED_CONTENT_TYPES.VIDEO;
  } else {
    return FEED_CONTENT_TYPES.TEXT;
  }
}

export function calculateEngagementScore(post: any): number {
  return (post.likeCount || 0) + 
         (post.commentCount || 0) * 2 + 
         (post.repostCount || 0) * 3 + 
         (post.shareCount || 0) * 1.5;
}

export function isTrendingPost(post: any, threshold: number = 100): boolean {
  return calculateEngagementScore(post) > threshold;
}

export function formatFeedTimestamp(timestamp: string | number): string {
  const date = new Date(timestamp);
  return date.toLocaleString();
}

export function formatRelativeFeedTime(timestamp: string | number): string {
  const now = Date.now();
  const time = typeof timestamp === 'string' ? new Date(timestamp).getTime() : timestamp;
  const diff = now - time;
  
  if (diff < 60000) { // Less than 1 minute
    return 'just now';
  } else if (diff < 3600000) { // Less than 1 hour
    const minutes = Math.floor(diff / 60000);
    return `${minutes}m ago`;
  } else if (diff < 86400000) { // Less than 1 day
    const hours = Math.floor(diff / 3600000);
    return `${hours}h ago`;
  } else if (diff < 604800000) { // Less than 1 week
    const days = Math.floor(diff / 86400000);
    return `${days}d ago`;
  } else {
    const weeks = Math.floor(diff / 604800000);
    return `${weeks}w ago`;
  }
}

export function shouldShowPost(post: any, userPreferences?: any): boolean {
  // Check if post type is enabled
  if (userPreferences?.contentTypes) {
    const contentType = getFeedContentType(post);
    if (!userPreferences.contentTypes.includes(contentType)) {
      return false;
    }
  }

  // Check if user is blocked
  if (userPreferences?.blockedUsers?.includes(post.userId)) {
    return false;
  }

  // Check content filters
  if (userPreferences?.contentFilter === 'strict') {
    const content = post.text || '';
    if (containsMatureContent(content)) {
      return false;
    }
  }

  return true;
}

export function containsMatureContent(content: string): boolean {
  const matureKeywords = ['nsfw', 'adult', 'explicit', 'mature'];
  const lowerContent = content.toLowerCase();
  return matureKeywords.some(keyword => lowerContent.includes(keyword));
}

export function getFeedPriority(post: any): string {
  // Check metadata for explicit priority
  if (post.metadata?.priority) {
    return post.metadata.priority;
  }

  // Determine priority based on engagement
  const engagement = calculateEngagementScore(post);
  
  if (engagement > 500) {
    return FEED_PRIORITIES.HIGH;
  } else if (engagement > 50) {
    return FEED_PRIORITIES.NORMAL;
  } else {
    return FEED_PRIORITIES.LOW;
  }
}

export function getFeedAlgorithmLabel(algorithm: string): string {
  const labelMap: { [key: string]: string } = {
    [FEED_ALGORITHMS.ENGAGEMENT]: 'Engagement Based',
    [FEED_ALGORITHMS.VELOCITY]: 'Velocity Based',
    [FEED_ALGORITHMS.HYBRID]: 'Hybrid Algorithm',
    [FEED_ALGORITHMS.PERSONALIZED]: 'Personalized',
    [FEED_ALGORITHMS.TRENDING]: 'Trending'
  };

  return labelMap[algorithm] || algorithm;
}

export function getFeedContentTypeLabel(contentType: string): string {
  const labelMap: { [key: string]: string } = {
    [FEED_CONTENT_TYPES.TEXT]: 'Text',
    [FEED_CONTENT_TYPES.IMAGE]: 'Image',
    [FEED_CONTENT_TYPES.VIDEO]: 'Video',
    [FEED_CONTENT_TYPES.POLL]: 'Poll',
    [FEED_CONTENT_TYPES.LINK]: 'Link',
    [FEED_CONTENT_TYPES.MIXED]: 'Mixed Media'
  };

  return labelMap[contentType] || contentType;
}

export function getFeedErrorTypeLabel(errorType: string): string {
  const labelMap: { [key: string]: string } = {
    [FEED_ERROR_TYPES.CONNECTION]: 'Connection Error',
    [FEED_ERROR_TYPES.POST]: 'Post Error',
    [FEED_ERROR_TYPES.VALIDATION]: 'Validation Error',
    [FEED_ERROR_TYPES.PROCESSING]: 'Processing Error',
    [FEED_ERROR_TYPES.BATCH]: 'Batch Error',
    [FEED_ERROR_TYPES.CACHE]: 'Cache Error',
    [FEED_ERROR_TYPES.SPAM]: 'Spam Detection',
    [FEED_ERROR_TYPES.RATE_LIMIT]: 'Rate Limit Error'
  };

  return labelMap[errorType] || errorType;
}

export function getFeedErrorSeverityLabel(severity: string): string {
  const labelMap: { [key: string]: string } = {
    [FEED_ERROR_SEVERITIES.LOW]: 'Low',
    [FEED_ERROR_SEVERITIES.MEDIUM]: 'Medium',
    [FEED_ERROR_SEVERITIES.HIGH]: 'High',
    [FEED_ERROR_SEVERITIES.CRITICAL]: 'Critical'
  };

  return labelMap[severity] || severity;
}

// Validation utilities
export function validateFeedMessage(message: FeedMessageData): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!message.id) {
    errors.push('Message ID is required');
  }

  if (!message.userId) {
    errors.push('User ID is required');
  }

  if (!message.content) {
    errors.push('Content is required');
  }

  if (typeof message.content !== 'string') {
    errors.push('Content must be a string');
  } else if (message.content.trim().length === 0) {
    errors.push('Content cannot be empty');
  } else if (message.content.length > 2000) {
    errors.push('Content too long (max 2000 characters)');
  }

  if (!message.createdAt) {
    errors.push('Created date is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateReactionData(reactionData: ReactionData): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!reactionData.postId) {
    errors.push('Post ID is required');
  }

  if (!reactionData.userId) {
    errors.push('User ID is required');
  }

  if (!reactionData.reactionType) {
    errors.push('Reaction type is required');
  }

  const validReactions = ['like', 'love', 'laugh', 'wow', 'sad', 'angry'];
  if (!validReactions.includes(reactionData.reactionType)) {
    errors.push('Invalid reaction type');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateCommentData(commentData: CommentData): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!commentData.postId) {
    errors.push('Post ID is required');
  }

  if (!commentData.userId) {
    errors.push('User ID is required');
  }

  if (!commentData.content) {
    errors.push('Content is required');
  }

  if (typeof commentData.content !== 'string') {
    errors.push('Content must be a string');
  } else if (commentData.content.trim().length === 0) {
    errors.push('Content cannot be empty');
  } else if (commentData.content.length > 1000) {
    errors.push('Content too long (max 1000 characters)');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validatePollVoteData(voteData: PollVoteData): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!voteData.postId) {
    errors.push('Post ID is required');
  }

  if (!voteData.pollId) {
    errors.push('Poll ID is required');
  }

  if (!voteData.userId) {
    errors.push('User ID is required');
  }

  if (!voteData.option) {
    errors.push('Vote option is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Performance utilities
export function optimizeFeedUpdate(update: FeedWebSocketMessage): FeedWebSocketMessage {
  // Remove unnecessary data to reduce payload size
  const optimized = { ...update };
  
  // Only keep essential fields
  if (optimized.data.post) {
    optimized.data.post = {
      id: optimized.data.post.id,
      userId: optimized.data.post.userId,
      content: optimized.data.post.content,
      likeCount: optimized.data.post.likeCount,
      commentCount: optimized.data.post.commentCount,
      createdAt: optimized.data.post.createdAt
    };
  }

  return optimized;
}

export function batchFeedUpdates(updates: FeedWebSocketMessage[], maxSize: number = 10): FeedWebSocketMessage[] {
  if (updates.length <= maxSize) {
    return updates;
  }

  // Sort by priority and take the most important ones
  const priorityOrder = { high: 3, normal: 2, low: 1 };
  return updates
    .sort((a, b) => {
      const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 2;
      const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 2;
      return bPriority - aPriority;
    })
    .slice(0, maxSize);
}

export function calculateFeedPerformanceMetrics(metrics: FeedAdapterMetrics): {
  averageLatency: number;
  throughput: number;
  errorRate: number;
  cacheEfficiency: number;
} {
  const totalOperations = metrics.postsCreated + metrics.postsUpdated + metrics.reactionsProcessed + metrics.commentsProcessed;
  const errorRate = totalOperations > 0 ? (metrics.errorCount / totalOperations) * 100 : 0;
  const cacheEfficiency = metrics.cacheHits + metrics.cacheMisses > 0 ? 
    (metrics.cacheHits / (metrics.cacheHits + metrics.cacheMisses)) * 100 : 0;

  return {
    averageLatency: metrics.averageUpdateLatency,
    throughput: totalOperations / (metrics.connectionUptime / 1000), // operations per second
    errorRate,
    cacheEfficiency
  };
}
