import { UserList } from "@/features/profile/data/models/user";
import { useQueryUsers } from "@/services/data/useUserData";
import { useEffect, useState } from "react";
import useDebounce from "@/features/search/application/hooks/useDebounce";

/**
 * Custom hook for managing user search functionality.
 *
 * This hook allows for searching users based on a user-provided query.
 * It debounces the input to optimize performance and prevent excessive
 * fetching of data.
 *
 * @param {string} query - The search query entered by the user.
 * @returns {{
 *     userQueryList: UserList,                        // The list of users that match the search query.
 *     fetchUserQuery: Function                        // Function to initiate the user fetching.
 * }} - An object containing the list of users and the fetch function.
 */
const useUserSearch = (query: string) => {
    const [userQueryList, setUserQueryResult] = useState<UserList>([]);
    const fetchUserQuery = useQueryUsers(setUserQueryResult);
    const [prevQuery, setPrevQuery] = useState('');

    /**
     * Fetches users based on the provided search query.
     *
     * This function checks if the current search value is different 
     * from the previous query. If it is, it triggers the mutation 
     * to fetch users that match the new search value. If the 
     * value is empty, it resets the results to an empty array.
     *
     * @param {string} value - The current search value.
     */
    const fetchQuery = (value: string) => {
        // Check if the current search value is present and differs from the previous query
        if (value && value !== prevQuery) {
            // Trigger the fetching of users that match the current query
            fetchUserQuery.mutate(value);
            // Update the previous query to the current one to track changes
            setPrevQuery(value);
        } else if (!value) {
            // If the input is empty, reset the user query results
            setUserQueryResult([]);
        }
    };

    // Debounced version of the fetchQuery function
    const debouncedFetchQuery = useDebounce(fetchQuery, 300);

    useEffect(() => {
        // Invoke the debounced fetch function whenever the query changes
        debouncedFetchQuery(query);
    }, [query]);

    return { userQueryList, fetchUserQuery };
};

export default useUserSearch;