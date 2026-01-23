import { Injectable, Inject } from '@/core/di';
import { CacheServiceManager, TYPES } from '@/core';
import { CacheProvider } from '@/core/cache';
import { PostRepository } from '../repositories/PostRepository';
import { CacheKeys } from '../cache/CacheKeys';
import type { 
    IPostRepository, 
    PostQuery, 
    PostResponse, 
    PostPage, 
    PostRequest, 
    RepostRequest, 
    VoteBody,
    ReactionRequest
} from '@/features/feed/domain';
import type { ResId } from '@/shared/api/models/common';

export interface PostDataServiceConfig {
    defaultTTL: number;
    postTTL: number;
    feedTTL: number;
    enableRetry: boolean;
    maxRetries: number;
    retryDelay: number;
}

@Injectable()
export class PostDataService {
    private cache: CacheProvider;
    private repository: IPostRepository;
    private config: PostDataServiceConfig;

    constructor(
        @Inject(TYPES.CACHE_SERVICE) cacheService: CacheServiceManager,
        repository: PostRepository,
        config: Partial<PostDataServiceConfig> = {}
    ) {
        this.cache = cacheService.getCache('feed');
        this.repository = repository;
        this.config = {
            defaultTTL: 300000, // 5 minutes
            postTTL: 600000,    // 10 minutes
            feedTTL: 120000,    // 2 minutes
            enableRetry: true,
            maxRetries: 3,
            retryDelay: 1000,
            ...config
        };
    }

    async getPosts(query: PostQuery, token: string): Promise<PostPage> {
        const cacheKey = CacheKeys.feed(query.userId || 'global');
        
        // Try cache first
        const cached = this.cache.get<PostPage>(cacheKey);
        if (cached) {
            return cached;
        }

        // Fetch from repository with retry logic
        const data = await this.withRetry(
            () => this.repository.getPosts(query, token),
            'getPosts'
        );

        // Cache the result
        this.cache.set(cacheKey, data, this.config.feedTTL);
        
        return data;
    }

    async getPostById(postId: ResId, token: string): Promise<PostResponse> {
        const cacheKey = CacheKeys.post(postId);
        
        // Try cache first
        const cached = this.cache.get<PostResponse>(cacheKey);
        if (cached) {
            return cached;
        }

        // Fetch from repository with retry logic
        const data = await this.withRetry(
            () => this.repository.getPostById(postId, token),
            'getPostById'
        );

        // Cache the result
        this.cache.set(cacheKey, data, this.config.postTTL);
        
        return data;
    }

    async getSavedPosts(query: PostQuery, token: string): Promise<PostPage> {
        const cacheKey = CacheKeys.savedPosts(query.userId || 'global');
        
        const cached = this.cache.get<PostPage>(cacheKey);
        if (cached) {
            return cached;
        }

        const data = await this.withRetry(
            () => this.repository.getSavedPosts(query, token),
            'getSavedPosts'
        );

        this.cache.set(cacheKey, data, this.config.feedTTL);
        return data;
    }

    async getPostsByUserId(userId: ResId, query: PostQuery, token: string): Promise<PostPage> {
        const cacheKey = CacheKeys.userPosts(userId);
        
        const cached = this.cache.get<PostPage>(cacheKey);
        if (cached) {
            return cached;
        }

        const data = await this.withRetry(
            () => this.repository.getPostsByUserId(userId, query, token),
            'getPostsByUserId'
        );

        this.cache.set(cacheKey, data, this.config.feedTTL);
        return data;
    }

    async searchPosts(queryText: string, query: PostQuery, token: string): Promise<PostPage> {
        const cacheKey = CacheKeys.searchResults(queryText);
        
        const cached = this.cache.get<PostPage>(cacheKey);
        if (cached) {
            return cached;
        }

        const data = await this.withRetry(
            () => this.repository.searchPosts(queryText, query, token),
            'searchPosts'
        );

        this.cache.set(cacheKey, data, this.config.defaultTTL);
        return data;
    }

    async createPost(post: PostRequest, token: string): Promise<PostResponse> {
        const data = await this.withRetry(
            () => this.repository.createPost(post, token),
            'createPost'
        );

        // Invalidate relevant caches
        this.invalidateUserCaches(post.userId);
        this.invalidateFeedCaches();

        return data;
    }

    async createRepost(repost: RepostRequest, token: string): Promise<PostResponse> {
        const data = await this.withRetry(
            () => this.repository.createRepost(repost, token),
            'createRepost'
        );

        // Invalidate relevant caches
        this.invalidateUserCaches(repost.userId);
        this.invalidateFeedCaches();

        return data;
    }

    async editPost(postId: ResId, post: PostRequest, token: string): Promise<PostResponse> {
        const data = await this.withRetry(
            () => this.repository.editPost(postId, post, token),
            'editPost'
        );

        // Invalidate post cache and related caches
        this.invalidatePostCache(postId);
        this.invalidateFeedCaches();

        return data;
    }

    async deletePost(postId: ResId, token: string): Promise<void> {
        await this.withRetry(
            () => this.repository.deletePost(postId, token),
            'deletePost'
        );

        // Invalidate all related caches
        this.invalidatePostCache(postId);
        this.invalidateFeedCaches();
    }

    async savePost(postId: ResId, token: string): Promise<void> {
        await this.withRetry(
            () => this.repository.savePost(postId, token),
            'savePost'
        );

        // Invalidate saved posts cache (we'd need userId here for proper invalidation)
        this.cache.invalidatePattern('savedPosts:');
    }

    async unsavePost(postId: ResId, token: string): Promise<void> {
        await this.withRetry(
            () => this.repository.unsavePost(postId, token),
            'unsavePost'
        );

        // Invalidate saved posts cache
        this.cache.invalidatePattern('savedPosts:');
    }

    async votePoll(vote: VoteBody, token: string): Promise<void> {
        await this.withRetry(
            () => this.repository.votePoll(vote, token),
            'votePoll'
        );

        // Invalidate post cache and poll results
        this.invalidatePostCache(vote.postId);
        this.cache.invalidate(CacheKeys.pollResults(vote.postId));
    }

    async reaction(reaction: ReactionRequest, token: string): Promise<void> {
        await this.withRetry(
            () => this.repository.reaction(reaction, token),
            'reaction'
        );

        // Invalidate post cache to update reaction counts
        this.invalidatePostCache(reaction.postId);
    }

    async getRepliedPosts(userId: ResId, query: PostQuery, token: string): Promise<PostPage> {
        const cacheKey = CacheKeys.repliedPosts(userId);
        
        const cached = this.cache.get<PostPage>(cacheKey);
        if (cached) {
            return cached;
        }

        const data = await this.withRetry(
            () => this.repository.getRepliedPosts(userId, query, token),
            'getRepliedPosts'
        );

        this.cache.set(cacheKey, data, this.config.feedTTL);
        return data;
    }

    // Cache invalidation methods
    invalidatePostCache(postId: ResId): void {
        const keys = CacheKeys.invalidatePost(postId);
        keys.forEach(key => this.cache.invalidate(key));
    }

    invalidateUserCaches(userId: ResId): void {
        const keys = CacheKeys.invalidateUserPosts(userId);
        keys.forEach(key => this.cache.invalidate(key));
    }

    invalidateFeedCaches(): void {
        this.cache.invalidatePattern('feed:');
        this.cache.invalidatePattern('userPosts:');
    }

    invalidateAll(): void {
        this.cache.clear();
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
                    console.error(`PostDataService: ${operationName} failed after ${attempt} attempts:`, error);
                    throw lastError;
                }
                
                // Wait before retry
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
}
