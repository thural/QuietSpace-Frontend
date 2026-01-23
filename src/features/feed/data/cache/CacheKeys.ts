import type { ResId } from '@/shared/api/models/common';

export class CacheKeys {
  private static readonly FEED_PREFIX = 'feed';
  private static readonly POST_PREFIX = 'post';
  private static readonly COMMENT_PREFIX = 'comments';
  private static readonly USER_POSTS_PREFIX = 'userPosts';
  private static readonly SAVED_POSTS_PREFIX = 'savedPosts';
  private static readonly REPLIED_POSTS_PREFIX = 'repliedPosts';

  static feed(userId: ResId): string {
    return `${this.FEED_PREFIX}:${userId}`;
  }

  static post(postId: ResId): string {
    return `${this.POST_PREFIX}:${postId}`;
  }

  static comments(postId: ResId): string {
    return `${this.COMMENT_PREFIX}:${postId}`;
  }

  static userPosts(userId: ResId): string {
    return `${this.USER_POSTS_PREFIX}:${userId}`;
  }

  static savedPosts(userId: ResId): string {
    return `${this.SAVED_POSTS_PREFIX}:${userId}`;
  }

  static repliedPosts(userId: ResId): string {
    return `${this.REPLIED_POSTS_PREFIX}:${userId}`;
  }

  static searchResults(query: string): string {
    return `search:${encodeURIComponent(query)}`;
  }

  static pollResults(postId: ResId): string {
    return `poll:${postId}`;
  }

  static userReactions(userId: ResId, postId: ResId): string {
    return `reaction:${userId}:${postId}`;
  }

  static invalidatePost(postId: ResId): string[] {
    return [
      this.post(postId),
      this.comments(postId),
      this.pollResults(postId)
    ];
  }

  static invalidateUserPosts(userId: ResId): string[] {
    return [
      this.userPosts(userId),
      this.savedPosts(userId),
      this.repliedPosts(userId)
    ];
  }

  static invalidateFeed(userId: ResId): string[] {
    return [this.feed(userId)];
  }
}
