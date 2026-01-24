/**
 * Search Data Mappers.
 * 
 * Data transformation utilities for search functionality.
 * Maps between different data formats and structures.
 */

import type { SearchQuery, SearchResult, SearchFilters } from "@search/domain/entities";

/**
 * SearchMappers class.
 * 
 * Provides static methods for mapping between different data formats.
 * Handles transformation of API responses to domain entities and vice versa.
 */
export class SearchMappers {
    /**
     * Maps API user response to domain entity.
     * 
     * @param apiUser - User from API response
     * @returns Mapped user entity
     */
    static mapApiUserToDomain(apiUser: any): any {
        return {
            id: apiUser.id,
            username: apiUser.username,
            email: apiUser.email,
            bio: apiUser.bio,
            photo: apiUser.photo,
            isVerified: apiUser.isVerified || false,
            followersCount: apiUser.followersCount || 0,
            postsCount: apiUser.postsCount || 0,
            createdAt: apiUser.createdAt,
            updatedAt: apiUser.updatedAt,
            // Additional fields for search
            resultType: 'user',
            relevanceScore: 0, // Will be calculated by search logic
            searchableContent: this.extractSearchableContent(apiUser)
        };
    }

    /**
     * Maps API post response to domain entity.
     * 
     * @param apiPost - Post from API response
     * @returns Mapped post entity
     */
    static mapApiPostToDomain(apiPost: any): any {
        return {
            id: apiPost.id,
            content: apiPost.content,
            title: apiPost.title,
            likesCount: apiPost.likesCount || 0,
            commentsCount: apiPost.commentsCount || 0,
            sharesCount: apiPost.sharesCount || 0,
            createdAt: apiPost.createdAt,
            authorId: apiPost.authorId,
            tags: apiPost.tags || [],
            // Additional fields for search
            resultType: 'post',
            relevanceScore: 0, // Will be calculated by search logic
            searchableContent: this.extractSearchableContent(apiPost)
        };
    }

    /**
     * Maps search filters to API parameters.
     * 
     * @param filters - Domain search filters
     * @returns API parameters object
     */
    static mapFiltersToApiParams(filters: SearchFilters): Record<string, any> {
        const params: Record<string, any> = {};

        if (filters.type && filters.type !== 'all') {
            params.type = filters.type;
        }

        if (filters.user) {
            params.user = filters.user;
        }

        if (filters.date) {
            params.date = filters.date;
        }

        if (filters.dateRange) {
            if (filters.dateRange.from) {
                params.dateFrom = filters.dateRange.from;
            }
            if (filters.dateRange.to) {
                params.dateTo = filters.dateRange.to;
            }
        }

        if (filters.tags && filters.tags.length > 0) {
            params.tags = filters.tags.join(',');
        }

        if (filters.rating) {
            params.rating = filters.rating;
        }

        if (filters.language) {
            params.language = filters.language;
        }

        if (filters.location) {
            if (filters.location.country) {
                params.country = filters.location.country;
            }
            if (filters.location.city) {
                params.city = filters.location.city;
            }
            if (filters.location.radius) {
                params.radius = filters.location.radius;
            }
        }

        if (filters.verified !== undefined) {
            params.verified = filters.verified;
        }

        if (filters.minFollowers) {
            params.minFollowers = filters.minFollowers;
        }

        if (filters.category) {
            params.category = filters.category;
        }

        if (filters.sortBy) {
            params.sortBy = filters.sortBy;
        }

        if (filters.sortOrder) {
            params.sortOrder = filters.sortOrder;
        }

        if (filters.pagination) {
            if (filters.pagination.page) {
                params.page = filters.pagination.page;
            }
            if (filters.pagination.limit) {
                params.limit = filters.pagination.limit;
            }
            if (filters.pagination.offset) {
                params.offset = filters.pagination.offset;
            }
        }

        return params;
    }

    /**
     * Maps API response to search result.
     * 
     * @param apiResponse - Raw API response
     * @param query - Original search query
     * @returns Mapped search result
     */
    static mapApiResponseToSearchResult(apiResponse: any, query: string): SearchResult {
        const users = (apiResponse.users || []).map((user: any) => 
            this.mapApiUserToDomain(user)
        );

        const posts = (apiResponse.posts || []).map((post: any) => 
            this.mapApiPostToDomain(post)
        );

        return {
            query,
            users,
            posts,
            timestamp: new Date().toISOString(),
            totalResults: (users.length + posts.length),
            searchDuration: apiResponse.searchDuration || 0,
            hasMore: apiResponse.hasMore || false,
            nextPageToken: apiResponse.nextPageToken,
            metadata: {
                algorithm: apiResponse.algorithm || 'fulltext',
                relevanceThreshold: apiResponse.relevanceThreshold || 0.3,
                appliedFilters: apiResponse.appliedFilters || [],
                rankingMethod: apiResponse.rankingMethod || 'relevance',
                fromCache: apiResponse.fromCache || false,
                cacheExpiry: apiResponse.cacheExpiry
            }
        };
    }

