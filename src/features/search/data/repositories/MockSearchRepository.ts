/**
 * Mock Search Repository.
 * 
 * Mock implementation of search repository for testing and development.
 * Provides in-memory search functionality with mock data.
 */

import type { UserList } from "@/features/profile/data/models/user";
import type { PostList } from "@/features/feed/data/models/post";
import type { SearchQuery, SearchResult, SearchFilters } from "@search/domain/entities";
import { BaseSearchRepository, type RepositoryCapabilities } from "./SearchRepository";
import { ReactionType } from "@/api/rest/models/native/reaction";
import { ContentType } from "@/api/rest/models/native/common";

/**
 * MockSearchRepository implementation.
 * 
 * Provides mock search functionality for testing and development.
 * Uses in-memory data and simulates API responses.
 */
export class MockSearchRepository extends BaseSearchRepository {
    private mockUsers: UserList = [];
    private mockPosts: PostList = [];
    private searchHistory: SearchQuery[] = [];

    constructor() {
        super({
            supportsUserSearch: true,
            supportsPostSearch: true,
            supportsRealTime: false,
            supportsHistory: true,
            supportsSuggestions: true,
            supportsAdvancedFilters: true,
            maxResults: 50,
            supportedAlgorithms: ['fulltext', 'fuzzy', 'semantic'],
            supportsCaching: true
        });

        this.initializeMockData();
    }

    /**
     * Initializes mock data for testing.
     */
    private initializeMockData(): void {
        // Mock users
        this.mockUsers = [
            {
                id: 'user-1',
                username: 'johndoe',
                email: 'john@example.com',
                bio: 'Software developer passionate about clean code',
                photo: undefined,
                isPrivateAccount: false,
                createDate: '2024-01-01T00:00:00Z',
                updateDate: '2024-01-15T00:00:00Z'
            },
            {
                id: 'user-2',
                username: 'janedoe',
                email: 'jane@example.com',
                bio: 'UX designer and coffee enthusiast',
                photo: undefined,
                isPrivateAccount: true,
                createDate: '2024-01-02T00:00:00Z',
                updateDate: '2024-01-10T00:00:00Z'
            }
        ];

        // Mock posts
        this.mockPosts = [
            {
                id: 'post-1',
                text: 'This is a post about React development',
                title: 'React Best Practices',
                likeCount: 100,
                commentCount: 20,
                createDate: '2024-01-05T00:00:00Z',
                userId: 'user-1',
                username: 'johndoe',
                poll: null,
                userReaction: {
                    id: 'reaction-1',
                    userId: 'user-1',
                    contentId: 'post-1',
                    reactionType: ReactionType.LIKE,
                    contentType: ContentType.POST,
                    username: 'johndoe'
                }
            },
            {
                id: 'post-2',
                text: 'A guide to TypeScript interfaces',
                title: 'TypeScript Interface Guide',
                likeCount: 80,
                commentCount: 15,
                createDate: '2024-01-06T00:00:00Z',
                userId: 'user-2',
                username: 'janedoe',
                poll: null,
                userReaction: {
                    id: 'reaction-2',
                    userId: 'user-2',
                    contentId: 'post-2',
                    reactionType: ReactionType.LIKE,
                    contentType: ContentType.POST,
                    username: 'janedoe'
                }
            }
        ];
    }

    /**
     * Searches for users based on query and filters.
     * 
     * @param query - The search query
     * @param filters - Optional search filters
     * @returns Promise resolving to user list
     */
    async searchUsers(query: string, filters?: SearchFilters): Promise<UserList> {
        console.log('MockSearchRepository: Searching users with query:', query, 'filters:', filters);

        let results = [...this.mockUsers];

        // Apply text search
        if (query) {
            const queryLower = query.toLowerCase();
            results = results.filter(user =>
                user.username.toLowerCase().includes(queryLower) ||
                user.bio.toLowerCase().includes(queryLower)
            );
        }

        // Apply filters
        if (filters) {
            results = this.applyUserFilters(results, filters);
        }

        // Simulate network delay
        await this.simulateDelay(300);

        return results.slice(0, this.capabilities.maxResults);
    }

    /**
     * Searches for posts based on query and filters.
     * 
     * @param query - The search query
     * @param filters - Optional search filters
     * @returns Promise resolving to post list
     */
    async searchPosts(query: string, filters?: SearchFilters): Promise<PostList> {
        console.log('MockSearchRepository: Searching posts with query:', query, 'filters:', filters);

        let results = [...this.mockPosts];

        // Apply text search
        if (query) {
            const queryLower = query.toLowerCase();
            results = results.filter(post =>
                post.title.toLowerCase().includes(queryLower) ||
                post.text.toLowerCase().includes(queryLower)
            );
        }

        // Apply filters
        if (filters) {
            results = this.applyPostFilters(results, filters);
        }

        // Simulate network delay
        await this.simulateDelay(300);

        return results.slice(0, this.capabilities.maxResults);
    }

    /**
     * Performs comprehensive search across all content types.
     * 
     * @param query - The search query
     * @param filters - Optional search filters
     * @returns Promise resolving to search results
     */
    async searchAll(query: string, filters?: SearchFilters): Promise<SearchResult> {
        const startTime = Date.now();

        const [users, posts] = await Promise.all([
            this.searchUsers(query, filters),
            this.searchPosts(query, filters)
        ]);

        const searchDuration = Date.now() - startTime;

        return {
            query,
            users,
            posts,
            timestamp: new Date().toISOString(),
            totalResults: users.length + posts.length,
            searchDuration,
            hasMore: false,
            metadata: {
                algorithm: 'fulltext',
                relevanceThreshold: 0.3,
                appliedFilters: filters ? Object.keys(filters) : [],
                rankingMethod: 'relevance',
                fromCache: false
            }
        };
    }

