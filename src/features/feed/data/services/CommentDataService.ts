import { Injectable, Inject } from '@/core/di';
import { CacheServiceManager, TYPES } from '@/core';
import { createCacheProvider, type ICacheProvider } from '@/core/cache';
import { CommentRepository } from '../repositories/CommentRepository';
import { CacheKeys } from '../cache/CacheKeys';
import type {
    ICommentRepository,
    CommentQuery
} from '@/features/feed/domain';
import type {
    CommentRequest,
    CommentResponse,
    PagedComment
} from '@/features/feed/data/models/comment';
import type { ResId } from '@/shared/api/models/common';

export interface CommentDataServiceConfig {
    defaultTTL: number;
    commentsTTL: number;
    enableRetry: boolean;
    maxRetries: number;
    retryDelay: number;
}

@Injectable()
export class CommentDataService {
    private cache: ICacheProvider;
    private repository: ICommentRepository;
    private config: CommentDataServiceConfig;

    constructor(
        @Inject(TYPES.CACHE_SERVICE) cacheService: CacheServiceManager,
        repository: CommentRepository,
        config: Partial<CommentDataServiceConfig> = {}
    ) {
        this.cache = createCacheProvider();
        this.repository = repository;
        this.config = {
            defaultTTL: 300000,   // 5 minutes
            commentsTTL: 180000,  // 3 minutes
            enableRetry: true,
            maxRetries: 3,
            retryDelay: 1000,
            ...config
        };
    }

    async getCommentsByPostId(postId: ResId, pageParams?: string): Promise<PagedComment> {
        const cacheKey = CacheKeys.comments(postId) + (pageParams || '');

        // Try cache first
        const cached = this.cache.get<PagedComment>(cacheKey);
        if (cached) {
            return cached;
        }

        // Fetch from repository with retry logic
        const data = await this.withRetry(
            () => this.repository.getCommentsByPostId(postId, pageParams),
            'getCommentsByPostId'
        );

        // Cache the result
        this.cache.set(cacheKey, data, this.config.commentsTTL);

        return data;
    }

    async getLatestComment(userId: ResId, postId: ResId): Promise<CommentResponse> {
        const cacheKey = CacheKeys.userReactions(userId, postId) + ':latest';

        // Try cache first
        const cached = this.cache.get<CommentResponse>(cacheKey);
        if (cached) {
            return cached;
        }

        // Fetch from repository with retry logic
        const data = await this.withRetry(
            () => this.repository.getLatestComment(userId, postId),
            'getLatestComment'
        );

        // Cache the result with shorter TTL since it's frequently updated
        this.cache.set(cacheKey, data, this.config.defaultTTL);

        return data;
    }

    async createComment(body: CommentRequest): Promise<CommentResponse> {
        const data = await this.withRetry(
            () => this.repository.createComment(body),
            'createComment'
        );

        // Invalidate relevant caches
        this.invalidatePostComments(body.postId);
        this.invalidateLatestCommentCache(body.userId, body.postId);

        return data;
    }

    async deleteComment(commentId: ResId): Promise<Response> {
        const result = await this.withRetry(
            () => this.repository.deleteComment(commentId),
            'deleteComment'
        );

        // Invalidate all comment caches since we don't have postId from the response
        // In a real implementation, you'd want to track postId or get it from the comment before deletion
        this.cache.invalidatePattern('comments:');
        this.cache.invalidatePattern('reaction:');

        return result;
    }

    async deleteCommentWithPostId(commentId: ResId, postId: ResId, userId: ResId): Promise<Response> {
        const result = await this.withRetry(
            () => this.repository.deleteComment(commentId),
            'deleteComment'
        );

        // Targeted cache invalidation when we have the context
        this.invalidatePostComments(postId);
        this.invalidateLatestCommentCache(userId, postId);

        return result;
    }

    // Batch operations for better performance
    async getCommentsForMultiplePosts(postIds: ResId[], pageParams?: string): Promise<Map<ResId, PagedComment>> {
        const results = new Map<ResId, PagedComment>();
        const uncachedPostIds: ResId[] = [];

        // First, try to get from cache
        for (const postId of postIds) {
            const cacheKey = CacheKeys.comments(postId) + (pageParams || '');
            const cached = this.cache.get<PagedComment>(cacheKey);

            if (cached) {
                results.set(postId, cached);
            } else {
                uncachedPostIds.push(postId);
            }
        }

        // Fetch uncached data in parallel
        if (uncachedPostIds.length > 0) {
            const fetchPromises = uncachedPostIds.map(async (postId) => {
                try {
                    const data = await this.withRetry(
                        () => this.repository.getCommentsByPostId(postId, pageParams),
                        'getCommentsByPostId'
                    );

                    // Cache the result
                    const cacheKey = CacheKeys.comments(postId) + (pageParams || '');
                    this.cache.set(cacheKey, data, this.config.commentsTTL);

                    return { postId, data };
                } catch (error) {
                    console.error(`Failed to fetch comments for post ${postId}:`, error);
                    return { postId, data: null };
                }
            });

            const fetchedResults = await Promise.allSettled(fetchPromises);

            fetchedResults.forEach((result, index) => {
                if (result.status === 'fulfilled' && result.value.data) {
                    results.set(result.value.postId, result.value.data);
                }
            });
        }

        return results;
    }

    // Cache invalidation methods
    invalidatePostComments(postId: ResId): void {
        const baseKey = CacheKeys.comments(postId);
        // Invalidate all paginated comment caches for this post
        this.cache.invalidatePattern(`${baseKey}*`);
    }

    invalidateLatestCommentCache(userId: ResId, postId: ResId): void {
        const cacheKey = CacheKeys.userReactions(userId, postId) + ':latest';
        this.cache.invalidate(cacheKey);
    }

    invalidateAllCommentCaches(): void {
        this.cache.invalidatePattern('comments:');
        this.cache.invalidatePattern('reaction:');
    }

    // Utility methods
    private async withRetry<T>(
        operation: () => Promise<T>,
        operationName: string
    ): Promise<T> {
        if (!this.config.enableRetry) {
            return operation();
        }

        let lastError: Error;

        for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
            try {
                return await operation();
            } catch (error) {
                lastError = error as Error;

                if (attempt === this.config.maxRetries) {
                    console.error(`CommentDataService: ${operationName} failed after ${attempt} attempts:`, error);
                    throw lastError;
                }

                // Wait before retry with exponential backoff
                await new Promise(resolve =>
                    setTimeout(resolve, this.config.retryDelay * attempt)
                );
            }
        }

        throw lastError!;
    }

    getCacheStats() {
        return this.cache.getStats();
    }

    // Cache warming methods
    async warmupCache(postIds: ResId[], pageParams?: string): Promise<void> {
        console.log('Warming up comment cache for posts:', postIds);
        await this.getCommentsForMultiplePosts(postIds, pageParams);
        console.log('Comment cache warmup completed');
    }

    // Cache health check
    async healthCheck(): Promise<{ healthy: boolean; stats: any }> {
        try {
            const stats = this.getCacheStats();
            return {
                healthy: true,
                stats
            };
        } catch (error) {
            return {
                healthy: false,
                stats: { error: (error as Error).message }
            };
        }
    }
}