    /**
     * Maps domain search query to API request.
     * 
     * @param searchQuery - Domain search query
     * @returns API request object
     */
    static mapSearchQueryToApiRequest(searchQuery: SearchQuery): Record<string, any> {
        return {
            query: searchQuery.optimizedText,
            filters: this.mapFiltersToApiParams(searchQuery.filters),
            options: {
                algorithm: 'fulltext',
                includeMetadata: true,
                enableHighlighting: true
            }
        };
    }

    /**
     * Maps search history to storage format.
     * 
     * @param history - Search history array
     * @returns Storage-ready format
     */
    static mapSearchHistoryToStorage(history: SearchQuery[]): string {
        return JSON.stringify(history.map(query => ({
            id: query.id,
            text: query.text,
            timestamp: query.timestamp,
            resultCount: query.resultCount
        })));
    }

    /**
     * Maps storage format to search history.
     * 
     * @param storageData - Storage data string
     * @returns Search history array
     */
    static mapStorageToSearchHistory(storageData: string): SearchQuery[] {
        try {
            const parsed = JSON.parse(storageData);
            return parsed.map((item: any) => ({
                id: item.id,
                text: item.text,
                optimizedText: item.text.toLowerCase(),
                filters: {},
                timestamp: item.timestamp,
                isValid: true,
                resultCount: item.resultCount
            }));
        } catch {
            return [];
        }
    }

    /**
     * Maps trending searches to display format.
     * 
     * @param trending - Raw trending data
     * @returns Display-ready trending searches
     */
    static mapTrendingToDisplay(trending: SearchQuery[]): Array<{
        query: string;
        count: number;
        trend: 'up' | 'down' | 'stable';
    }> {
        return trending.map(item => ({
            query: item.text,
            count: item.resultCount || 0,
            trend: 'stable' // TODO: Calculate actual trend based on historical data
        }));
    }

    /**
     * Extracts searchable content from an entity.
     * 
     * @param entity - The entity to extract content from
     * @returns Searchable content string
     */
    private static extractSearchableContent(entity: any): string {
        const parts: string[] = [];

        // User fields
        if (entity.username) parts.push(entity.username);
        if (entity.displayName) parts.push(entity.displayName);
        if (entity.bio) parts.push(entity.bio);

        // Post fields
        if (entity.title) parts.push(entity.title);
        if (entity.content) parts.push(entity.content);
        if (entity.description) parts.push(entity.description);

        // Common fields
        if (entity.tags && Array.isArray(entity.tags)) {
            parts.push(...entity.tags);
        }

        return parts.join(' ').toLowerCase();
    }

    /**
     * Normalizes search query for consistent processing.
     * 
     * @param query - Raw search query
     * @returns Normalized query
     */
    static normalizeQuery(query: string): string {
        return query
            .trim()
            .toLowerCase()
            .replace(/[^\w\s]/g, ' ') // Replace special chars with spaces
            .replace(/\s+/g, ' ') // Normalize whitespace
            .trim();
    }

    /**
     * Validates and maps search filters.
     * 
     * @param rawFilters - Raw filter input
     * @returns Validated and mapped filters
     */
    static validateAndMapFilters(rawFilters: any): SearchFilters {
        const filters: SearchFilters = {};

        // Type filter
        if (rawFilters.type && ['users', 'posts', 'all'].includes(rawFilters.type)) {
            filters.type = rawFilters.type;
        }

        // Date range filter
        if (rawFilters.dateFrom || rawFilters.dateTo) {
            filters.dateRange = {};
            if (rawFilters.dateFrom) filters.dateRange.from = rawFilters.dateFrom;
            if (rawFilters.dateTo) filters.dateRange.to = rawFilters.dateTo;
        }

        // Tags filter
        if (rawFilters.tags) {
            const tags = Array.isArray(rawFilters.tags) 
                ? rawFilters.tags 
                : rawFilters.tags.split(',').map((tag: string) => tag.trim());
            
            filters.tags = tags.filter((tag: string) => tag.length > 0);
        }

        // Verification filter
        if (typeof rawFilters.verified === 'boolean') {
            filters.verified = rawFilters.verified;
        }

        // Minimum followers filter
        if (typeof rawFilters.minFollowers === 'number' && rawFilters.minFollowers > 0) {
            filters.minFollowers = rawFilters.minFollowers;
        }

        // Sort filters
        if (rawFilters.sortBy && ['relevance', 'date', 'popularity'].includes(rawFilters.sortBy)) {
            filters.sortBy = rawFilters.sortBy;
        }

        if (rawFilters.sortOrder && ['asc', 'desc'].includes(rawFilters.sortOrder)) {
            filters.sortOrder = rawFilters.sortOrder;
        }

        // Pagination
        if (rawFilters.page || rawFilters.limit) {
            filters.pagination = {};
            if (typeof rawFilters.page === 'number' && rawFilters.page > 0) {
                filters.pagination.page = rawFilters.page;
            }
            if (typeof rawFilters.limit === 'number' && rawFilters.limit > 0) {
                filters.pagination.limit = Math.min(rawFilters.limit, 100);
            }
        }

        return filters;
    }
}
