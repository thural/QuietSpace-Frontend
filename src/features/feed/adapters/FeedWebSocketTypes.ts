/**
 * Feed WebSocket Types
 * 
 * Type definitions specific to feed WebSocket functionality.
 * Extends enterprise WebSocket types with feed-specific features.
 */

import { WebSocketMessage, WebSocketFeatureConfig } from '@/core/websocket/types';
import { PostResponse, PollResponse } from '../data/models/post';
import { ResId } from '@/shared/api/models/common';

// Feed-specific WebSocket message types
export interface FeedWebSocketMessage extends WebSocketMessage {
  feature: 'feed';
  messageType: 'post_created' | 'post_updated' | 'post_deleted' | 'reaction_added' | 'reaction_removed' | 
                'comment_added' | 'comment_removed' | 'poll_created' | 'poll_updated' | 'poll_voted' |
                'feed_refresh' | 'trending_update' | 'batch_update';
  userId?: string;
  postId?: string;
  data: any;
}

// Feed message types
export interface FeedMessageData {
  id: ResId;
  userId: ResId;
  content: string;
  createdAt: string;
  updatedAt?: string;
  likeCount?: number;
  commentCount?: number;
  repostCount?: number;
  shareCount?: number;
  poll?: PollResponse;
  media?: string[];
  tags?: string[];
  metadata?: {
    priority?: 'low' | 'normal' | 'high';
    source?: string;
    algorithm?: string;
    engagement?: number;
    trending?: boolean;
    featured?: boolean;
    pinned?: boolean;
  };
}

// Reaction data
export interface ReactionData {
  postId: ResId;
  userId: ResId;
  reactionType: string;
  timestamp: number;
  metadata?: {
    source?: string;
    context?: string;
  };
}

// Comment data
export interface CommentData {
  id: ResId;
  postId: ResId;
  userId: ResId;
  content: string;
  createdAt: string;
  updatedAt?: string;
  parentId?: ResId;
  likeCount?: number;
  replyCount?: number;
  metadata?: {
    edited?: boolean;
    editedAt?: number;
    moderated?: boolean;
  };
}

// Poll vote data
export interface PollVoteData {
  postId: ResId;
  pollId: ResId;
  userId: ResId;
  option: string;
  timestamp: number;
  previousOption?: string;
  metadata?: {
    source?: string;
    device?: string;
  };
}

// Trending update data
export interface TrendingUpdateData {
  posts: PostResponse[];
  timestamp: number;
  algorithm: 'engagement' | 'velocity' | 'hybrid' | 'personalized';
  timeWindow: 'hour' | 'day' | 'week' | 'month';
  maxResults: number;
  filters?: {
    tags?: string[];
    users?: string[];
    contentTypes?: string[];
  };
  metadata?: {
    processingTime?: number;
    cacheHit?: boolean;
    lastUpdated?: number;
  };
}

// Feed refresh data
export interface FeedRefreshData {
  feedId: string;
  posts: PostResponse[];
  timestamp: number;
  refreshType: 'full' | 'incremental' | 'smart';
  cursor?: string;
  hasMore?: boolean;
  metadata?: {
    source?: string;
    cacheHit?: boolean;
    processingTime?: number;
  };
}

// Batch update data
export interface BatchUpdateData {
  updates: FeedWebSocketMessage[];
  batchId: string;
  timestamp: number;
  userId?: string;
  metadata?: {
    totalUpdates: number;
    validUpdates: number;
    errors?: string[];
    processingTime?: number;
    priority?: 'low' | 'normal' | 'high';
    source?: string;
  };
}

// Feed adapter configuration
export interface FeedAdapterConfig {
  enableRealtimeUpdates: boolean;
  enableTrendingUpdates: boolean;
  enableBatchProcessing: boolean;
  enableFeedRefresh: boolean;
  enablePollUpdates: boolean;
  enableCommentUpdates: boolean;
  enableReactionUpdates: boolean;
  batchSize: number;
  batchTimeout: number;
  updateInterval: number;
  trendingRefreshInterval: number;
  maxCacheSize: number;
  cacheTTL: number;
  enableContentFiltering: boolean;
  enableSpamDetection: boolean;
  enableEngagementTracking: boolean;
  enablePersonalization: boolean;
}

