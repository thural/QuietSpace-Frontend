/**
 * Enterprise User Search Hook
 * 
 * Enterprise-grade user search functionality with advanced caching,
 * error handling, and performance optimization
 */

import { useState, useCallback } from "react";
import { useSearchServices } from './useSearchServices';
import { useDebounce } from './useDebounce';
import { UserList } from '@/features/profile/data/models/user';

/**
 * Enterprise User Search State
 */
interface EnterpriseUserSearchState {
  results: UserList;
  isLoading: boolean;
  error: string | null;
  suggestions: string[];
}

/**
 * Enterprise User Search Actions
 */
interface EnterpriseUserSearchActions {
  search: (query: string) => Promise<void>;
  clear: () => void;
  retry: () => void;
  getSuggestions: (query: string) => Promise<void>;
}

/**
 * Enterprise User Search Hook
 * 
 * Provides enterprise-grade user search functionality with:
 * - Intelligent caching through SearchDataService
 * - Business logic validation through SearchFeatureService
 * - Advanced error handling and recovery
 * - Performance optimization with debouncing
 * - Type-safe service access via dependency injection
 */
export const useEnterpriseUserSearch = (query: string): EnterpriseUserSearchState & EnterpriseUserSearchActions => {
  const { searchDataService, searchFeatureService } = useSearchServices();
  const [lastQuery, setLastQuery] = useState('');
  
  // State management
  const [state, setState] = useState<EnterpriseUserSearchState>({
    results: [],
    isLoading: false,
    error: null,
    suggestions: []
  });

  // Search users with enterprise services
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

      // Fetch users through data service (with caching)
      const users = await searchDataService.searchUsers(sanitizedQuery);
      
      setState(prev => ({
        ...prev,
        results: users,
        isLoading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to search users',
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
      console.warn('Failed to fetch user suggestions:', error);
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

export default useEnterpriseUserSearch;
