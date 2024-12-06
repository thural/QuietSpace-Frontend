import { UserList } from "@/api/schemas/inferred/user";
import { useQueryUsers } from "@/services/data/useUserData";
import { useEffect, useState } from "react";
import useDebounce from "./useDebounce";


/**
 * Custom hook for user search functionality.
 *
 * @param {string} query - The search query.
 * @returns {{ userQueryList: UserList, fetchUserQuery: Function }} - The list of users and the fetch function.
 */
const useUserSearch = (query: string) => {
    const [userQueryList, setUserQueryResult] = useState<UserList>([]);
    const fetchUserQuery = useQueryUsers(setUserQueryResult);
    const [prevQuery, setPrevQuery] = useState('');

    const fetchQuery = (value: string) => {
        if (value && value !== prevQuery) {
            fetchUserQuery.mutate(value);
            setPrevQuery(value);
        } else if (!value) {
            setUserQueryResult([]);
        }
    };

    const debouncedFetchQuery = useDebounce(fetchQuery, 300);

    useEffect(() => {
        debouncedFetchQuery(query);
    }, [query]);

    return { userQueryList, fetchUserQuery };
};

export default useUserSearch