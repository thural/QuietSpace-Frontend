/**
 * Search Query Service.
 * 
 * Service for managing search queries, validation,
 * and query optimization.
 */

import type { SearchQuery, SearchFilters } from "../../domain/entities";

/**
 * SearchQueryService interface.
 * 
 * Defines the contract for search query management.
 */
export interface ISearchQueryService {
    validateQuery(query: string): boolean;
    sanitizeQuery(query: string): string;
    optimizeQuery(query: string): string;
    buildSearchQuery(text: string, filters?: SearchFilters): SearchQuery;
    extractFilters(query: string): SearchFilters;
    getSuggestions(query: string): Promise<string[]>;
}

/**
 * SearchQueryService implementation.
 * 
 * Provides search query management functionality including
 * validation, sanitization, and optimization.
 */
export class SearchQueryService implements ISearchQueryService {
    private readonly MIN_QUERY_LENGTH = 1;
    private readonly MAX_QUERY_LENGTH = 100;
    private readonly FORBIDDEN_WORDS = ['admin', 'root', 'system'];

    /**
     * Validates a search query.
     * 
     * @param query - The query to validate
     * @returns True if the query is valid
     */
    validateQuery(query: string): boolean {
        if (!query || typeof query !== 'string') {
            return false;
        }

        const trimmedQuery = query.trim();
        
        if (trimmedQuery.length < this.MIN_QUERY_LENGTH) {
            return false;
        }

        if (trimmedQuery.length > this.MAX_QUERY_LENGTH) {
            return false;
        }

        const lowerQuery = trimmedQuery.toLowerCase();
        if (this.FORBIDDEN_WORDS.some(word => lowerQuery.includes(word))) {
            return false;
        }

        return true;
    }

    /**
     * Sanitizes a search query.
     * 
     * @param query - The query to sanitize
     * @returns Sanitized query string
     */
    sanitizeQuery(query: string): string {
        if (!query) {
            return '';
        }

        return query
            .trim()
            .replace(/[<>]/g, '') // Remove potential HTML tags
            .replace(/['"]/g, '') // Remove quotes
            .replace(/\s+/g, ' ') // Normalize whitespace
            .slice(0, this.MAX_QUERY_LENGTH);
    }

    /**
     * Optimizes a search query for better results.
     * 
     * @param query - The query to optimize
     * @returns Optimized query string
     */
    optimizeQuery(query: string): string {
        if (!query) {
            return '';
        }

        return this.sanitizeQuery(query)
            .toLowerCase()
            .trim();
    }

    /**
     * Builds a structured search query from text and filters.
     * 
     * @param text - The search text
     * @param filters - Optional search filters
     * @returns Structured search query
     */
    buildSearchQuery(text: string, filters?: SearchFilters): SearchQuery {
        return {
            id: this.generateQueryId(),
            text: this.sanitizeQuery(text),
            optimizedText: this.optimizeQuery(text),
            filters: filters || {},
            timestamp: new Date().toISOString(),
            isValid: this.validateQuery(text)
        };
    }

    /**
     * Extracts filters from a raw query string.
     * 
     * @param query - The raw query string
     * @returns Extracted search filters
     */
    extractFilters(query: string): SearchFilters {
        const filters: SearchFilters = {};

        // Extract user filter (e.g., "user:username")
        const userMatch = query.match(/user:(\w+)/i);
        if (userMatch) {
            filters.user = userMatch[1];
        }

        // Extract date filter (e.g., "date:2024-01-01")
        const dateMatch = query.match(/date:(\d{4}-\d{2}-\d{2})/i);
        if (dateMatch) {
            filters.date = dateMatch[1];
        }

        // Extract type filter (e.g., "type:posts" or "type:users")
        const typeMatch = query.match(/type:(\w+)/i);
        if (typeMatch) {
            filters.type = typeMatch[1] as 'posts' | 'users' | 'all';
        }

        return filters;
    }

    /**
     * Gets search suggestions based on partial query.
     * 
     * @param query - The partial query
     * @returns Promise resolving to suggestions array
     */
    async getSuggestions(query: string): Promise<string[]> {
        // TODO: Implement with actual suggestion service in Priority 2
        console.log('SearchQueryService: Getting suggestions for:', query);
        
        // Mock suggestions for now
        if (!query || query.length < 2) {
            return [];
        }

        const mockSuggestions = [
            `${query} tutorial`,
            `${query} guide`,
            `${query} tips`,
            `how to ${query}`,
            `${query} best practices`
        ];

        return mockSuggestions.slice(0, 3);
    }

    /**
     * Generates a unique query ID.
     * 
     * @returns Unique query identifier
     */
    private generateQueryId(): string {
        return `query_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}
