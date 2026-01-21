import { useQueryPosts } from "@/services/data/usePostData";
import { useEffect, useState } from "react";
import useDebounce from "@/features/search/application/hooks/useDebounce";

/**
 * Custom hook for managing post search functionality.
 *
 * This hook allows for searching posts based on a user-provided query.
 * It debounces the search input to optimize performance and prevent 
 * excessive fetching of data.
 *
 * @param {string} query - The search query entered by the user.
 * @returns {{
 *     postQueryList: any[],                           // The list of posts that match the search query.
 *     fetchPostQuery: Function                         // Function to initiate the post fetching.
 * }} - An object containing the list of posts and the fetch function.
 */
const usePostSearch = (query: string) => {
    const [postQueryList, setPostQueryResult] = useState<any[]>([]);
    const fetchPostQuery = useQueryPosts(setPostQueryResult);
    const [prevQuery, setPrevQuery] = useState('');

    /**
     * Fetches posts based on the provided search query.
     *
     * This function checks if the current search value is different 
     * from the previous query. If it is, it triggers the mutation 
     * to fetch posts that match the new search value. If the 
     * value is empty, it resets the results to an empty array.
     *
     * @param {string} value - The current search value.
     */
    const fetchQuery = (value: string) => {
        // Check if the current search value is present and differs from the previous query
        if (value && value !== prevQuery) {
            // Trigger the fetching of posts that match the current query
            fetchPostQuery.mutate(value);
            // Update the previous query to the current one to track changes
            setPrevQuery(value);
        } else if (!value) {
            // If the input is empty, reset the post query results
            setPostQueryResult([]);
        }
    };

    // Debounced version of the fetchQuery function
    const debouncedFetchQuery = useDebounce(fetchQuery, 300);

    useEffect(() => {
        // Invoke the debounced fetch function whenever the query changes
        debouncedFetchQuery(query);
    }, [query]);

    return { postQueryList, fetchPostQuery };
};

export default usePostSearch;