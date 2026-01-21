/**
 * Search Result Entity.
 * 
 * Represents search results with metadata and pagination.
 */

import type { UserList } from "@/features/profile/data/models/user";
import type { PostList } from "@/features/feed/data/models/post";
import type { SearchQuery } from './SearchQuery';

/**
 * SearchResult interface.
 * 
 * Represents the result of a search operation.
 */
export interface SearchResult {
    /** The original search query */
    query: string;

    /** List of user results */
    users: UserList;

    /** List of post results */
    posts: PostList;

    /** Timestamp when the search was performed */
    timestamp: string;

    /** Total number of results across all types */
    totalResults: number;

    /** Search duration in milliseconds */
    searchDuration: number;

    /** Whether there are more results available */
    hasMore: boolean;

    /** Next page token for pagination */
    nextPageToken?: string;

    /** Search result metadata */
    metadata: SearchResultMetadata;
}

/**
 * SearchResultMetadata interface.
 * 
 * Contains metadata about the search results.
 */
export interface SearchResultMetadata {
    /** Search algorithm used */
    algorithm: 'fulltext' | 'fuzzy' | 'semantic';

    /** Relevance score threshold */
    relevanceThreshold: number;

    /** Filters applied during search */
    appliedFilters: string[];

    /** Search result ranking method */
    rankingMethod: 'relevance' | 'date' | 'popularity';

    /** Whether results were cached */
    fromCache: boolean;

    /** Cache expiry time */
    cacheExpiry?: string;
}

/**
 * SearchSuggestion interface.
 * 
 * Represents a search suggestion.
 */
export interface SearchSuggestion {
    /** Suggestion text */
    text: string;

    /** Suggestion type */
    type: 'query' | 'user' | 'post' | 'tag';

    /** Relevance score */
    relevanceScore: number;

    /** Number of results for this suggestion */
    resultCount?: number;

    /** Highlighted text for display */
    highlightedText?: string;
}

/**
 * SearchAggregation interface.
 * 
 * Represents aggregated search statistics.
 */
export interface SearchAggregation {
    /** Total number of searches performed */
    totalSearches: number;

    /** Most popular search queries */
    popularQueries: Array<{
        query: string;
        count: number;
        lastUsed: string;
    }>;

    /** Search trends over time */
    trends: Array<{
        date: string;
        searchCount: number;
        uniqueQueries: number;
    }>;

    /** Search success rate */
    successRate: number;

    /** Average search duration */
    averageSearchDuration: number;
}

/**
 * SearchFacet interface.
 * 
 * Represents a search facet for filtering.
 */
export interface SearchFacet {
    /** Facet identifier */
    id: string;

    /** Facet display name */
    name: string;

    /** Facet type */
    type: 'checkbox' | 'radio' | 'range' | 'select';

    /** Available facet options */
    options: Array<{
        value: string;
        label: string;
        count: number;
        selected?: boolean;
    }>;

    /** Whether facet is expanded */
    expanded?: boolean;
}
