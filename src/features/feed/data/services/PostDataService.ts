/**
 * Post Data Service for Feed Feature
 * 
 * Simplified post data service implementation for feed operations.
 * This provides the necessary methods for the feed feature to work with post data.
 */

import type { ResId } from '../../types';

// Post interfaces for the feed feature
export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  likes: string[];
  likeCount: number;
  comments: any[];
  commentCount: number;
  tags: string[];
  isEdited: boolean;
  metadata: {
    visibility: 'public' | 'private' | 'friends';
    priority: number;
    source: 'user' | 'system' | 'imported';
  };
}

/**
 * Post Data Service interface for feed operations
 */
export interface IPostDataService {
  getPost(id: string): Promise<Post>;
}

/**
 * Basic Post Data Service implementation
 */
export class PostDataService implements IPostDataService {
  /**
   * Get a single post by ID
   * In a real implementation, this would fetch from an API or database
   */
  async getPost(id: string): Promise<Post> {
    // Mock implementation - in real app this would call an API
    const mockPost: Post = {
      id,
      title: `Post ${id}`,
      content: `Content for post ${id}`,
      authorId: 'user1',
      authorName: 'User One',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: ['user1', 'user2'],
      likeCount: 2,
      comments: [],
      commentCount: 0,
      tags: ['tag1', 'tag2'],
      isEdited: false,
      metadata: {
        visibility: 'public',
        priority: 1,
        source: 'user'
      }
    };

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));

    return mockPost;
  }
}
