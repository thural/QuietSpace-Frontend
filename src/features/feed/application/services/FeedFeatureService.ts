/**
 * Feed Feature Service
 * 
 * Business logic service for feed-related operations.
 * Handles feed loading, post creation, and feed management.
 */

import type { PostQuery, PostResponse, PostRequest } from '../../domain';
import type { FeedDataService } from '../../data/services/FeedDataService';
import type { ICacheProvider } from '@/core/cache';
import type { CommentRequest, CommentResponse } from '../../data/models/comment';
import type { ResId } from '@/shared/api/models/common';

export interface IFeedFeatureService {
  loadFeed(query: PostQuery, token: string): Promise<PostResponse[]>;
  createPostWithValidation(postData: PostRequest, token: string): Promise<PostResponse>;
  updatePostWithValidation(postId: string, postData: PostRequest, token: string): Promise<PostResponse>;
  deletePostWithBusinessLogic(postId: string, userId: string, token: string): Promise<void>;
  interactWithPost(postId: string, userId: string, interaction: string, token: string): Promise<void>;
  getFeedAnalytics(userId?: string, token: string): Promise<any>;

  // Comment-related methods
  createCommentWithValidation(commentData: CommentRequest): Promise<CommentResponse>;
  deleteCommentWithFullInvalidation(commentId: ResId, postId: ResId, userId: ResId): Promise<void>;
}

export class FeedFeatureService implements IFeedFeatureService {
  constructor(
    private feedDataService: FeedDataService,
    private cacheService: ICacheProvider
  ) { }

  async loadFeed(query: PostQuery, token: string): Promise<PostResponse[]> {
    try {
      // Business logic for loading feed
      const cacheKey = `feed:${JSON.stringify(query)}`;

      // Try cache first
      const cached = await this.cacheService.get(cacheKey);
      if (cached) {
        return cached;
      }

      // Load from data service
      const feed = await this.feedDataService.loadFeed(query, token);

      // Cache the result
      await this.cacheService.set(cacheKey, feed, { ttl: 300000 }); // 5 minutes

      return feed;
    } catch (error) {
      console.error('Error loading feed:', error);
      throw error;
    }
  }

  async createPostWithValidation(postData: PostRequest, token: string): Promise<PostResponse> {
    try {
      // Business validation
      if (!postData.content || postData.content.trim().length === 0) {
        throw new Error('Post content cannot be empty');
      }

      if (postData.content.length > 2000) {
        throw new Error('Post content too long (max 2000 characters)');
      }

      // Create post through data service
      const post = await this.feedDataService.createPost(postData, token);

      // Invalidate relevant cache
      await this.cacheService.delete('feed:*');

      return post;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }

  async updatePostWithValidation(postId: string, postData: PostRequest, token: string): Promise<PostResponse> {
    try {
      // Business validation
      if (!postData.content || postData.content.trim().length === 0) {
        throw new Error('Post content cannot be empty');
      }

      // Update post through data service
      const post = await this.feedDataService.updatePost(postId, postData, token);

      // Invalidate relevant cache
      await this.cacheService.delete(`post:${postId}`);
      await this.cacheService.delete('feed:*');

      return post;
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  }

  async deletePostWithBusinessLogic(postId: string, userId: string, token: string): Promise<void> {
    try {
      // Business logic validation
      // Check if user owns the post, etc.

      // Delete through data service
      await this.feedDataService.deletePost(postId, token);

      // Invalidate relevant cache
      await this.cacheService.delete(`post:${postId}`);
      await this.cacheService.delete('feed:*');
      await this.cacheService.delete(`user:${userId}:posts`);
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }

  async interactWithPost(postId: string, userId: string, interaction: string, token: string): Promise<void> {
    try {
      // Business logic for post interactions
      await this.feedDataService.interactWithPost(postId, userId, interaction, token);

      // Invalidate relevant cache
      await this.cacheService.delete(`post:${postId}`);
      await this.cacheService.delete('feed:*');
    } catch (error) {
      console.error('Error interacting with post:', error);
      throw error;
    }
  }

  async getFeedAnalytics(userId?: string, token: string): Promise<any> {
    try {
      // Business logic for feed analytics
      return await this.feedDataService.getFeedAnalytics(userId, token);
    } catch (error) {
      console.error('Error getting feed analytics:', error);
      throw error;
    }
  }

  async createCommentWithValidation(commentData: CommentRequest): Promise<CommentResponse> {
    try {
      // Business validation for comment
      if (!commentData.text || commentData.text.trim().length === 0) {
        throw new Error('Comment content cannot be empty');
      }

      if (commentData.text.length > 1000) {
        throw new Error('Comment content too long (max 1000 characters)');
      }

      // Create comment through data service
      const comment = await this.feedDataService.createComment(commentData);

      // Invalidate relevant cache
      await this.cacheService.delete('feed:*');
      await this.cacheService.delete(`post:${commentData.postId}:comments`);

      return comment;
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  }

  async deleteCommentWithFullInvalidation(commentId: ResId, postId: ResId, userId: ResId): Promise<void> {
    try {
      // Business logic validation for comment deletion
      // This would typically check if user owns the comment, etc.

      // Delete through data service
      await this.feedDataService.deleteComment(String(commentId));

      // Invalidate relevant cache
      await this.cacheService.delete(`post:${postId}`);
      await this.cacheService.delete(`post:${postId}:comments`);
      await this.cacheService.delete('feed:*');
      await this.cacheService.delete(`user:${userId}:comments`);
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }
}
