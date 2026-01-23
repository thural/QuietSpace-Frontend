import { Injectable, Inject } from '@/core/di';
import { CacheServiceManager, TYPES } from '@/core';
import { CacheProvider } from '@/core/cache';
import { PostDataService } from './PostDataService';
import { CommentDataService } from './CommentDataService';
import { CacheKeys } from '../cache/CacheKeys';
import type { 
    PostQuery,
    PostResponse, 
    PostPage,
    PostRequest,
    RepostRequest,
    VoteBody,
    ReactionRequest
} from '@/features/feed/domain';
import type { 
    CommentRequest, 
    CommentResponse, 
    PagedComment 
} from '@/features/feed/data/models/comment';
import type { ResId } from '@/shared/api/models/common';

export interface FeedItem {
    post: PostResponse;
    comments?: PagedComment;
    latestComment?: CommentResponse;
}

export interface FeedPage {
    items: FeedItem[];
    pagination: {
        page: number;
        size: number;
        total: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

export interface FeedDataServiceConfig {
    enableCommentPreloading: boolean;
    maxCommentsPerPost: number;
    feedTTL: number;
    enableSmartCaching: boolean;
}

@Injectable()
export class FeedDataService {
    private cache: CacheProvider;
    private postService: PostDataService;
    private commentService: CommentDataService;
    private config: FeedDataServiceConfig;

    constructor(
        @Inject(TYPES.CACHE_SERVICE) cacheService: CacheServiceManager,
        postService: PostDataService,
        commentService: CommentDataService,
        config: Partial<FeedDataServiceConfig> = {}
    ) {
        this.cache = cacheService.getCache('feed');
        this.postService = postService;
        this.commentService = commentService;
        this.config = {
            enableCommentPreloading: true,
            maxCommentsPerPost: 3,
            feedTTL: 120000, // 2 minutes
            enableSmartCaching: true,
            ...config
        };
    }

    async getFeedWithComments(query: PostQuery, token: string): Promise<FeedPage> {
        const cacheKey = `feed:withComments:${JSON.stringify(query)}`;
        
        // Try cache first for smart caching
        if (this.config.enableSmartCaching) {
            const cached = this.cache.get<FeedPage>(cacheKey);
            if (cached) {
                return cached;
            }
        }

        // Get posts first
        const postsPage = await this.postService.getPosts(query, token);
        
        // Preload comments if enabled
        let feedItems: FeedItem[];
        if (this.config.enableCommentPreloading && postsPage.content.length > 0) {
            feedItems = await this.enrichFeedWithComments(postsPage.content, token);
        } else {
            feedItems = postsPage.content.map(post => ({ post }));
        }

        const feedPage: FeedPage = {
            items: feedItems,
            pagination: {
                page: postsPage.number || 1,
                size: postsPage.size || 10,
                total: postsPage.totalElements || 0,
                hasNext: !postsPage.last,
                hasPrev: !postsPage.first
            }
        };

        // Cache the enriched feed
        if (this.config.enableSmartCaching) {
            this.cache.set(cacheKey, feedPage, this.config.feedTTL);
        }

        return feedPage;
    }

    async getPostWithComments(postId: ResId, token: string): Promise<FeedItem> {
        const cacheKey = `post:withComments:${postId}`;
        
        if (this.config.enableSmartCaching) {
            const cached = this.cache.get<FeedItem>(cacheKey);
            if (cached) {
                return cached;
            }
        }

        // Get post and comments in parallel
        const [post, comments] = await Promise.all([
            this.postService.getPostById(postId, token),
            this.commentService.getCommentsByPostId(postId, `?size=${this.config.maxCommentsPerPost}`)
        ]);

        const feedItem: FeedItem = {
            post,
            comments
        };

        if (this.config.enableSmartCaching) {
            this.cache.set(cacheKey, feedItem, this.config.feedTTL);
        }

        return feedItem;
    }

    async createPostWithCache(post: PostRequest, token: string): Promise<PostResponse> {
        const result = await this.postService.createPost(post, token);
        
        // Invalidate all relevant caches
        this.invalidateFeedCaches();
        this.invalidateUserCaches(post.userId);
        
        return result;
    }

    async createCommentWithCache(comment: CommentRequest): Promise<CommentResponse> {
        const result = await this.commentService.createComment(comment);
        
        // Invalidate post cache and feed caches
        this.postService.invalidatePostCache(comment.postId);
        this.invalidateFeedCaches();
        
        // Invalidate enriched post cache
        this.cache.invalidate(`post:withComments:${comment.postId}`);
        
        return result;
    }

    async deletePostWithFullCacheInvalidation(postId: ResId, token: string): Promise<void> {
        await this.postService.deletePost(postId, token);
        
        // Full cache invalidation for post deletion
        this.postService.invalidatePostCache(postId);
        this.commentService.invalidatePostComments(postId);
        this.invalidateFeedCaches();
        this.cache.invalidate(`post:withComments:${postId}`);
    }

    async deleteCommentWithFullInvalidation(
        commentId: ResId, 
        postId: ResId, 
        userId: ResId
    ): Promise<Response> {
        const result = await this.commentService.deleteCommentWithPostId(commentId, postId, userId);
        
        // Invalidate all related caches
        this.postService.invalidatePostCache(postId);
        this.cache.invalidate(`post:withComments:${postId}`);
        this.invalidateFeedCaches();
        
        return result;
    }

    async votePollWithCacheInvalidation(vote: VoteBody, token: string): Promise<void> {
        await this.postService.votePoll(vote, token);
        
        // Invalidate post and poll caches
        this.postService.invalidatePostCache(vote.postId);
        this.cache.invalidate(`post:withComments:${vote.postId}`);
        this.cache.invalidate(CacheKeys.pollResults(vote.postId));
    }

    async reactToPostWithCache(reaction: ReactionRequest, token: string): Promise<void> {
        await this.postService.reaction(reaction, token);
        
        // Invalidate post and related caches
        this.postService.invalidatePostCache(reaction.postId);
        this.cache.invalidate(`post:withComments:${reaction.postId}`);
        this.invalidateFeedCaches();
    }

    // Batch operations for performance
    async getMultiplePostsWithComments(postIds: ResId[], token: string): Promise<FeedItem[]> {
        const cacheKey = `posts:batch:${postIds.join(',')}`;
        
        if (this.config.enableSmartCaching) {
            const cached = this.cache.get<FeedItem[]>(cacheKey);
            if (cached) {
                return cached;
            }
        }

        // Get posts and comments in parallel
        const [postsMap, commentsMap] = await Promise.all([
            this.getPostsBatch(postIds, token),
            this.commentService.getCommentsForMultiplePosts(postIds, `?size=${this.config.maxCommentsPerPost}`)
        ]);

        const feedItems: FeedItem[] = postIds.map(postId => ({
            post: postsMap.get(postId)!,
            comments: commentsMap.get(postId)
        })).filter(item => item.post); // Filter out null posts

        if (this.config.enableSmartCaching) {
            this.cache.set(cacheKey, feedItems, this.config.feedTTL);
        }

        return feedItems;
    }

    // Cache warming strategies
    async warmupFeedCache(userId: ResId, token: string): Promise<void> {
        console.log(`Warming up feed cache for user ${userId}`);
        
        try {
            // Preload main feed
            await this.getFeedWithComments({ userId, page: 0, size: 10 }, token);
            
            // Preload user posts
            await this.postService.getPostsByUserId(userId, { page: 0, size: 5 }, token);
            
            console.log(`Feed cache warmup completed for user ${userId}`);
        } catch (error) {
            console.error(`Feed cache warmup failed for user ${userId}:`, error);
        }
    }

    // Cache analytics and monitoring
    getCacheAnalytics() {
        const postStats = this.postService.getCacheStats();
        const commentStats = this.commentService.getCacheStats();
        
        return {
            posts: postStats,
            comments: commentStats,
            combined: {
                totalSize: postStats.size + commentStats.size,
                totalHits: postStats.hits + commentStats.hits,
                totalMisses: postStats.misses + commentStats.misses,
                combinedHitRate: (postStats.hits + commentStats.hits) / (postStats.hits + commentStats.misses + postStats.misses + commentStats.misses) || 0
            }
        };
    }

    async healthCheck(): Promise<{ healthy: boolean; services: any }> {
        const [postHealth, commentHealth] = await Promise.all([
            this.commentService.healthCheck(),
            Promise.resolve({ healthy: true, stats: this.postService.getCacheStats() })
        ]);

        return {
            healthy: postHealth.healthy && commentHealth.healthy,
            services: {
                posts: postHealth,
                comments: commentHealth
            }
        };
    }

    // Private helper methods
    private async enrichFeedWithComments(posts: PostResponse[], token: string): Promise<FeedItem[]> {
        const postIds = posts.map(post => post.id);
        const commentsMap = await this.commentService.getCommentsForMultiplePosts(
            postIds, 
            `?size=${this.config.maxCommentsPerPost}`
        );

        return posts.map(post => ({
            post,
            comments: commentsMap.get(post.id)
        }));
    }

    private async getPostsBatch(postIds: ResId[], token: string): Promise<Map<ResId, PostResponse>> {
        const postsMap = new Map<ResId, PostResponse>();
        
        // Fetch posts in parallel
        const postPromises = postIds.map(async (postId) => {
            try {
                const post = await this.postService.getPostById(postId, token);
                return { postId, post };
            } catch (error) {
                console.error(`Failed to fetch post ${postId}:`, error);
                return { postId, post: null };
            }
        });

        const results = await Promise.allSettled(postPromises);
        
        results.forEach((result, index) => {
            if (result.status === 'fulfilled' && result.value.post) {
                postsMap.set(result.value.postId, result.value.post);
            }
        });

        return postsMap;
    }

    private invalidateFeedCaches(): void {
        this.cache.invalidatePattern('feed:');
        this.cache.invalidatePattern('posts:batch:');
    }

    private invalidateUserCaches(userId: ResId): void {
        this.postService.invalidateUserCaches(userId);
        this.cache.invalidatePattern(`feed:withComments:*userId*${userId}*`);
    }

    // Cache management utilities
    clearAllCaches(): void {
        this.postService.invalidateAll();
        this.commentService.invalidateAllCommentCaches();
        this.cache.clear();
    }

    getCacheConfiguration() {
        return {
            ...this.config,
            postService: this.postService.getCacheStats(),
            commentService: this.commentService.getCacheStats()
        };
    }
}
