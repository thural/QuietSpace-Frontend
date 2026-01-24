/**
 * Search Repository Interface.
 * 
 * Defines the contract for search data access operations.
 * Abstracts the data source and provides a clean interface.
 */

import type { UserList } from "@/features/profile/data/models/user";
import type { PostList } from "@/features/feed/data/models/post";
import type { SearchQuery, SearchResult, SearchFilters } from "@search/domain/entities";

/**
 * ISearchRepository interface.
 * 
 * Defines the contract for search data access operations.
 */
export interface ISearchRepository {
    /**
     * Searches for users based on query and filters.
     * 
     * @param query - The search query
     * @param filters - Optional search filters
     * @returns Promise resolving to user list
     */
    searchUsers(query: string, filters?: SearchFilters): Promise<UserList>;

    /**
     * Searches for posts based on query and filters.
     * 
     * @param query - The search query
     * @param filters - Optional search filters
     * @returns Promise resolving to post list
     */
    searchPosts(query: string, filters?: SearchFilters): Promise<PostList>;

    /**
     * Performs a comprehensive search across all content types.
     * 
     * @param query - The search query
     * @param filters - Optional search filters
     * @returns Promise resolving to search results
     */
    searchAll(query: string, filters?: SearchFilters): Promise<SearchResult>;

    /**
     * Gets search suggestions based on partial query.
     * 
     * @param partialQuery - The partial search query
     * @returns Promise resolving to suggestions array
     */
    getSuggestions(partialQuery: string): Promise<string[]>;

    /**
     * Gets search history for the current user.
     * 
     * @returns Promise resolving to search history
     */
    getSearchHistory(): Promise<SearchQuery[]>;

    /**
     * Saves a query to search history.
     * 
     * @param query - The query to save
     * @returns Promise resolving when saved
     */
    saveToHistory(query: SearchQuery): Promise<void>;

    /**
     * Clears search history.
     * 
     * @returns Promise resolving when cleared
     */
    clearHistory(): Promise<void>;

    /**
     * Gets trending searches.
     * 
     * @param limit - Maximum number of trends to return
     * @returns Promise resolving to trending searches
     */
    getTrendingSearches(limit?: number): Promise<SearchQuery[]>;

    /**
     * Checks if repository supports real-time search.
     * 
     * @returns True if real-time search is supported
     */
    supportsRealTimeSearch(): boolean;

    /**
     * Sets up real-time search subscription.
     * 
     * @param callback - Callback for real-time updates
     * @returns Unsubscribe function
     */
    subscribeToRealTimeSearch(callback: (results: SearchResult) => void): () => void;

    /**
     * Gets repository capabilities.
     * 
     * @returns Object describing repository capabilities
     */
    getCapabilities(): RepositoryCapabilities;
}

/**
 * RepositoryCapabilities interface.
 * 
 * Describes the capabilities of a search repository.
 */
export interface RepositoryCapabilities {
    /** Whether user search is supported */
    supportsUserSearch: boolean;

    /** Whether post search is supported */
    supportsPostSearch: boolean;

    /** Whether real-time search is supported */
    supportsRealTime: boolean;

    /** Whether search history is supported */
    supportsHistory: boolean;

    /** Whether search suggestions are supported */
    supportsSuggestions: boolean;

    /** Whether advanced filtering is supported */
    supportsAdvancedFilters: boolean;

    /** Maximum number of results per query */
    maxResults: number;

    /** Supported search algorithms */
    supportedAlgorithms: ('fulltext' | 'fuzzy' | 'semantic')[];

    /** Whether caching is supported */
    supportsCaching: boolean;
}

/**
 * Abstract base class for search repositories.
 * 
 * Provides common functionality and default implementations.
 */
export abstract class BaseSearchRepository implements ISearchRepository {
    protected capabilities: RepositoryCapabilities;

    constructor(capabilities: Partial<RepositoryCapabilities> = {}) {
        this.capabilities = {
            supportsUserSearch: true,
            supportsPostSearch: true,
            supportsRealTime: false,
            supportsHistory: false,
            supportsSuggestions: false,
            supportsAdvancedFilters: false,
            maxResults: 100,
            supportedAlgorithms: ['fulltext'],
            supportsCaching: false,
            ...capabilities
        };
    }

    // Abstract methods that must be implemented by concrete repositories
    abstract searchUsers(query: string, filters?: SearchFilters): Promise<UserList>;
    abstract searchPosts(query: string, filters?: SearchFilters): Promise<PostList>;
    abstract searchAll(query: string, filters?: SearchFilters): Promise<SearchResult>;

    // Default implementations
    async getSuggestions(partialQuery: string): Promise<string[]> {
        if (!this.capabilities.supportsSuggestions) {
            throw new Error('Suggestions not supported by this repository');
        }
        return [];
    }

    async getSearchHistory(): Promise<SearchQuery[]> {
        if (!this.capabilities.supportsHistory) {
            throw new Error('Search history not supported by this repository');
        }
        return [];
    }

    async saveToHistory(query: SearchQuery): Promise<void> {
        if (!this.capabilities.supportsHistory) {
            throw new Error('Search history not supported by this repository');
        }
    }

    async clearHistory(): Promise<void> {
        if (!this.capabilities.supportsHistory) {
            throw new Error('Search history not supported by this repository');
        }
    }

    async getTrendingSearches(limit: number = 10): Promise<SearchQuery[]> {
        if (!this.capabilities.supportsHistory) {
            throw new Error('Trending searches not supported by this repository');
        }
        return [];
    }

    supportsRealTimeSearch(): boolean {
        return this.capabilities.supportsRealTime;
    }

    subscribeToRealTimeSearch(callback: (results: SearchResult) => void): () => void {
        if (!this.capabilities.supportsRealTime) {
            throw new Error('Real-time search not supported by this repository');
        }
        return () => { }; // No-op unsubscribe
    }

    getCapabilities(): RepositoryCapabilities {
        return { ...this.capabilities };
    }
}
