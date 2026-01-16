/**
 * Feed DI Container.
 * 
 * Dependency injection container for Feed feature.
 * Manages repository instances and provides configured implementations.
 */

import type { JwtToken } from '@api/schemas/inferred/common';
import type { IPostRepository, PostQuery, PostFilters } from '../domain/entities/IPostRepository';
import type { FeedDIConfig } from './FeedDIConfig';
import { PostRepository } from '../data/repositories/PostRepository';
import { MockPostRepository } from '../data/repositories/MockPostRepository';
import { getFeedDIConfig } from './FeedDIConfig';

/**
 * Feed dependency injection container
 */
export class FeedDIContainer {
    private readonly config: FeedDIConfig;
    private postRepository: IPostRepository;
    private readonly token: JwtToken | null;

    constructor(config?: Partial<FeedDIConfig>, token?: JwtToken) {
        this.config = { ...getFeedDIConfig(), ...config };
        this.token = token || null;
        
        // Initialize repository based on configuration
        this.postRepository = this.createPostRepository();
    }

    /**
     * Create repository instance based on configuration
     */
    private createPostRepository(): IPostRepository {
        if (this.config.useMockRepositories) {
            console.log('🔧 Feed: Using MockPostRepository for development/testing');
            return new MockPostRepository(100); // 100ms delay for realistic testing
        } else {
            if (!this.token) {
                throw new Error('Token is required for real PostRepository');
            }
            console.log('🌐 Feed: Using real PostRepository with API integration');
            return new PostRepository(this.token);
        }
    }

    // Repository getters
    getPostRepository(): IPostRepository {
        return this.postRepository;
    }

    getToken(): JwtToken | null {
        return this.token;
    }

    // Configuration getters
    getConfig(): FeedDIConfig {
        return this.config;
    }

    isUsingMockRepositories(): boolean {
        return this.config.useMockRepositories;
    }

    isRealTimeEnabled(): boolean {
        return this.config.enableRealTimeUpdates;
    }

    isOptimisticUpdatesEnabled(): boolean {
        return this.config.enableOptimisticUpdates;
    }

    getDefaultPageSize(): number {
        return this.config.defaultPageSize || 10;
    }

    isCachingEnabled(): boolean {
        return this.config.enableCaching ?? true;
    }

    /**
     * Update configuration at runtime
     */
    updateConfig(newConfig: Partial<FeedDIConfig>): void {
        Object.assign(this.config, newConfig);
        
        // Recreate repository if mock setting changed
        if (newConfig.useMockRepositories !== undefined) {
            this.postRepository = this.createPostRepository();
        }
    }

    /**
     * Factory method to create container with default configuration
     */
    static create(token?: JwtToken, config?: Partial<FeedDIConfig>): FeedDIContainer {
        return new FeedDIContainer(config, token);
    }

    /**
     * Factory method to create container for testing
     */
    static createForTesting(overrides: Partial<FeedDIConfig> = {}): FeedDIContainer {
        return new FeedDIContainer({
            ...getFeedDIConfig(),
            useMockRepositories: true,
            enableRealTimeUpdates: false,
            enableOptimisticUpdates: false,
            ...overrides
        });
    }
}
