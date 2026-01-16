/**
 * Post Search Hook.
 * 
 * Hook for managing post search functionality with debouncing.
 * Provides post search results and manages search state.
 */

import { PostList } from "@/api/schemas/inferred/post";
import { useEffect, useState } from "react";
import useDebounce from "@/services/hook/search/useDebounce";
import { useSearchService } from "./useSearchDI";

/**
 * PostSearchState interface.
 * 
 * Defines the state structure for post search functionality.
 */
export interface PostSearchState {
    postQueryList: PostList;
    isLoading: boolean;
    error: Error | null;
}

/**
 * PostSearchActions interface.
 * 
 * Defines the actions available for post search functionality.
 */
export interface PostSearchActions {
    fetchPostQuery: (query: string) => void;
    clearResults: () => void;
}

/**
 * Custom hook for managing post search functionality.
 *
 * This hook allows for searching posts based on a user-provided query.
 * It debounces the search input to optimize performance and prevent 
 * excessive fetching of data.
 *
 * @param {string} query - The search query entered by the user.
 * @returns {PostSearchState & PostSearchActions} - An object containing the state and actions for post search.
 */
const usePostSearch = (query: string) => {
    const [postQueryList, setPostQueryResult] = useState<PostList>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [prevQuery, setPrevQuery] = useState('');
    const searchService = useSearchService();

    /**
     * Fetches posts based on the provided search query.
     *
     * This function checks if the current search value is different 
     * from the previous query. If it is, it triggers the fetching 
     * of posts that match the new search value. If the 
     * value is empty, it resets the results to an empty array.
     *
     * @param {string} value - The current search value.
     */
    const fetchQuery = async (value: string) => {
        // Check if the current search value is present and differs from the previous query
        if (value && value !== prevQuery) {
            setIsLoading(true);
            setError(null);
            
            try {
                // Use injected search service
                const results = await searchService.searchPosts(value);
                setPostQueryResult(results);
                
                // Update the previous query to the current one to track changes
                setPrevQuery(value);
            } catch (err) {
                setError(err as Error);
            } finally {
                setIsLoading(false);
            }
        } else if (!value) {
            // If the input is empty, reset the post query results
            setPostQueryResult([]);
            setError(null);
        }
    };

    // Debounced version of the fetchQuery function
    const debouncedFetchQuery = useDebounce(fetchQuery, 300);

    useEffect(() => {
        // Invoke the debounced fetch function whenever the query changes
        debouncedFetchQuery(query);
    }, [query]);

    const fetchPostQuery = (searchQuery: string) => {
        fetchQuery(searchQuery);
    };

    const clearResults = () => {
        setPostQueryResult([]);
        setError(null);
    };

    return { 
        postQueryList, 
        isLoading,
        error,
        fetchPostQuery,
        clearResults
    };
};

export default usePostSearch;
