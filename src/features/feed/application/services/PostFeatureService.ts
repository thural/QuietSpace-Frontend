/**
 * Post Feature Service
 * 
 * Business logic service for post-related operations.
 * Handles post analytics, engagement calculations, and post management.
 */

import type { ResId, ICacheProvider } from '../../types';
import type { PostDataService } from '../../data/services/PostDataService';

export interface IPostFeatureService {
  calculatePostEngagement(postId: ResId): Promise<any>;
}

export class PostFeatureService implements IPostFeatureService {
  constructor(
    private postDataService: PostDataService,
    private cacheService: ICacheProvider
  ) { }

  async calculatePostEngagement(postId: ResId): Promise<any> {
    try {
      const cacheKey = `post:engagement:${postId}`;

      // Try cache first
      const cached = await this.cacheService.get(cacheKey);
      if (cached) {
        return cached;
      }

      // Get post data to calculate engagement
      const post = await this.postDataService.getPost(String(postId));

      // Calculate engagement metrics from post data
      const engagement = {
        postId: post.id,
        likeCount: post.likeCount,
        commentCount: post.commentCount,
        totalEngagement: post.likeCount + post.commentCount,
        engagementRate: post.likeCount + post.commentCount, // Could be calculated against followers count
        lastCalculated: new Date().toISOString()
      };

      // Cache the result
      await this.cacheService.set(cacheKey, engagement, { ttl: 600000 }); // 10 minutes

      return engagement;
    } catch (error) {
      console.error('Error calculating post engagement:', error);
      throw error;
    }
  }
}
