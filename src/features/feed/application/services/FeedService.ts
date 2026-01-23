import { Injectable, Inject } from '@/core/di';
import { FeedDataService, PostDataService, CommentDataService } from '../../data/services';
import type { 
    PostQuery, 
    PostResponse, 
    PostRequest, 
    RepostRequest, 
    VoteBody,
    ReactionRequest,
    PostFilters
} from '../../domain';
import type { 
    CommentRequest, 
    CommentResponse 
} from '../../data/models/comment';
import type { FeedItem, FeedPage } from '../../data/services/FeedDataService';
import type { ResId } from '@/shared/api/models/common';

export interface FeedValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface FeedBusinessRules {
  maxPostLength: number;
  maxCommentLength: number;
  maxPostsPerHour: number;
  allowedContentTypes: string[];
  restrictedWords: string[];
}

export interface FeedAnalytics {
  totalPosts: number;
  totalComments: number;
  engagementRate: number;
  topPosts: PostResponse[];
  userActivity: Map<ResId, number>;
}

@Injectable()
export class FeedFeatureService {
  private feedDataService: FeedDataService;
  private postDataService: PostDataService;
  private commentDataService: CommentDataService;
  private businessRules: FeedBusinessRules;

  constructor(
    feedDataService: FeedDataService,
    postDataService: PostDataService,
    commentDataService: CommentDataService
  ) {
    this.feedDataService = feedDataService;
    this.postDataService = postDataService;
    this.commentDataService = commentDataService;
    this.businessRules = {
      maxPostLength: 2000,
      maxCommentLength: 1000,
      maxPostsPerHour: 10,
      allowedContentTypes: ['text', 'image', 'video', 'poll'],
      restrictedWords: ['spam', 'abuse', 'hate'] // Example restricted words
    };
  }

  // Main feed operations with business logic
  async loadFeed(query: PostQuery, token: string): Promise<FeedPage> {
    // Apply business rules to query
    const validatedQuery = this.validateFeedQuery(query);
    
    // Load feed with enriched data
    const feed = await this.feedDataService.getFeedWithComments(validatedQuery, token);
    
    // Apply business logic filtering
    return this.applyFeedFilters(feed);
  }

  async createPostWithValidation(post: PostRequest, token: string): Promise<PostResponse> {
    // Validate post content
    const validation = this.validatePostContent(post);
    if (!validation.isValid) {
      throw new Error(`Post validation failed: ${validation.errors.join(', ')}`);
    }

    // Check rate limiting
    await this.checkPostRateLimit(post.userId, token);

    // Create post through data service
    const result = await this.feedDataService.createPostWithCache(post, token);

    // Log business event
    this.logBusinessEvent('post_created', {
      userId: post.userId,
      postId: result.id,
      contentLength: post.text.length
    });

    return result;
  }

  async updatePostWithValidation(
    postId: ResId, 
    post: PostRequest, 
    token: string
  ): Promise<PostResponse> {
    // Validate updated content
    const validation = this.validatePostContent(post);
    if (!validation.isValid) {
      throw new Error(`Post update validation failed: ${validation.errors.join(', ')}`);
    }

    // Check if user owns the post
    await this.validatePostOwnership(postId, post.userId, token);

    // Update post
    const result = await this.postDataService.editPost(postId, post, token);

    // Log business event
    this.logBusinessEvent('post_updated', {
      postId,
      userId: post.userId,
      contentLength: post.text.length
    });

    return result;
  }

  async deletePostWithBusinessLogic(postId: ResId, userId: ResId, token: string): Promise<void> {
    // Check if user owns the post
    await this.validatePostOwnership(postId, userId, token);

    // Check if post has interactions that require special handling
    const post = await this.postDataService.getPostById(postId, token);
    
    if (post.commentCount > 0 || post.likeCount > 0) {
      // Log deletion of post with interactions
      this.logBusinessEvent('post_with_interactions_deleted', {
        postId,
        userId,
        commentCount: post.commentCount,
        likeCount: post.likeCount
      });
    }

    // Delete post with full cache invalidation
    await this.feedDataService.deletePostWithFullCacheInvalidation(postId, token);

    // Log business event
    this.logBusinessEvent('post_deleted', { postId, userId });
  }

  async createCommentWithValidation(comment: CommentRequest): Promise<CommentResponse> {
    // Validate comment content
    const validation = this.validateCommentContent(comment);
    if (!validation.isValid) {
      throw new Error(`Comment validation failed: ${validation.errors.join(', ')}`);
    }

    // Check rate limiting for comments
    await this.checkCommentRateLimit(comment.userId);

    // Create comment
    const result = await this.feedDataService.createCommentWithCache(comment);

    // Log business event
    this.logBusinessEvent('comment_created', {
      userId: comment.userId,
      postId: comment.postId,
      commentId: result.id
    });

    return result;
  }

  async interactWithPost(
    interaction: 'like' | 'dislike' | 'vote',
    data: ReactionRequest | VoteBody,
    token: string
  ): Promise<void> {
    // Validate interaction
    await this.validatePostInteraction(data.postId, data.userId, token);

    // Process interaction based on type
    switch (interaction) {
      case 'like':
      case 'dislike':
        await this.feedDataService.reactToPostWithCache(data as ReactionRequest, token);
        break;
      case 'vote':
        await this.feedDataService.votePollWithCacheInvalidation(data as VoteBody, token);
        break;
    }

    // Log business event
    this.logBusinessEvent('post_interaction', {
      type: interaction,
      postId: data.postId,
      userId: data.userId
    });
  }

