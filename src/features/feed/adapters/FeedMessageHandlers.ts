/**
 * Feed Message Handlers
 * 
 * Provides specialized message handling for feed WebSocket messages.
 * Handles message validation, transformation, and business logic for feed operations.
 */

import { Injectable } from '@/core/modules/dependency-injection';
import { WebSocketMessage } from '@/core/websocket/types';
import { PostResponse, PollResponse } from '../data/models/post';
import { ResId } from '@/shared/api/models/common';

// Message validation result
export interface FeedValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedPost?: PostResponse;
  sanitizedPoll?: PollResponse;
  priority?: 'low' | 'normal' | 'high';
}

// Post update data
export interface PostUpdateData {
  id: ResId;
  userId: ResId;
  content: string;
  createdAt: string;
  updatedAt: string;
  likeCount?: number;
  commentCount?: number;
  poll?: PollResponse;
  media?: string[];
  tags?: string[];
}

// Reaction data
export interface ReactionData {
  postId: ResId;
  userId: ResId;
  reactionType: string;
  timestamp: number;
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
}

// Poll vote data
export interface PollVoteData {
  postId: ResId;
  pollId: ResId;
  userId: ResId;
  option: string;
  timestamp: number;
}

// Trending update data
export interface TrendingUpdateData {
  posts: PostResponse[];
  timestamp: number;
  algorithm: 'engagement' | 'velocity' | 'hybrid';
  timeWindow: 'hour' | 'day' | 'week';
  maxResults: number;
}

// Batch update data
export interface BatchUpdateData {
  updates: WebSocketMessage[];
  batchId: string;
  timestamp: number;
  metadata?: {
    totalUpdates: number;
    validUpdates: number;
    errors?: string[];
    processingTime?: number;
  };
}

/**
 * Feed Message Handlers
 */
@Injectable()
export class FeedMessageHandlers {
  
  /**
   * Handle incoming post
   */
  async handlePost(message: WebSocketMessage): Promise<FeedValidationResult> {
    try {
      const validationResult = this.validatePost(message.data);
      
      if (!validationResult.isValid) {
        return validationResult;
      }

      const post = validationResult.sanitizedPost!;
      
      // Apply business rules
      await this.applyPostBusinessRules(post);
      
      // Transform post if needed
      const transformedPost = await this.transformPost(post);
      
      // Determine priority
      const priority = this.determinePostPriority(transformedPost);
      
      return {
        isValid: true,
        errors: [],
        sanitizedPost: transformedPost,
        priority
      };

    } catch (error) {
      return {
        isValid: false,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        sanitizedPost: undefined
      };
    }
  }

  /**
   * Handle post update
   */
  async handlePostUpdate(message: WebSocketMessage): Promise<FeedValidationResult> {
    try {
      const validationResult = this.validatePost(message.data);
      
      if (!validationResult.isValid) {
        return validationResult;
      }

      const post = validationResult.sanitizedPost!;
      
      // Apply update-specific business rules
      await this.applyPostUpdateRules(post);
      
      // Transform post
      const transformedPost = await this.transformPost(post);
      
      const priority = this.determinePostPriority(transformedPost);
      
      return {
        isValid: true,
        errors: [],
        sanitizedPost: transformedPost,
        priority
      };

    } catch (error) {
      return {
        isValid: false,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        sanitizedPost: undefined
      };
    }
  }