// Feed adapter metrics
export interface FeedAdapterMetrics {
  // Post metrics
  postsCreated: number;
  postsUpdated: number;
  postsDeleted: number;
  postsProcessed: number;
  
  // Engagement metrics
  reactionsProcessed: number;
  commentsProcessed: number;
  sharesProcessed: number;
  savesProcessed: number;
  
  // Poll metrics
  pollsCreated: number;
  pollsUpdated: number;
  pollVotesProcessed: number;
  
  // Batch metrics
  batchesProcessed: number;
  batchItemsProcessed: number;
  batchTimeouts: number;
  averageBatchSize: number;
  
  // Feed metrics
  feedRefreshes: number;
  trendingUpdates: number;
  personalizedUpdates: number;
  
  // Cache metrics
  cacheHits: number;
  cacheMisses: number;
  cacheInvalidations: number;
  
  // Connection metrics
  connectionUptime: number;
  reconnectionAttempts: number;
  connectionErrors: number;
  
  // Performance metrics
  averageUpdateLatency: number;
  updateSuccessRate: number;
  cacheHitRate: number;
  processingTime: number;
  
  // Error metrics
  errorCount: number;
  validationErrors: number;
  processingErrors: number;
  spamBlocked: number;
  
  // Activity metrics
  lastActivity: number;
  activeSubscriptions: number;
  queuedUpdates: number;
  processedUpdates: number;
}

// Feed event handlers
export interface FeedEventHandlers {
  onPostCreated?: (post: PostResponse) => void;
  onPostUpdated?: (post: PostResponse) => void;
  onPostDeleted?: (postId: ResId) => void;
  onReactionAdded?: (postId: ResId, userId: ResId, reactionType: string) => void;
  onReactionRemoved?: (postId: ResId, userId: ResId, reactionType: string) => void;
  onCommentAdded?: (postId: ResId, comment: CommentData) => void;
  onCommentRemoved?: (postId: ResId, commentId: ResId) => void;
  onCommentUpdated?: (postId: ResId, comment: CommentData) => void;
  onPollCreated?: (postId: ResId, poll: PollResponse) => void;
  onPollUpdated?: (postId: ResId, poll: PollResponse) => void;
  onPollVoted?: (postId: ResId, pollId: ResId, userId: ResId, option: string) => void;
  onFeedRefresh?: (feedId: string, posts: PostResponse[]) => void;
  onTrendingUpdate?: (trendingPosts: PostResponse[]) => void;
  onBatchUpdate?: (updates: BatchUpdateData) => void;
  onError?: (error: FeedWebSocketError) => void;
  onConnectionChange?: (isConnected: boolean) => void;
  onSubscriptionChange?: (activeCount: number) => void;
}

