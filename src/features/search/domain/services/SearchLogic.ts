/**
 * Search Logic Service.
 * 
 * Pure domain logic for search operations.
 * Contains business rules for search functionality.
 */

import type { SearchQuery, SearchResult, SearchSuggestion } from '../entities';
import type { SearchFilters } from '../entities/SearchFilters';

/**
 * SearchLogic interface.
 * 
 * Defines the contract for search business logic.
 */
export interface ISearchLogic {
    calculateRelevanceScore(query: string, content: string): number;
    rankResults(results: any[], query: string): any[];
    shouldShowResults(query: string): boolean;
    generateSuggestions(query: string, history: SearchQuery[]): SearchSuggestion[];
    mergeSearchResults(userResults: any[], postResults: any[]): any[];
    filterResults(results: any[], filters: SearchFilters): any[];
}

/**
 * SearchLogic implementation.
 * 
 * Provides pure business logic for search operations.
 * No external dependencies, only pure functions.
 */
export class SearchLogic implements ISearchLogic {
    private readonly RELEVANCE_THRESHOLD = 0.3;
    private readonly MIN_QUERY_LENGTH = 2;
    private readonly MAX_SUGGESTIONS = 5;

    /**
     * Calculates relevance score for search results.
     * 
     * @param query - The search query
     * @param content - The content to score against
     * @returns Relevance score between 0 and 1
     */
    calculateRelevanceScore(query: string, content: string): number {
        if (!query || !content) {
            return 0;
        }

        const queryTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
        const contentLower = content.toLowerCase();

        let totalScore = 0;
        let matchedTerms = 0;

        for (const term of queryTerms) {
            if (contentLower.includes(term)) {
                matchedTerms++;
                
                // Exact match gets higher score
                if (contentLower === term) {
                    totalScore += 1.0;
                } else if (contentLower.startsWith(term)) {
                    totalScore += 0.8;
                } else if (contentLower.includes(term)) {
                    totalScore += 0.6;
                }

                // Bonus for word boundaries
                const wordBoundaryRegex = new RegExp(`\\b${term}\\b`, 'i');
                if (wordBoundaryRegex.test(contentLower)) {
                    totalScore += 0.2;
                }
            }
        }

        // Normalize score by number of query terms
        const averageScore = queryTerms.length > 0 ? totalScore / queryTerms.length : 0;
        
        // Apply length penalty for very short content
        const lengthPenalty = content.length < 10 ? 0.5 : 1.0;
        
        return Math.min(averageScore * lengthPenalty, 1.0);
    }

    /**
     * Ranks search results based on relevance and other factors.
     * 
     * @param results - Array of search results
     * @param query - The original search query
     * @returns Ranked array of results
     */
    rankResults(results: any[], query: string): any[] {
        return results
            .map(result => ({
                ...result,
                relevanceScore: this.calculateRelevanceScore(
                    query, 
                    this.extractSearchableContent(result)
                )
            }))
            .filter(result => result.relevanceScore >= this.RELEVANCE_THRESHOLD)
            .sort((a, b) => {
                // Primary sort: relevance score
                if (b.relevanceScore !== a.relevanceScore) {
                    return b.relevanceScore - a.relevanceScore;
                }
                
                // Secondary sort: popularity/engagement
                const aPopularity = this.calculatePopularityScore(a);
                const bPopularity = this.calculatePopularityScore(b);
                
                return bPopularity - aPopularity;
            });
    }

    /**
     * Determines if search results should be shown.
     * 
     * @param query - The search query
     * @returns True if results should be displayed
     */
    shouldShowResults(query: string): boolean {
        if (!query) {
            return false;
        }

        const trimmedQuery = query.trim();
        
        return trimmedQuery.length >= this.MIN_QUERY_LENGTH;
    }

    /**
     * Generates search suggestions based on query and history.
     * 
     * @param query - The current search query
     * @param history - Previous search queries
     * @returns Array of suggestions
     */
    generateSuggestions(query: string, history: SearchQuery[]): SearchSuggestion[] {
        if (!query || query.length < 2) {
            return [];
        }

        const suggestions: SearchSuggestion[] = [];
        const queryLower = query.toLowerCase();

        // Get suggestions from history
        const historySuggestions = history
            .filter(hq => hq.text.toLowerCase().includes(queryLower))
            .slice(0, 3)
            .map(hq => ({
                text: hq.text,
                type: 'query' as const,
                relevanceScore: this.calculateRelevanceScore(query, hq.text),
                resultCount: hq.resultCount
            }));

        suggestions.push(...historySuggestions);

        // Generate generic suggestions if needed
        if (suggestions.length < this.MAX_SUGGESTIONS) {
            const genericSuggestions = this.generateGenericSuggestions(query);
            suggestions.push(...genericSuggestions);
        }

        return suggestions
            .sort((a, b) => b.relevanceScore - a.relevanceScore)
            .slice(0, this.MAX_SUGGESTIONS);
    }

