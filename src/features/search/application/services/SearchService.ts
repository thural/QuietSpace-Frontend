/**
 * Search Service.
 * 
 * Application service that orchestrates search operations
 * and provides a high-level interface for search functionality.
 */

import type { UserList } from "@/api/schemas/inferred/user";
import type { PostList } from "@/api/schemas/inferred/post";
import type { SearchQuery, SearchResult } from "../../domain/entities";
import type { ISearchRepository } from "../../data/repositories/SearchRepository";

/**
 * SearchService interface.
 * 
 * Defines the contract for search operations.
 */
export interface ISearchService {
    searchUsers(query: string): Promise<UserList>;
    searchPosts(query: string): Promise<PostList>;
    searchAll(query: string): Promise<SearchResult>;
    clearSearch(): void;
    getSearchHistory(): SearchQuery[];
    addToHistory(query: SearchQuery): void;
}

/**
 * SearchService implementation.
 * 
 * Provides high-level search functionality by coordinating
 * between different search repositories and services.
 */
export class SearchService implements ISearchService {
    constructor(
        private searchRepository: ISearchRepository
    ) {}

    /**
     * Searches for users based on the provided query.
     * 
     * @param query - The search query string
     * @returns Promise resolving to list of users
     */
    async searchUsers(query: string): Promise<UserList> {
        return this.searchRepository.searchUsers(query);
    }

    /**
     * Searches for posts based on the provided query.
     * 
     * @param query - The search query string
     * @returns Promise resolving to list of posts
     */
    async searchPosts(query: string): Promise<PostList> {
        return this.searchRepository.searchPosts(query);
    }

    /**
     * Searches for both users and posts based on the provided query.
     * 
     * @param query - The search query string
     * @returns Promise resolving to combined search results
     */
    async searchAll(query: string): Promise<SearchResult> {
        const startTime = Date.now();
        const [users, posts] = await Promise.all([
            this.searchUsers(query),
            this.searchPosts(query)
        ]);

        return {
            query,
            users,
            posts,
            timestamp: new Date().toISOString(),
            totalResults: users.length + posts.length,
            searchDuration: Date.now() - startTime,
            hasMore: false,
            metadata: {
                algorithm: 'fulltext',
                relevanceThreshold: 0.5,
                appliedFilters: [],
                rankingMethod: 'relevance',
                fromCache: false
            }
        };
    }

    /**
     * Clears all search results and history.
     */
    clearSearch(): void {
        // TODO: Implement through services in Priority 2
        console.log('SearchService: Clearing search');
    }

    /**
     * Gets the search history.
     * 
     * @returns Array of previous search queries
     */
    getSearchHistory(): SearchQuery[] {
        // TODO: Implement through history service in Priority 2
        console.log('SearchService: Getting search history');
        return [];
    }

    /**
     * Adds a query to search history.
     * 
     * @param query - The search query to add
     */
    addToHistory(query: SearchQuery): void {
        // TODO: Implement through history service in Priority 2
        console.log('SearchService: Adding to history:', query);
    }
}