    /**
     * Gets search suggestions based on partial query.
     * 
     * @param partialQuery - The partial search query
     * @returns Promise resolving to suggestions array
     */
    async getSuggestions(partialQuery: string): Promise<string[]> {
        console.log('MockSearchRepository: Getting suggestions for:', partialQuery);

        if (!partialQuery || partialQuery.length < 2) {
            return [];
        }

        const suggestions: string[] = [];
        const queryLower = partialQuery.toLowerCase();

        // User suggestions
        this.mockUsers.forEach(user => {
            if (user.username.toLowerCase().startsWith(queryLower)) {
                suggestions.push(user.username);
            }
        });

        // Post suggestions
        this.mockPosts.forEach(post => {
            if (post.title.toLowerCase().includes(queryLower)) {
                suggestions.push(post.title);
            }
        });

        // Generic suggestions
        suggestions.push(
            `${partialQuery} tutorial`,
            `${partialQuery} guide`,
            `${partialQuery} tips`
        );

        await this.simulateDelay(100);

        return [...new Set(suggestions)].slice(0, 5);
    }

    /**
     * Gets search history for the current user.
     * 
     * @returns Promise resolving to search history
     */
    async getSearchHistory(): Promise<SearchQuery[]> {
        console.log('MockSearchRepository: Getting search history');
        await this.simulateDelay(50);
        return [...this.searchHistory];
    }

    /**
     * Saves a query to search history.
     * 
     * @param query - The query to save
     * @returns Promise resolving when saved
     */
    async saveToHistory(query: SearchQuery): Promise<void> {
        console.log('MockSearchRepository: Saving to history:', query);

        // Remove existing query with same text
        this.searchHistory = this.searchHistory.filter(q => q.text !== query.text);

        // Add new query to the beginning
        this.searchHistory.unshift(query);

        // Keep only last 50 queries
        this.searchHistory = this.searchHistory.slice(0, 50);

        await this.simulateDelay(50);
    }

    /**
     * Clears search history.
     * 
     * @returns Promise resolving when cleared
     */
    async clearHistory(): Promise<void> {
        console.log('MockSearchRepository: Clearing search history');
        this.searchHistory = [];
        await this.simulateDelay(50);
    }

    /**
     * Gets trending searches.
     * 
     * @param limit - Maximum number of trends to return
     * @returns Promise resolving to trending searches
     */
    async getTrendingSearches(limit: number = 10): Promise<SearchQuery[]> {
        console.log('MockSearchRepository: Getting trending searches');

        // Mock trending searches
        const trending = [
            { text: 'react hooks', count: 100, lastUsed: '2024-01-15T10:00:00Z' },
            { text: 'typescript', count: 85, lastUsed: '2024-01-15T09:30:00Z' },
            { text: 'next.js', count: 75, lastUsed: '2024-01-15T09:00:00Z' }
        ];

        await this.simulateDelay(100);

        return trending.slice(0, limit).map((trend, index) => ({
            id: `trending-${index}`,
            text: trend.text,
            optimizedText: trend.text.toLowerCase(),
            filters: {},
            timestamp: trend.lastUsed,
            isValid: true,
            resultCount: trend.count
        }));
    }

    /**
     * Applies user-specific filters to results.
     * 
     * @param users - Array of users to filter
     * @param filters - Filters to apply
     * @returns Filtered user array
     */
    private applyUserFilters(users: UserList, filters: SearchFilters): UserList {
        let results = [...users];

        if (filters.verified !== undefined) {
            // Since isVerified is not in the schema, we'll use isPrivateAccount as a proxy
            // or remove this filter if verification status isn't available
            results = results.filter(user => user.isPrivateAccount !== filters.verified);
        }

        if (filters.minFollowers !== undefined) {
            // followersCount is not in the schema, so this filter is disabled
            // results = results.filter(user => 
            //     (user.followersCount || 0) >= filters.minFollowers!
            // );
        }

        if (filters.dateRange) {
            results = results.filter(user => {
                const userDate = new Date(user.createDate);
                if (filters.dateRange!.from && userDate < new Date(filters.dateRange!.from)) {
                    return false;
                }
                if (filters.dateRange!.to && userDate > new Date(filters.dateRange!.to)) {
                    return false;
                }
                return true;
            });
        }

        return results;
    }

    /**
     * Applies post-specific filters to results.
     * 
     * @param posts - Array of posts to filter
     * @param filters - Filters to apply
     * @returns Filtered post array
     */
    private applyPostFilters(posts: PostList, filters: SearchFilters): PostList {
        let results = [...posts];

        if (filters.dateRange) {
            results = results.filter(post => {
                const postDate = new Date(post.createDate);
                if (filters.dateRange!.from && postDate < new Date(filters.dateRange!.from)) {
                    return false;
                }
                if (filters.dateRange!.to && postDate > new Date(filters.dateRange!.to)) {
                    return false;
                }
                return true;
            });
        }

        if (filters.custom?.minLikes !== undefined) {
            results = results.filter(post =>
                (post.likeCount || 0) >= filters.custom!.minLikes
            );
        }

        return results;
    }

    /**
     * Simulates network delay for realistic testing.
     * 
     * @param ms - Delay in milliseconds
     * @returns Promise that resolves after delay
     */
    private simulateDelay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Sets mock data for testing.
     * 
     * @param users - Mock users to set
     * @param posts - Mock posts to set
     */
    setMockData(users?: UserList, posts?: PostList): void {
        if (users) this.mockUsers = users;
        if (posts) this.mockPosts = posts;
    }

    /**
     * Clears all mock data.
     */
    clearMockData(): void {
        this.mockUsers = [];
        this.mockPosts = [];
        this.searchHistory = [];
    }
}