    /**
     * Merges user and post search results.
     * 
     * @param userResults - User search results
     * @param postResults - Post search results
     * @returns Merged and ranked results
     */
    mergeSearchResults(userResults: any[], postResults: any[]): any[] {
        const mergedResults = [
            ...userResults.map(user => ({ ...user, resultType: 'user' })),
            ...postResults.map(post => ({ ...post, resultType: 'post' }))
        ];

        // Interleave results by relevance
        const sortedResults = mergedResults.sort((a, b) => {
            // Prioritize by relevance score
            if (b.relevanceScore !== a.relevanceScore) {
                return b.relevanceScore - a.relevanceScore;
            }
            
            // Then by result type (users first)
            if (a.resultType !== b.resultType) {
                return a.resultType === 'user' ? -1 : 1;
            }
            
            // Finally by date/popularity
            return this.calculatePopularityScore(b) - this.calculatePopularityScore(a);
        });

        return sortedResults;
    }

    /**
     * Filters search results based on provided filters.
     * 
     * @param results - Array of search results
     * @param filters - Search filters to apply
     * @returns Filtered results
     */
    filterResults(results: any[], filters: SearchFilters): any[] {
        return results.filter(result => {
            // Filter by type
            if (filters.type && filters.type !== 'all') {
                if (filters.type === 'users' && result.resultType !== 'user') {
                    return false;
                }
                if (filters.type === 'posts' && result.resultType !== 'post') {
                    return false;
                }
            }

            // Filter by verification status
            if (filters.verified !== undefined && result.resultType === 'user') {
                if (result.isVerified !== filters.verified) {
                    return false;
                }
            }

            // Filter by minimum followers
            if (filters.minFollowers && result.resultType === 'user') {
                if ((result.followersCount || 0) < filters.minFollowers) {
                    return false;
                }
            }

            // Filter by date range
            if (filters.dateRange) {
                const resultDate = new Date(result.createdAt || result.timestamp);
                if (filters.dateRange.from && resultDate < new Date(filters.dateRange.from)) {
                    return false;
                }
                if (filters.dateRange.to && resultDate > new Date(filters.dateRange.to)) {
                    return false;
                }
            }

            // Filter by tags
            if (filters.tags && filters.tags.length > 0) {
                const resultTags = result.tags || [];
                const hasMatchingTag = filters.tags.some(tag => 
                    resultTags.some((resultTag: string) => 
                        resultTag.toLowerCase().includes(tag.toLowerCase())
                    )
                );
                if (!hasMatchingTag) {
                    return false;
                }
            }

            return true;
        });
    }

    /**
     * Extracts searchable content from a result object.
     * 
     * @param result - The result object
     * @returns Searchable content string
     */
    private extractSearchableContent(result: any): string {
        const parts: string[] = [];

        if (result.username) parts.push(result.username);
        if (result.displayName) parts.push(result.displayName);
        if (result.bio) parts.push(result.bio);
        if (result.content) parts.push(result.content);
        if (result.title) parts.push(result.title);
        if (result.description) parts.push(result.description);

        return parts.join(' ');
    }

    /**
     * Calculates popularity score for a result.
     * 
     * @param result - The result object
     * @returns Popularity score
     */
    private calculatePopularityScore(result: any): number {
        let score = 0;

        if (result.resultType === 'user') {
            score += (result.followersCount || 0) * 0.5;
            score += (result.postsCount || 0) * 0.3;
            score += (result.likesCount || 0) * 0.2;
        } else if (result.resultType === 'post') {
            score += (result.likesCount || 0) * 0.4;
            score += (result.commentsCount || 0) * 0.3;
            score += (result.sharesCount || 0) * 0.3;
        }

        // Recency bonus
        if (result.createdAt || result.timestamp) {
            const age = Date.now() - new Date(result.createdAt || result.timestamp).getTime();
            const daysOld = age / (1000 * 60 * 60 * 24);
            
            if (daysOld < 1) score += 10;
            else if (daysOld < 7) score += 5;
            else if (daysOld < 30) score += 2;
        }

        return score;
    }

    /**
     * Generates generic search suggestions.
     * 
     * @param query - The search query
     * @returns Array of generic suggestions
     */
    private generateGenericSuggestions(query: string): SearchSuggestion[] {
        const suggestions: SearchSuggestion[] = [];
        const queryLower = query.toLowerCase();

        const genericPatterns = [
            { pattern: 'how to', suggestion: 'how to {query}' },
            { pattern: 'best', suggestion: 'best {query}' },
            { pattern: 'tips', suggestion: '{query} tips' },
            { pattern: 'guide', suggestion: '{query} guide' },
            { pattern: 'tutorial', suggestion: '{query} tutorial' }
        ];

        for (const pattern of genericPatterns) {
            if (queryLower.includes(pattern.pattern)) {
                suggestions.push({
                    text: pattern.suggestion.replace('{query}', query),
                    type: 'query',
                    relevanceScore: 0.7
                });
            }
        }

        return suggestions;
    }
}