// Feed WebSocket error
export interface FeedWebSocketError {
  type: 'connection' | 'post' | 'validation' | 'processing' | 'batch' | 'cache' | 'spam' | 'rate_limit';
  message: string;
  code?: string;
  details?: any;
  timestamp: number;
  retryable: boolean;
  postId?: ResId;
  userId?: ResId;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

// Feed subscription options
export interface FeedSubscriptionOptions {
  includeTypes?: string[];
  excludeTypes?: string[];
  includeReactions?: boolean;
  includeComments?: boolean;
  includePolls?: boolean;
  includeTrending?: boolean;
  includePersonalized?: boolean;
  priority?: 'low' | 'normal' | 'high';
  batchSize?: number;
  enableBatching?: boolean;
  updateInterval?: number;
  filters?: {
    users?: string[];
    tags?: string[];
    contentTypes?: string[];
    minEngagement?: number;
    timeRange?: {
      start: string;
      end: string;
    };
  };
}

// Feed queue
export interface FeedQueue {
  pending: QueuedUpdate[];
  processing: QueuedUpdate[];
  completed: QueuedUpdate[];
  failed: QueuedUpdate[];
  maxSize: number;
  processingDelay: number;
}

// Queued update
export interface QueuedUpdate {
  id: string;
  message: FeedWebSocketMessage;
  timestamp: number;
  retries: number;
  maxRetries: number;
  lastRetry?: number;
  error?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  scheduledFor?: number;
}

// Feed cache keys
export interface FeedCacheKeys {
  posts: (postId: string) => string;
  userFeed: (userId: string) => string;
  trending: (algorithm: string, timeWindow: string) => string;
  comments: (postId: string) => string;
  reactions: (postId: string) => string;
  polls: (postId: string) => string;
  batch: (batchId: string) => string;
  userPreferences: (userId: string) => string;
  engagement: (postId: string) => string;
}

// Feed WebSocket feature configuration
export interface FeedWebSocketFeatureConfig extends WebSocketFeatureConfig {
  adapter: FeedAdapterConfig;
  cacheKeys: FeedCacheKeys;
  eventHandlers: FeedEventHandlers;
  subscriptionOptions: FeedSubscriptionOptions;
}

// Feed WebSocket adapter interface
export interface IFeedWebSocketAdapter {
  // Initialization
  initialize(config?: Partial<FeedAdapterConfig>): Promise<void>;
  cleanup(): Promise<void>;
  
  // Connection management
  get isConnected(): boolean;
  get connectionState(): 'connecting' | 'connected' | 'disconnected' | 'reconnecting';
  
  // Post operations
  sendPostCreated(post: PostResponse): Promise<void>;
  sendPostUpdated(post: PostResponse): Promise<void>;
  sendPostDeleted(postId: ResId, userId?: ResId): Promise<void>;
  
  // Engagement operations
  sendReactionAdded(postId: ResId, userId: ResId, reactionType: string): Promise<void>;
  sendReactionRemoved(postId: ResId, userId: ResId, reactionType: string): Promise<void>;
  sendCommentAdded(postId: ResId, comment: CommentData): Promise<void>;
  sendCommentRemoved(postId: ResId, commentId: ResId): Promise<void>;
  
  // Poll operations
  sendPollCreated(postId: ResId, poll: PollResponse): Promise<void>;
  sendPollUpdated(postId: ResId, poll: PollResponse): Promise<void>;
  sendPollVoted(postId: ResId, pollId: ResId, userId: ResId, option: string): Promise<void>;
  
  // Feed operations
  sendFeedRefresh(feedId: string, posts: PostResponse[]): Promise<void>;
  sendTrendingUpdate(trendingPosts: PostResponse[]): Promise<void>;
  
  // Subscriptions
  subscribeToPosts(callback: (post: PostResponse) => void, options?: FeedSubscriptionOptions): () => void;
  subscribeToPostUpdates(callback: (post: PostResponse) => void): () => void;
  subscribeToPostDeletions(callback: (postId: ResId) => void): () => void;
  subscribeToReactions(callback: (postId: ResId, userId: ResId, reactionType: string, action: 'added' | 'removed') => void): () => void;
  subscribeToComments(callback: (postId: ResId, comment: CommentData, action: 'added' | 'removed' | 'updated') => void): () => void;
  subscribeToPolls(callback: (postId: ResId, poll: PollResponse, action: 'created' | 'updated' | 'voted') => void): () => void;
  subscribeToFeedRefresh(callback: (feedId: string, posts: PostResponse[]) => void): () => void;
  subscribeToTrendingUpdates(callback: (trendingPosts: PostResponse[]) => void): () => void;
  subscribeToBatchUpdates(callback: (updates: BatchUpdateData) => void): () => void;
  
  // Event handlers
  setEventHandlers(handlers: FeedEventHandlers): void;
  
  // Metrics and monitoring
  getMetrics(): FeedAdapterMetrics;
  getQueueStatus(): FeedQueue;
  
  // Configuration
  updateConfig(config: Partial<FeedAdapterConfig>): void;
  getConfig(): FeedAdapterConfig;
  
