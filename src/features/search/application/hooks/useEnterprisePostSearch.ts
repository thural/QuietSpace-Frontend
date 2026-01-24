/**
 * Enterprise Post Search Hook
 * 
 * Enterprise-grade post search functionality with advanced caching,
 * error handling, and performance optimization
 */

import { useState, useCallback } from "react";
import { useSearchServices } from './useSearchServices';
import { useDebounce } from './useDebounce';
import { PostList } from '@/features/feed/data/models/post';

/**
 * Enterprise Post Search State
 */
interface EnterprisePostSearchState {
  results: PostList;
  isLoading: boolean;
  error: string | null;
  suggestions: string[];
}

/**
 * Enterprise Post Search Actions
 */
interface EnterprisePostSearchActions {
  search: (query: string) => Promise<void>;
  clear: () => void;
  retry: () => void;
  getSuggestions: (query: string) => Promise<void>;
}

/**
 * Enterprise Post Search Hook
 * 
 * Provides enterprise-grade post search functionality with:
 * - Intelligent caching through SearchDataService
 * - Business logic validation through SearchFeatureService
 * - Advanced error handling and recovery
 * - Performance optimization with debouncing
 * - Type-safe service access via dependency injection
 */
export const useEnterprisePostSearch = (query: string): EnterprisePostSearchState & EnterprisePostSearchActions => {
  const { searchDataService, searchFeatureService } = useSearchServices();
  const [lastQuery, setLastQuery] = useState('');
  
  // State management
  const [state, setState] = useState<EnterprisePostSearchState>({
    results: [],
    isLoading: false,
    error: null,
    suggestions: []
  });

  // Search posts with enterprise services
  const search = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setState(prev => ({ ...prev, results: [] }));
      return;
    }

    if (searchQuery === lastQuery) {
      return; // Avoid duplicate searches
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    setLastQuery(searchQuery);

    try {
      // Validate query through feature service
      const isValidQuery = await searchFeatureService.validateSearchQuery(searchQuery);
      if (!isValidQuery) {
        throw new Error('Invalid search query');
      }

      // Sanitize query through feature service
      const sanitizedQuery = await searchFeatureService.sanitizeSearchQuery(searchQuery);

      // Fetch posts through data service (with caching)
      const posts = await searchDataService.searchPosts(sanitizedQuery);
      
      setState(prev => ({
        ...prev,
        results: posts,
        isLoading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to search posts',
        isLoading: false
      }));
    }
  }, [searchDataService, searchFeatureService, lastQuery]);

  // Get suggestions with enterprise services
  const getSuggestions = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setState(prev => ({ ...prev, suggestions: [] }));
      return;
    }

    try {
      const suggestions = await searchDataService.getSuggestions(searchQuery);
      setState(prev => ({ ...prev, suggestions }));
    } catch (error) {
      // Don't error out for suggestions, just log
      console.warn('Failed to fetch post suggestions:', error);
    }
  }, [searchDataService]);

  // Clear results
  const clear = useCallback(() => {
    setState(prev => ({
      ...prev,
      results: [],
      suggestions: [],
      error: null
    }));
    setLastQuery('');
  }, []);

  // Retry last search
  const retry = useCallback(() => {
    if (lastQuery) {
      search(lastQuery);
    }
  }, [lastQuery, search]);

  // Debounced search function
  const debouncedSearch = useDebounce(search, 300);
  const debouncedGetSuggestions = useDebounce(getSuggestions, 200);

  // Auto-search when query changes
  useState(() => {
    if (query) {
      debouncedSearch(query);
      debouncedGetSuggestions(query);
    } else {
      clear();
    }
  });

  return {
    // State
    results: state.results,
    isLoading: state.isLoading,
    error: state.error,
    suggestions: state.suggestions,

    // Actions
    search,
    clear,
    retry,
    getSuggestions
  };
};

export default useEnterprisePostSearch;