  // Business validation methods
  private validatePostContent(post: PostRequest): FeedValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Length validation
    if (post.text.length === 0) {
      errors.push('Post content cannot be empty');
    } else if (post.text.length > this.businessRules.maxPostLength) {
      errors.push(`Post content exceeds maximum length of ${this.businessRules.maxPostLength} characters`);
    }

    // Content validation
    const restrictedWordsFound = this.checkRestrictedWords(post.text);
    if (restrictedWordsFound.length > 0) {
      errors.push(`Post contains restricted words: ${restrictedWordsFound.join(', ')}`);
    }

    // Media validation
    if (post.photoData && !this.businessRules.allowedContentTypes.includes('image')) {
      errors.push('Image content is not allowed');
    }

    // Poll validation
    if (post.poll && (!post.poll.options || post.poll.options.length < 2)) {
      errors.push('Poll must have at least 2 options');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  private validateCommentContent(comment: CommentRequest): FeedValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Length validation
    if (comment.text.length === 0) {
      errors.push('Comment content cannot be empty');
    } else if (comment.text.length > this.businessRules.maxCommentLength) {
      errors.push(`Comment content exceeds maximum length of ${this.businessRules.maxCommentLength} characters`);
    }

    // Content validation
    const restrictedWordsFound = this.checkRestrictedWords(comment.text);
    if (restrictedWordsFound.length > 0) {
      errors.push(`Comment contains restricted words: ${restrictedWordsFound.join(', ')}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  private validateFeedQuery(query: PostQuery): PostQuery {
    // Apply business rules to query parameters
    const validatedQuery = { ...query };

    // Limit page size for performance
    if (validatedQuery.size && validatedQuery.size > 50) {
      validatedQuery.size = 50;
    }

    // Ensure minimum page size
    if (!validatedQuery.size || validatedQuery.size < 1) {
      validatedQuery.size = 10;
    }

    return validatedQuery;
  }

  private applyFeedFilters(feed: FeedPage): FeedPage {
    // Apply business logic filters to feed items
    const filteredItems = feed.items.filter(item => {
      // Filter out posts with restricted content
      const restrictedWords = this.checkRestrictedWords(item.post.text);
      return restrictedWords.length === 0;
    });

    return {
      ...feed,
      items: filteredItems
    };
  }

  // Rate limiting and business rules
  private async checkPostRateLimit(userId: ResId, token: string): Promise<void> {
    // In a real implementation, this would check against a rate limiting service
    // For now, we'll simulate the check
    const recentPosts = await this.postDataService.getPostsByUserId(
      userId, 
      { page: 0, size: this.businessRules.maxPostsPerHour + 1 }, 
      token
    );

    if (recentPosts.content.length >= this.businessRules.maxPostsPerHour) {
      throw new Error(`Rate limit exceeded: Maximum ${this.businessRules.maxPostsPerHour} posts per hour`);
    }
  }

  private async checkCommentRateLimit(userId: ResId): Promise<void> {
    // Similar rate limiting for comments
    // In a real implementation, this would use a proper rate limiting service
    console.log(`Checking comment rate limit for user ${userId}`);
  }

  private async validatePostOwnership(postId: ResId, userId: ResId, token: string): Promise<void> {
    const post = await this.postDataService.getPostById(postId, token);
    
    if (post.userId !== userId) {
      throw new Error('User does not have permission to modify this post');
    }
  }

  private async validatePostInteraction(postId: ResId, userId: ResId, token: string): Promise<void> {
    // Validate that user can interact with post
    const post = await this.postDataService.getPostById(postId, token);
    
    // Business rules for interaction validation
    if (!post) {
      throw new Error('Post not found');
    }

    // Add more business logic as needed
  }

  // Utility methods
  private checkRestrictedWords(content: string): string[] {
    const found = this.businessRules.restrictedWords.filter(word => 
      content.toLowerCase().includes(word.toLowerCase())
    );
    return found;
  }

  private logBusinessEvent(eventType: string, data: any): void {
    // In a real implementation, this would log to an analytics service
    console.log(`Business Event [${eventType}]:`, data);
  }

  // Analytics and reporting
  async getFeedAnalytics(userId?: ResId, token?: string): Promise<FeedAnalytics> {
    // This would typically aggregate data from multiple sources
    // For now, return a basic structure
    return {
      totalPosts: 0,
      totalComments: 0,
      engagementRate: 0,
      topPosts: [],
      userActivity: new Map()
    };
  }

  // Cache management
  invalidateFeedCache(userId?: ResId): void {
    if (userId) {
      this.postDataService.invalidateUserCaches(userId);
    } else {
      this.feedDataService.clearAllCaches();
    }
  }

  // Business rules management
  updateBusinessRules(newRules: Partial<FeedBusinessRules>): void {
    this.businessRules = { ...this.businessRules, ...newRules };
  }

  getCurrentBusinessRules(): FeedBusinessRules {
    return { ...this.businessRules };
  }
}
