/**
 * Search Dependency Injection Container.
 * 
 * Manages dependency injection for the Search feature.
 * Provides centralized dependency management and configuration.
 */

import type { ISearchRepository } from "@search/data/repositories/SearchRepository";
import { UserSearchRepository } from "@search/data/repositories/UserSearchRepository";
import { PostSearchRepository } from "@search/data/repositories/PostSearchRepository";
import { MockSearchRepository } from "@search/data/repositories/MockSearchRepository";
import { SearchService } from "@search/application/services/SearchService";
import { SearchQueryService } from "@search/application/services/SearchQueryService";
import { useAuthStore } from '@services/store/zustand';

/**
 * DI Container configuration options.
 */
export interface DIContainerConfig {
    useMockRepositories?: boolean;
    enableLogging?: boolean;
    // useReactQuery option removed - migrated to enterprise hooks
}

/**
 * Search DI Container.
 * 
 * Manages dependency registration and resolution for Search feature.
 */
export class SearchDIContainer {
    private repositories: Map<string, ISearchRepository> = new Map();
    private services: Map<string, any> = new Map();
    private config: DIContainerConfig;

    constructor(config: DIContainerConfig = {}) {
        this.config = {
            useMockRepositories: true,
            enableLogging: false,
            ...config
        };
        this.initializeDependencies();
    }

    /**
     * Initialize all dependencies based on configuration.
     */
    private initializeDependencies(): void {
        this.registerRepositories();
        this.registerServices();
    }

    /**
     * Register repository dependencies.
     */
    private registerRepositories(): void {
        const authStore = useAuthStore.getState();
        const token = authStore.data.accessToken || null;

        const repository = this.config.useMockRepositories 
            ? new MockSearchRepository()
            : this.createProductionRepositories();

        this.repositories.set('search', repository);
        this.repositories.set('userSearch', new UserSearchRepository(token));
        this.repositories.set('postSearch', new PostSearchRepository(token));
    }

    /**
     * Create production repository instances.
     */
    private createProductionRepositories(): ISearchRepository {
        if (this.config.enableLogging) {
            console.log('Initializing production repositories with real API calls');
        }
        
        // Create real repositories with token
        const authStore = useAuthStore.getState();
        const token = authStore.data.accessToken || null;
        
        return new MockSearchRepository(); // For now, use mock with real token
        // TODO: Implement real search repository when API is available
        // return new SearchRepository(token);
    }

    /**
     * Register service dependencies.
     */
    private registerServices(): void {
        const searchRepository = this.repositories.get('search')!;

        this.services.set('searchService', new SearchService(searchRepository));
        this.services.set('queryService', new SearchQueryService());
    }

    /**
     * Get repository by key.
     */
    getRepository<T extends ISearchRepository>(key: string): T {
        const repository = this.repositories.get(key);
        if (!repository) {
            throw new Error(`Repository '${key}' not found in container`);
        }
        return repository as T;
    }

    /**
     * Get service by key.
     */
    getService<T>(key: string): T {
        const service = this.services.get(key);
        if (!service) {
            throw new Error(`Service '${key}' not found in container`);
        }
        return service as T;
    }

    /**
     * Get search service.
     */
    getSearchService(): SearchService {
        return this.getService<SearchService>('searchService');
    }

    /**
     * Get query service.
     */
    getQueryService(): SearchQueryService {
        return this.getService<SearchQueryService>('queryService');
    }

    /**
     * Get user search repository.
     */
    getUserSearchRepository(): UserSearchRepository {
        return this.getRepository<UserSearchRepository>('userSearch');
    }

    /**
     * Get post search repository.
     */
    getPostSearchRepository(): PostSearchRepository {
        return this.getRepository<PostSearchRepository>('postSearch');
    }

    /**
     * Update configuration and reinitialize dependencies.
     */
    updateConfig(newConfig: Partial<DIContainerConfig>): void {
        this.config = { ...this.config, ...newConfig };
        this.repositories.clear();
        this.services.clear();
        this.initializeDependencies();
    }

    /**
     * Get current configuration.
     */
    getConfig(): DIContainerConfig {
        return { ...this.config };
    }
}

/**
 * Global DI container instance.
 */
let globalContainer: SearchDIContainer | null = null;

/**
 * Get or create global DI container.
 */
export const getSearchDIContainer = (config?: DIContainerConfig): SearchDIContainer => {
    if (!globalContainer || config) {
        globalContainer = new SearchDIContainer(config);
    }
    return globalContainer;
};

/**
 * Reset global DI container (useful for testing).
 */
export const resetSearchDIContainer = (): void => {
    globalContainer = null;
};
