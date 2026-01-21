/**
 * Post Search Repository.
 * 
 * Repository implementation for post search operations.
 * Handles post-specific search functionality and data access.
 */

import type { PostList } from "@/features/feed/data/models/post";
import type { SearchFilters } from "../../domain/entities";
import { BaseSearchRepository, type RepositoryCapabilities } from "./SearchRepository";
import { fetchPostQuery } from "@features/feed/data/postRequests";
import type { JwtToken } from "@/shared/api/models/common";

/**
 * IPostSearchRepository interface.
 * 
 * Extends base search repository with post-specific operations.
 */
export interface IPostSearchRepository extends BaseSearchRepository {
    /**
     * Searches for posts by title.
     * 
     * @param title - The title to search for
     * @param exactMatch - Whether to require exact match
     * @returns Promise resolving to post list
     */
    searchByTitle(title: string, exactMatch?: boolean): Promise<PostList>;

    /**
     * Searches for posts by content.
     * 
     * @param content - The content to search for
     * @returns Promise resolving to post list
     */
    searchByContent(content: string): Promise<PostList>;

    /**
     * Searches for posts by tags.
     * 
     * @param tags - Array of tags to search for
     * @param matchAll - Whether to match all tags (AND) or any tag (OR)
     * @returns Promise resolving to post list
     */
    searchByTags(tags: string[], matchAll?: boolean): Promise<PostList>;

    /**
     * Searches for posts by author.
     * 
     * @param authorId - The author ID to search for
     * @param query - Additional search query
     * @returns Promise resolving to post list
     */
    searchByAuthor(authorId: string, query?: string): Promise<PostList>;

    /**
     * Searches for posts within a date range.
     * 
     * @param fromDate - Start date for search range
     * @param toDate - End date for search range
     * @param query - Additional search query
     * @returns Promise resolving to post list
     */
    searchByDateRange(fromDate: string, toDate: string, query?: string): Promise<PostList>;

    /**
     * Searches for posts with minimum engagement.
     * 
     * @param minLikes - Minimum number of likes
     * @param minComments - Minimum number of comments
     * @param query - Additional search query
     * @returns Promise resolving to post list
     */
    searchByMinEngagement(minLikes: number, minComments: number, query?: string): Promise<PostList>;

    /**
     * Searches for posts by media type.
     * 
     * @param mediaType - The media type to filter by
     * @param query - Additional search query
     * @returns Promise resolving to post list
     */
    searchByMediaType(mediaType: 'image' | 'video' | 'audio' | 'text', query?: string): Promise<PostList>;
}

/**
 * PostSearchRepository implementation.
 * 
 * Concrete implementation of post search repository.
 * Integrates with existing post search APIs and data sources.
 */
export class PostSearchRepository extends BaseSearchRepository implements IPostSearchRepository {
    private token: JwtToken | null;

    constructor(token: JwtToken | null = null) {
        super({
            supportsUserSearch: false,
            supportsPostSearch: true,
            supportsRealTime: false,
            supportsHistory: false,
            supportsSuggestions: true,
            supportsAdvancedFilters: true,
            maxResults: 50,
            supportedAlgorithms: ['fulltext', 'fuzzy'],
            supportsCaching: true
        });
        this.token = token;
    }

    /**
     * Searches for posts based on query and filters.
     * 
     * @param query - The search query
     * @param filters - Optional search filters
     * @returns Promise resolving to post list
     */
    async searchPosts(query: string, filters?: SearchFilters): Promise<PostList> {
        try {
            console.log('PostSearchRepository: Searching posts with query:', query, 'filters:', filters);

            // Use existing API function
            const response = await fetchPostQuery(query, this.token);

            // Extract posts from response content
            const posts = response.content || [];

            console.log('PostSearchRepository: Found', posts.length, 'posts');

            return posts;
        } catch (error) {
            console.error('PostSearchRepository: Error searching posts:', error);
            return [];
        }
    }

    /**
     * Searches for users (not supported by post repository).
     * 
     * @param query - The search query
     * @param filters - Optional search filters
     * @returns Promise resolving to empty user list
     */
    async searchUsers(query: string, filters?: SearchFilters): Promise<any[]> {
        throw new Error('User search not supported by PostSearchRepository');
    }

