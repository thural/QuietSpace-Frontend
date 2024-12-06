import { useQueryPosts } from "@/services/data/usePostData";
import { useEffect, useState } from "react";
import useDebounce from "./useDebounce";

/**
 * Custom hook for post search functionality.
 *
 * @param {string} query - The search query.
 * @returns {{ postQueryList: any[], fetchPostQuery: Function }} - The list of posts and the fetch function.
 */
const usePostSearch = (query: string) => {
    const [postQueryList, setPostQueryResult] = useState<any[]>([]);
    const fetchPostQuery = useQueryPosts(setPostQueryResult);
    const [prevQuery, setPrevQuery] = useState('');

    const fetchQuery = (value: string) => {
        if (value && value !== prevQuery) {
            fetchPostQuery.mutate(value);
            setPrevQuery(value);
        } else if (!value) {
            setPostQueryResult([]);
        }
    };

    const debouncedFetchQuery = useDebounce(fetchQuery, 300);

    useEffect(() => {
        debouncedFetchQuery(query);
    }, [query]);

    return { postQueryList, fetchPostQuery };
};

export default usePostSearch
