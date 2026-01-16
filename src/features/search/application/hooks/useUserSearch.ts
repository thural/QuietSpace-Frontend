/**
 * User Search Hook.
 * 
 * Hook for managing user search functionality with debouncing.
 * Provides user search results and manages search state.
 */

import { UserList } from "@/api/schemas/inferred/user";
import { useEffect, useState } from "react";
import useDebounce from "@/services/hook/search/useDebounce";

/**
 * UserSearchState interface.
 * 
 * Defines the state structure for user search functionality.
 */
export interface UserSearchState {
    userQueryList: UserList;
    isLoading: boolean;
    error: Error | null;
}

/**
 * UserSearchActions interface.
 * 
 * Defines the actions available for user search functionality.
 */
export interface UserSearchActions {
    fetchUserQuery: (query: string) => void;
    clearResults: () => void;
}

/**
 * Custom hook for managing user search functionality.
 *
 * This hook allows for searching users based on a user-provided query.
 * It debounces the input to optimize performance and prevent excessive
 * fetching of data.
 *
 * @param {string} query - The search query entered by the user.
 * @returns {UserSearchState & UserSearchActions} - An object containing the state and actions for user search.
 */
const useUserSearch = (query: string) => {
    const [userQueryList, setUserQueryResult] = useState<UserList>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [prevQuery, setPrevQuery] = useState('');

    /**
     * Fetches users based on the provided search query.
     *
     * This function checks if the current search value is different 
     * from the previous query. If it is, it triggers the fetching 
     * of users that match the new search value. If the 
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
                // TODO: Replace with actual API call through repository
                // For now, keeping the existing mutation approach
                // This will be updated in Priority 2 with DI setup
                console.log('Fetching users for query:', value);
                // fetchUserQuery.mutate(value);
                
                // Update the previous query to the current one to track changes
                setPrevQuery(value);
            } catch (err) {
                setError(err as Error);
            } finally {
                setIsLoading(false);
            }
        } else if (!value) {
            // If the input is empty, reset the user query results
            setUserQueryResult([]);
            setError(null);
        }
    };

    // Debounced version of the fetchQuery function
    const debouncedFetchQuery = useDebounce(fetchQuery, 300);

    useEffect(() => {
        // Invoke the debounced fetch function whenever the query changes
        debouncedFetchQuery(query);
    }, [query]);

    const fetchUserQuery = (searchQuery: string) => {
        fetchQuery(searchQuery);
    };

    const clearResults = () => {
        setUserQueryResult([]);
        setError(null);
    };

    return { 
        userQueryList, 
        isLoading,
        error,
        fetchUserQuery,
        clearResults
    };
};

export default useUserSearch;