  /**
   * Handle post deletion
   */
  async handlePostDeletion(message: WebSocketMessage): Promise<{ success: boolean; error?: string }> {
    try {
      const { postId, userId } = message.data;
      
      if (!postId) {
        return { success: false, error: 'Post ID is required' };
      }

      // Apply deletion business rules
      await this.applyPostDeletionRules(postId, userId);
      
      return { success: true };

    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Handle reaction
   */
  async handleReaction(message: WebSocketMessage): Promise<FeedValidationResult> {
    try {
      const reactionData = message.data as ReactionData;
      
      // Validate reaction data
      const validationResult = this.validateReaction(reactionData);
      
      if (!validationResult.isValid) {
        return validationResult;
      }

      // Apply reaction business rules
      await this.applyReactionBusinessRules(reactionData);
      
      // Transform reaction if needed
      const transformedReaction = await this.transformReaction(reactionData);
      
      return {
        isValid: true,
        errors: [],
        priority: 'normal'
      };

    } catch (error) {
      return {
        isValid: false,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  /**
   * Handle comment
   */
  async handleComment(message: WebSocketMessage): Promise<FeedValidationResult> {
    try {
      const commentData = message.data as CommentData;
      
      // Validate comment data
      const validationResult = this.validateComment(commentData);
      
      if (!validationResult.isValid) {
        return validationResult;
      }

      // Apply comment business rules
      await this.applyCommentBusinessRules(commentData);
      
      // Transform comment if needed
      const transformedComment = await this.transformComment(commentData);
      
      return {
        isValid: true,
        errors: [],
        priority: 'normal'
      };

    } catch (error) {
      return {
        isValid: false,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  /**
   * Handle poll vote
   */
  async handlePollVote(message: WebSocketMessage): Promise<FeedValidationResult> {
    try {
      const voteData = message.data as PollVoteData;
      
      // Validate vote data
      const validationResult = this.validatePollVote(voteData);
      
      if (!validationResult.isValid) {
        return validationResult;
      }

      // Apply vote business rules
      await this.applyPollVoteBusinessRules(voteData);
      
      // Transform vote if needed
      const transformedVote = await this.transformPollVote(voteData);
      
      return {
        isValid: true,
        errors: [],
        priority: 'normal'
      };

    } catch (error) {
      return {
        isValid: false,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  /**
   * Handle trending update
   */
  async handleTrendingUpdate(message: WebSocketMessage): Promise<TrendingUpdateData> {
    const trendingData = message.data;
    
    // Validate trending data
    if (!trendingData.posts || !Array.isArray(trendingData.posts)) {
      throw new Error('Trending update must contain posts array');
    }

    const validatedPosts: PostResponse[] = [];
    const errors: string[] = [];

    // Validate each post in trending data
    for (const post of trendingData.posts) {
      try {
        const validationResult = await this.handlePost({ data: post } as WebSocketMessage);
        
        if (validationResult.isValid && validationResult.sanitizedPost) {
          validatedPosts.push(validationResult.sanitizedPost);
        } else {
          errors.push(`Invalid trending post: ${validationResult.errors.join(', ')}`);
        }
      } catch (error) {
        errors.push(`Trending post validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    if (validatedPosts.length === 0) {
      throw new Error(`No valid trending posts. Errors: ${errors.join('; ')}`);
    }

    const trending: TrendingUpdateData = {
      posts: validatedPosts,
      timestamp: Date.now(),
      algorithm: trendingData.algorithm || 'engagement',
      timeWindow: trendingData.timeWindow || 'hour',
      maxResults: trendingData.maxResults || 50
    };

    // Apply trending processing rules
    await this.applyTrendingProcessingRules(trending);

    return trending;
  }

  /**
   * Handle batch update
   */
  async handleBatchUpdate(message: WebSocketMessage): Promise<BatchUpdateData> {
    const batchData = message.data;
    
    // Validate batch data
    if (!batchData.updates || !Array.isArray(batchData.updates)) {
      throw new Error('Batch must contain updates array');
    }

    const validatedUpdates: WebSocketMessage[] = [];
    const errors: string[] = [];

    // Validate each update in the batch
    for (const update of batchData.updates) {
      try {
        // Basic validation for each update
        if (!update.feature || !update.messageType) {
          errors.push(`Invalid update structure: missing feature or messageType`);
          continue;
        }

        validatedUpdates.push(update);
      } catch (error) {
        errors.push(`Update validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    if (validatedUpdates.length === 0) {
      throw new Error(`No valid updates in batch. Errors: ${errors.join('; ')}`);
    }

    const batch: BatchUpdateData = {
      updates: validatedUpdates,
      batchId: batchData.batchId || `batch_${Date.now()}`,
      timestamp: Date.now(),
      metadata: {
        totalUpdates: batchData.updates.length,
        validUpdates: validatedUpdates.length,
        errors,
        processingTime: 0
      }
    };

    // Apply batch processing rules
    await this.applyBatchProcessingRules(batch);

    return batch;
  }

  /**
   * Validate post structure and content
   */
  private validatePost(postData: any): FeedValidationResult {
    const errors: string[] = [];

    try {
      // Basic structure validation
      if (!postData) {
        return {
          isValid: false,
          errors: ['Post data is required'],
          sanitizedPost: undefined
        };
      }

      // Required fields
      if (!postData.id) {
        errors.push('Post ID is required');
      }

      if (!postData.userId) {
        errors.push('User ID is required');
      }

      if (!postData.text && !postData.content) {
        errors.push('Post content is required');
      }

      // Content validation
      const content = postData.text || postData.content || '';
      if (typeof content !== 'string') {
        errors.push('Post content must be a string');
      } else if (content.trim().length === 0) {
        errors.push('Post content cannot be empty');
      } else if (content.length > 2000) {
        errors.push('Post content too long (max 2000 characters)');
      }

      // Check for forbidden content
      if (this.containsForbiddenContent(content)) {
        errors.push('Post contains forbidden content');
      }

      if (errors.length > 0) {
        return {
          isValid: false,
          errors,
          sanitizedPost: undefined
        };
      }

      // Sanitize post
      const sanitizedPost = this.sanitizePost(postData);

      return {
        isValid: true,
        errors: [],
        sanitizedPost
      };

    } catch (error) {
      return {
        isValid: false,
        errors: [error instanceof Error ? error.message : 'Validation failed'],
        sanitizedPost: undefined
      };
    }
  }

  /**
   * Validate reaction data
   */
  private validateReaction(reactionData: ReactionData): FeedValidationResult {
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
      errors,
      priority: 'normal'
    };
  }

  /**
   * Validate comment data
   */
  private validateComment(commentData: CommentData): FeedValidationResult {
    const errors: string[] = [];

    if (!commentData.postId) {
      errors.push('Post ID is required');
    }

    if (!commentData.userId) {
      errors.push('User ID is required');
    }

    if (!commentData.content) {
      errors.push('Comment content is required');
    }

    if (typeof commentData.content !== 'string') {
      errors.push('Comment content must be a string');
    } else if (commentData.content.trim().length === 0) {
      errors.push('Comment content cannot be empty');
    } else if (commentData.content.length > 1000) {
      errors.push('Comment content too long (max 1000 characters)');
    }

    return {
      isValid: errors.length === 0,
      errors,
      priority: 'normal'
    };
  }

  /**
   * Validate poll vote data
   */
  private validatePollVote(voteData: PollVoteData): FeedValidationResult {
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
      errors,
      priority: 'normal'
    };
  }

  /**
   * Apply business rules to post
   */
  private async applyPostBusinessRules(post: PostResponse): Promise<void> {
    // Add timestamp if not present
    if (!post.createDate) {
      post.createDate = new Date().toISOString();
    }

    // Add engagement metrics if not present
    if (!post.likeCount) {
      post.likeCount = 0;
    }

    if (!post.commentCount) {
      post.commentCount = 0;
    }

    // Add metadata if not present
    if (!post.metadata) {
      post.metadata = {};
    }

    post.metadata.processedAt = Date.now();
    post.metadata.version = '1.0';
  }

  /**
   * Apply update-specific business rules
   */
  private async applyPostUpdateRules(post: PostResponse): Promise<void> {
    // Add update timestamp
    if (!post.updateDate) {
      post.updateDate = new Date().toISOString();
    }

    // Mark as updated in metadata
    if (!post.metadata) {
      post.metadata = {};
    }

    post.metadata.updatedAt = Date.now();
    post.metadata.lastUpdateAction = 'websocket_update';
  }

  /**
   * Apply deletion business rules
   */
  private async applyPostDeletionRules(postId: ResId, userId?: ResId): Promise<void> {
    // Log deletion for audit
    console.log(`Post ${postId} deleted by user ${userId || 'system'} at ${new Date().toISOString()}`);
  }

  /**
   * Apply reaction business rules
   */
  private async applyReactionBusinessRules(reactionData: ReactionData): Promise<void> {
    // Log reaction for analytics
    console.log(`Reaction ${reactionData.reactionType} added to post ${reactionData.postId} by user ${reactionData.userId}`);
  }

  /**
   * Apply comment business rules
   */
  private async applyCommentBusinessRules(commentData: CommentData): Promise<void> {
    // Add timestamp if not present
    if (!commentData.createdAt) {
      commentData.createdAt = new Date().toISOString();
    }

    // Log comment for analytics
    console.log(`Comment added to post ${commentData.postId} by user ${commentData.userId}`);
  }

  /**
   * Apply poll vote business rules
   */
  private async applyPollVoteBusinessRules(voteData: PollVoteData): Promise<void> {
    // Log vote for analytics
    console.log(`Vote cast in poll ${voteData.pollId} for option ${voteData.option} by user ${voteData.userId}`);
  }

  /**
   * Apply trending processing rules
   */
  private async applyTrendingProcessingRules(trending: TrendingUpdateData): Promise<void> {
    // Sort posts by engagement score
    trending.posts.sort((a, b) => {
      const scoreA = (a.likeCount || 0) + (a.commentCount || 0) * 2;
      const scoreB = (b.likeCount || 0) + (b.commentCount || 0) * 2;
      return scoreB - scoreA;
    });

    // Limit to max results
    if (trending.posts.length > trending.maxResults) {
      trending.posts = trending.posts.slice(0, trending.maxResults);
    }
  }

  /**
   * Apply batch processing rules
   */
  private async applyBatchProcessingRules(batch: BatchUpdateData): Promise<void> {
    // Sort updates by priority
    batch.updates.sort((a, b) => {
      const priorityOrder = { high: 3, normal: 2, low: 1 };
      const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 2;
      const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 2;
      return bPriority - aPriority;
    });

    // Add processing metadata
    if (!batch.metadata) {
      batch.metadata = {};
    }

    batch.metadata.processedAt = Date.now();
    batch.metadata.totalUpdates = batch.updates.length;
  }

  /**
   * Transform post if needed
   */
  private async transformPost(post: PostResponse): Promise<PostResponse> {
    const transformed = { ...post };

    // Process content
    if (transformed.text) {
      transformed.text = this.processPostContent(transformed.text);
    }

    // Add processed metadata
    if (!transformed.metadata) {
      transformed.metadata = {};
    }

    transformed.metadata.transformedAt = Date.now();
    transformed.metadata.transformer = 'feed_message_handlers';

    return transformed;
  }

  /**
   * Transform reaction if needed
   */
  private async transformReaction(reactionData: ReactionData): Promise<ReactionData> {
    return {
      ...reactionData,
      timestamp: reactionData.timestamp || Date.now()
    };
  }

  /**
   * Transform comment if needed
   */
  private async transformComment(commentData: CommentData): Promise<CommentData> {
    const transformed = { ...commentData };

    // Process content
    if (transformed.content) {
      transformed.content = this.processPostContent(transformed.content);
    }

    return transformed;
  }

  /**
   * Transform poll vote if needed
   */
  private async transformPollVote(voteData: PollVoteData): Promise<PollVoteData> {
    return {
      ...voteData,
      timestamp: voteData.timestamp || Date.now()
    };
  }

  /**
   * Sanitize post
   */
  private sanitizePost(post: any): PostResponse {
    const sanitized = { ...post };

    // Sanitize content
    if (sanitized.text) {
      sanitized.text = this.sanitizeText(sanitized.text);
    }

    if (sanitized.content) {
      sanitized.content = this.sanitizeText(sanitized.content);
    }

    // Ensure required fields have proper types
    sanitized.id = String(sanitized.id || '');
    sanitized.userId = String(sanitized.userId || '');
    sanitized.text = String(sanitized.text || '');
    sanitized.likeCount = Number(sanitized.likeCount || 0);
    sanitized.commentCount = Number(sanitized.commentCount || 0);

    return sanitized as PostResponse;
  }

  /**
   * Sanitize text content
   */
  private sanitizeText(text: string): string {
    return text
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }

  /**
   * Process post content
   */
  private processPostContent(content: string): string {
    // Process mentions
    let processed = content.replace(/@(\w+)/g, '<mention>$1</mention>');
    
    // Process links
    processed = processed.replace(/(https?:\/\/[^\s]+)/g, '<link>$1</link>');
    
    // Process hashtags
    processed = processed.replace(/#(\w+)/g, '<hashtag>$1</hashtag>');

    return processed;
  }

  /**
   * Determine post priority
   */
  private determinePostPriority(post: PostResponse): 'low' | 'normal' | 'high' {
    // Check metadata for explicit priority
    if (post.metadata?.priority) {
      const priority = post.metadata.priority;
      if (['low', 'normal', 'high'].includes(priority)) {
        return priority as 'low' | 'normal' | 'high';
      }
    }

    // Determine priority based on engagement
    const engagement = (post.likeCount || 0) + (post.commentCount || 0);
    
    if (engagement > 100) {
      return 'high';
    } else if (engagement > 10) {
      return 'normal';
    } else {
      return 'low';
    }
  }

  /**
   * Check for forbidden content
   */
  private containsForbiddenContent(content: string): boolean {
    const forbiddenWords = ['spam', 'abuse', 'inappropriate', 'malicious'];
    const lowerContent = content.toLowerCase();
    return forbiddenWords.some(word => lowerContent.includes(word));
  }

  /**
   * Get post statistics
   */
  getPostStats(post: PostResponse): {
    contentLength: number;
    wordCount: number;
    hasMentions: boolean;
    hasLinks: boolean;
    hasHashtags: boolean;
    engagementScore: number;
  } {
    const content = post.text || post.content || '';
    
    return {
      contentLength: content.length,
      wordCount: content.split(/\s+/).filter(word => word.length > 0).length,
      hasMentions: /@\w+/.test(content),
      hasLinks: /https?:\/\/[^\s]+/.test(content),
      hasHashtags: /#\w+/.test(content),
      engagementScore: (post.likeCount || 0) + (post.commentCount || 0) * 2
    };
  }

  /**
   * Check if post should be batched
   */
  shouldBatchPost(post: PostResponse): boolean {
    // Don't batch high-engagement posts
    const engagement = (post.likeCount || 0) + (post.commentCount || 0);
    if (engagement > 50) {
      return false;
    }

    // Batch normal and low priority posts
    const priority = this.determinePostPriority(post);
    return ['low', 'normal'].includes(priority);
  }

  /**
   * Get content type
   */
  getContentType(post: PostResponse): 'text' | 'image' | 'video' | 'poll' | 'mixed' {
    if (post.poll) {
      return 'poll';
    }

    const hasImage = post.photo || (post.media && post.media.some(m => m.includes('image')));
    const hasVideo = post.media && post.media.some(m => m.includes('video'));

    if (hasImage && hasVideo) {
      return 'mixed';
    } else if (hasImage) {
      return 'image';
    } else if (hasVideo) {
      return 'video';
    } else {
      return 'text';
    }
  }
}