    /**
     * Performs comprehensive search (posts only).
     * 
     * @param query - The search query
     * @param filters - Optional search filters
     * @returns Promise resolving to search results
     */
    async searchAll(query: string, filters?: SearchFilters): Promise<any> {
        const posts = await this.searchPosts(query, filters);

        return {
            query,
            users: [],
            posts,
            timestamp: new Date().toISOString(),
            totalResults: posts.length,
            searchDuration: 0,
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
     * Searches for posts by title.
     * 
     * @param title - The title to search for
     * @param exactMatch - Whether to require exact match
     * @returns Promise resolving to post list
     */
    async searchByTitle(title: string, exactMatch: boolean = false): Promise<PostList> {
        const query = exactMatch ? `title:"${title}"` : title;
        return this.searchPosts(query, { type: 'posts' });
    }

    /**
     * Searches for posts by content.
     * 
     * @param content - The content to search for
     * @returns Promise resolving to post list
     */
    async searchByContent(content: string): Promise<PostList> {
        const query = `content:${content}`;
        return this.searchPosts(query, { type: 'posts' });
    }

    /**
     * Searches for posts by tags.
     * 
     * @param tags - Array of tags to search for
     * @param matchAll - Whether to match all tags (AND) or any tag (OR)
     * @returns Promise resolving to post list
     */
    async searchByTags(tags: string[], matchAll: boolean = false): Promise<PostList> {
        const operator = matchAll ? 'AND' : 'OR';
        const tagQuery = tags.map(tag => `tag:${tag}`).join(` ${operator} `);

        return this.searchPosts(tagQuery, {
            type: 'posts',
            tags
        });
    }

    /**
     * Searches for posts by author.
     * 
     * @param authorId - The author ID to search for
     * @param query - Additional search query
     * @returns Promise resolving to post list
     */
    async searchByAuthor(authorId: string, query?: string): Promise<PostList> {
        const searchQuery = query ? `author:${authorId} ${query}` : `author:${authorId}`;

        return this.searchPosts(searchQuery, {
            type: 'posts',
            user: authorId
        });
    }

    /**
     * Searches for posts within a date range.
     * 
     * @param fromDate - Start date for search range
     * @param toDate - End date for search range
     * @param query - Additional search query
     * @returns Promise resolving to post list
     */
    async searchByDateRange(fromDate: string, toDate: string, query?: string): Promise<PostList> {
        const dateQuery = `date:[${fromDate} TO ${toDate}]`;
        const searchQuery = query ? `${dateQuery} ${query}` : dateQuery;

        return this.searchPosts(searchQuery, {
            type: 'posts',
            dateRange: { from: fromDate, to: toDate }
        });
    }

    /**
     * Searches for posts with minimum engagement.
     * 
     * @param minLikes - Minimum number of likes
     * @param minComments - Minimum number of comments
     * @param query - Additional search query
     * @returns Promise resolving to post list
     */
    async searchByMinEngagement(minLikes: number, minComments: number, query?: string): Promise<PostList> {
        const engagementQuery = `likes:>=${minLikes} comments:>=${minComments}`;
        const searchQuery = query ? `${engagementQuery} ${query}` : engagementQuery;

        return this.searchPosts(searchQuery, {
            type: 'posts',
            // Custom filters for engagement will be handled in the repository
            custom: { minLikes, minComments }
        });
    }

    /**
     * Searches for posts by media type.
     * 
     * @param mediaType - The media type to filter by
     * @param query - Additional search query
     * @returns Promise resolving to post list
     */
    async searchByMediaType(mediaType: 'image' | 'video' | 'audio' | 'text', query?: string): Promise<PostList> {
        const mediaQuery = `type:${mediaType}`;
        const searchQuery = query ? `${mediaQuery} ${query}` : mediaQuery;

        return this.searchPosts(searchQuery, {
            type: 'posts',
            // Custom filters for media type will be handled in the repository
            custom: { mediaType }
        });
    }

    /**
     * Gets search suggestions for post searches.
     * 
     * @param partialQuery - The partial search query
     * @returns Promise resolving to suggestions array
     */
    async getSuggestions(partialQuery: string): Promise<string[]> {
        // TODO: Implement with actual suggestion API in Priority 2
        console.log('PostSearchRepository: Getting post suggestions for:', partialQuery);

        // Mock suggestions based on common post patterns
        if (!partialQuery || partialQuery.length < 2) {
            return [];
        }

        const mockSuggestions = [
            `${partialQuery} tutorial`,
            `${partialQuery} guide`,
            `${partialQuery} tips`,
            `how to ${partialQuery}`,
            `${partialQuery} best practices`,
            `${partialQuery} review`,
            `${partialQuery} comparison`
        ];

        return mockSuggestions.slice(0, 3);
    }
}
