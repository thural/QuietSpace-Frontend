/**
 * Feed DI Container.
 * 
 * Dependency injection container for Feed feature.
 * Manages repository instances and provides configured implementations.
 */

import type { IPostRepository } from '../domain/entities/IPostRepository';
import type { FeedDIConfig } from './FeedDIConfig';
import { getFeedDIConfig } from './FeedDIConfig';
import { MockPostRepository } from '../data/repositories/MockPostRepository';

/**
 * Feed dependency injection container
 */
export class FeedDIContainer {
    private readonly config: FeedDIConfig;
    private postRepository: IPostRepository;

    constructor(config?: Partial<FeedDIConfig>, postRepository?: IPostRepository) {
        this.config = { ...getFeedDIConfig(), ...config };

        // Initialize repository based on configuration
        this.postRepository = this.createPostRepository(postRepository);
    }

    /**
     * Create repository instance based on configuration
     */
    private createPostRepository(providedRepository?: IPostRepository): IPostRepository {
        if (this.config.useMockRepositories) {
            console.log('🔧 Feed: Using MockPostRepository for development/testing');
            return new MockPostRepository(100); // 100ms delay for realistic testing
        } else {
            console.log('🌐 Feed: Using real PostRepository with API integration');
            if (providedRepository) {
                return providedRepository;
            }
            throw new Error('PostRepository must be provided when not using mock repositories');
        }
    }

    // Repository getters
    getPostRepository(): IPostRepository {
        return this.postRepository;
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
    static create(config?: Partial<FeedDIConfig>, postRepository?: IPostRepository): FeedDIContainer {
        return new FeedDIContainer(config, postRepository);
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