  // Cache management
  invalidatePostCache(postId: ResId): Promise<void>;
  invalidateUserFeedCache(userId: string): Promise<void>;
  invalidateTrendingCache(algorithm: string, timeWindow: string): Promise<void>;
  clearCache(): Promise<void>;
}

// Feed WebSocket factory
export interface IFeedWebSocketFactory {
  createAdapter(config?: Partial<FeedAdapterConfig>): Promise<IFeedWebSocketAdapter>;
  getDefaultConfig(): FeedAdapterConfig;
  validateConfig(config: FeedAdapterConfig): boolean;
}

// Type guards
export function isFeedWebSocketMessage(message: WebSocketMessage): message is FeedWebSocketMessage {
  return message.feature === 'feed';
}

export function isFeedMessageData(data: any): data is FeedMessageData {
  return data && 
         typeof data.id === 'string' &&
         typeof data.userId === 'string' &&
         typeof data.content === 'string' &&
         typeof data.createdAt === 'string';
}

export function isReactionData(data: any): data is ReactionData {
  return data &&
         typeof data.postId === 'string' &&
         typeof data.userId === 'string' &&
         typeof data.reactionType === 'string' &&
         typeof data.timestamp === 'number';
}

export function isCommentData(data: any): data is CommentData {
  return data &&
         typeof data.id === 'string' &&
         typeof data.postId === 'string' &&
         typeof data.userId === 'string' &&
         typeof data.content === 'string' &&
         typeof data.createdAt === 'string';
}

export function isPollVoteData(data: any): data is PollVoteData {
  return data &&
         typeof data.postId === 'string' &&
         typeof data.pollId === 'string' &&
         typeof data.userId === 'string' &&
         typeof data.option === 'string' &&
         typeof data.timestamp === 'number';
}

export function isTrendingUpdateData(data: any): data is TrendingUpdateData {
  return data &&
         Array.isArray(data.posts) &&
         typeof data.timestamp === 'number' &&
         typeof data.algorithm === 'string' &&
         typeof data.timeWindow === 'string';
}

export function isBatchUpdateData(data: any): data is BatchUpdateData {
  return data &&
         Array.isArray(data.updates) &&
         typeof data.batchId === 'string' &&
         typeof data.timestamp === 'number';
}

export function isFeedWebSocketError(error: any): error is FeedWebSocketError {
  return error &&
         typeof error.type === 'string' &&
         typeof error.message === 'string' &&
         typeof error.timestamp === 'number' &&
         typeof error.retryable === 'boolean';
}

// Feed content types
export const FEED_CONTENT_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  VIDEO: 'video',
  POLL: 'poll',
  LINK: 'link',
  MIXED: 'mixed'
} as const;

// Feed priorities
export const FEED_PRIORITIES = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  URGENT: 'urgent'
} as const;

// Feed algorithms
export const FEED_ALGORITHMS = {
  ENGAGEMENT: 'engagement',
  VELOCITY: 'velocity',
  HYBRID: 'hybrid',
  PERSONALIZED: 'personalized',
  TRENDING: 'trending'
} as const;

// Feed time windows
export const FEED_TIME_WINDOWS = {
  HOUR: 'hour',
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month'
} as const;

// Feed error types
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

// Feed error severities
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
  posts: PostResponse[],
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
  updates: FeedWebSocketMessage[],
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

export function getFeedContentType(post: PostResponse): string {
  if (post.poll) {
    return FEED_CONTENT_TYPES.POLL;
  }

  const hasImage = post.photo || (post.media && post.media.some(m => m.includes('image')));
  const hasVideo = post.media && post.media.some(m => m.includes('video'));

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

export function calculateEngagementScore(post: PostResponse): number {
  return (post.likeCount || 0) + 
         (post.commentCount || 0) * 2 + 
         (post.repostCount || 0) * 3 + 
         (post.shareCount || 0) * 1.5;
}

export function isTrendingPost(post: PostResponse, threshold: number = 100): boolean {
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

export function shouldShowPost(post: PostResponse, userPreferences?: any): boolean {
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

export function getFeedPriority(post: PostResponse): string {
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
