/**
 * Search Query Entity.
 * 
 * Represents a search query with its metadata and filters.
 */

import type { SearchFilters } from './SearchFilters';

/**
 * SearchQuery interface.
 * 
 * Represents a structured search query with all necessary metadata.
 */
export interface SearchQuery {
    /** Unique identifier for the query */
    id: string;
    
    /** Original query text as entered by user */
    text: string;
    
    /** Optimized query text for search */
    optimizedText: string;
    
    /** Search filters applied to the query */
    filters: SearchFilters;
    
    /** Timestamp when the query was created */
    timestamp: string;
    
    /** Whether the query is valid for searching */
    isValid: boolean;
    
    /** Number of results returned (populated after search) */
    resultCount?: number;
    
    /** Search duration in milliseconds (populated after search) */
    searchDuration?: number;
    
    /** Whether the query was successful */
    success?: boolean;
    
    /** Error message if search failed */
    error?: string;
}

/**
 * SearchQueryHistory interface.
 * 
 * Represents the search history for a user.
 */
export interface SearchQueryHistory {
    /** List of previous search queries */
    queries: SearchQuery[];
    
    /** Maximum number of queries to keep in history */
    maxHistorySize: number;
    
    /** Whether to persist history across sessions */
    persistHistory: boolean;
}

/**
 * SearchQueryStatus enum.
 * 
 * Represents the status of a search query.
 */
export enum SearchQueryStatus {
    IDLE = 'idle',
    PENDING = 'pending',
    SUCCESS = 'success',
    ERROR = 'error',
    CANCELLED = 'cancelled'
}

/**
 * SearchQueryType enum.
 * 
 * Represents the type of search query.
 */
export enum SearchQueryType {
    USER = 'user',
    POST = 'post',
    ALL = 'all',
    SUGGESTION = 'suggestion'
}
