/**
 * Enterprise Search Hook
 * 
 * Enterprise-grade search functionality with advanced caching,
 * error handling, and performance optimization
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { useSearchServices } from './useSearchServices';
import { useDebounce } from './useDebounce';
import { UserList } from '@/features/profile/data/models/user';
import { PostList } from '@/features/feed/data/models/post';

/**
 * Enterprise Search Hook State
 */
interface EnterpriseSearchState {
  query: string;
  focused: boolean;
  userResults: UserList;
  postResults: PostList;
  isLoading: boolean;
  error: string | null;
  suggestions: string[];
}

/**
 * Enterprise Search Hook Actions
 */
interface EnterpriseSearchActions {
  setQuery: (query: string) => void;
  setFocused: (focused: boolean) => void;
  fetchUsers: (query: string) => Promise<void>;
  fetchPosts: (query: string) => Promise<void>;
  fetchSuggestions: (query: string) => Promise<void>;
  clearResults: () => void;
  retry: () => void;
}

/**
 * Enterprise Search Hook
 * 
 * Provides enterprise-grade search functionality with:
 * - Intelligent caching through SearchDataService
 * - Business logic validation through SearchFeatureService
 * - Advanced error handling and recovery
 * - Performance optimization with debouncing
 * - Type-safe service access via dependency injection
 */
export const useEnterpriseSearch = (): EnterpriseSearchState & EnterpriseSearchActions => {
  const { searchDataService, searchFeatureService } = useSearchServices();
  const queryInputRef = useRef<HTMLInputElement>(null);
  
  // State management
  const [state, setState] = useState<EnterpriseSearchState>({
    query: '',
    focused: false,
    userResults: [],
    postResults: [],
    isLoading: false,
    error: null,
    suggestions: []
  });

  // Update query state
  const setQuery = useCallback((query: string) => {
    setState(prev => ({ ...prev, query }));
  }, []);

  // Update focus state
  const setFocused = useCallback((focused: boolean) => {
    setState(prev => ({ ...prev, focused }));
  }, []);

  // Clear all results
  const clearResults = useCallback(() => {
    setState(prev => ({
      ...prev,
      userResults: [],
      postResults: [],
      suggestions: [],
      error: null
    }));
  }, []);

  // Fetch users with enterprise services
  const fetchUsers = useCallback(async (query: string) => {
    if (!query.trim()) {
      setState(prev => ({ ...prev, userResults: [] }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Validate query through feature service
      const isValidQuery = await searchFeatureService.validateSearchQuery(query);
      if (!isValidQuery) {
        throw new Error('Invalid search query');
      }

      // Sanitize query through feature service
      const sanitizedQuery = await searchFeatureService.sanitizeSearchQuery(query);

      // Fetch users through data service (with caching)
      const users = await searchDataService.searchUsers(sanitizedQuery);
      
      setState(prev => ({
        ...prev,
        userResults: users,
        isLoading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to fetch users',
        isLoading: false
      }));
    }
  }, [searchDataService, searchFeatureService]);

  // Fetch posts with enterprise services
  const fetchPosts = useCallback(async (query: string) => {
    if (!query.trim()) {
      setState(prev => ({ ...prev, postResults: [] }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Validate and sanitize query
      const isValidQuery = await searchFeatureService.validateSearchQuery(query);
      if (!isValidQuery) {
        throw new Error('Invalid search query');
      }

      const sanitizedQuery = await searchFeatureService.sanitizeSearchQuery(query);

      // Fetch posts through data service (with caching)
      const posts = await searchDataService.searchPosts(sanitizedQuery);
      
      setState(prev => ({
        ...prev,
        postResults: posts,
        isLoading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to fetch posts',
        isLoading: false
      }));
    }
  }, [searchDataService, searchFeatureService]);

  // Fetch suggestions with enterprise services
  const fetchSuggestions = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setState(prev => ({ ...prev, suggestions: [] }));
      return;
    }

    try {
      const suggestions = await searchDataService.getSuggestions(query);
      setState(prev => ({ ...prev, suggestions }));
    } catch (error) {
      // Don't error out for suggestions, just log
      console.warn('Failed to fetch suggestions:', error);
    }
  }, [searchDataService]);

  // Retry last failed operation
  const retry = useCallback(() => {
    if (state.query) {
      fetchUsers(state.query);
      fetchPosts(state.query);
      fetchSuggestions(state.query);
    }
  }, [state.query, fetchUsers, fetchPosts, fetchSuggestions]);

  // Debounced search functions
  const debouncedFetchUsers = useDebounce(fetchUsers, 300);
  const debouncedFetchPosts = useDebounce(fetchPosts, 300);
  const debouncedFetchSuggestions = useDebounce(fetchSuggestions, 200);

  // Handle query changes
  useEffect(() => {
    if (state.query) {
      debouncedFetchUsers(state.query);
      debouncedFetchPosts(state.query);
      debouncedFetchSuggestions(state.query);
    } else {
      clearResults();
    }
  }, [state.query, debouncedFetchUsers, debouncedFetchPosts, debouncedFetchSuggestions, clearResults]);

  // Handle focus changes
  useEffect(() => {
    if (!state.userResults.length && !state.postResults.length) {
      setFocused(false);
    }
  }, [state.userResults, state.postResults, setFocused]);

  // Input event handlers
  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const value = event.target.value.trim();
    setQuery(value);
    setFocused(!!value);
  }, [setQuery, setFocused]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setFocused(false);
    }

    if (queryInputRef.current?.value?.length) {
      if (event.key === 'Enter') {
        const value = queryInputRef.current.value.trim();
        // Trigger immediate search on Enter
        fetchUsers(value);
        fetchPosts(value);
      }
    }
  }, [fetchUsers, fetchPosts]);

  const handleInputFocus = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.target.value.length) {
      setFocused(true);
    }
  }, [setFocused]);

  const handleInputBlur = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    // Optional: Handle blur events
    console.log("Search input blurred:", event.target.value);
  }, []);

  return {
    // State
    query: state.query,
    focused: state.focused,
    userResults: state.userResults,
    postResults: state.postResults,
    isLoading: state.isLoading,
    error: state.error,
    suggestions: state.suggestions,

    // Actions
    setQuery,
    setFocused,
    fetchUsers,
    fetchPosts,
    fetchSuggestions,
    clearResults,
    retry,

    // Ref and event handlers
    queryInputRef,
    handleInputChange,
    handleKeyDown,
    handleInputFocus,
    handleInputBlur
  };
};

export default useEnterpriseSearch;
