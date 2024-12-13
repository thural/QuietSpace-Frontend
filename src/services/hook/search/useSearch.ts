import { useEffect, useRef, useState, useCallback } from "react";
import useUserSearch from "./useUserSearch";
import usePostSearch from "./usePostSearch";

const useSearch = () => {
    const queryInputRef = useRef<HTMLInputElement>(null);
    const [focused, setFocused] = useState(false);
    const [userQuery, setUserQuery] = useState('');
    const [postQuery, setPostQuery] = useState('');

    // Use the existing hooks with their built-in debouncing
    const { userQueryList, fetchUserQuery } = useUserSearch(userQuery);
    const { postQueryList, fetchPostQuery } = usePostSearch(postQuery);

    // Memoize the input change handler to maintain original functionality
    const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        event.stopPropagation();
        const value = event.target.value.trim();

        // Update query and focus state
        setUserQuery(value);
        setFocused(!!value);
    }, []);

    // Restore the original key down handler for post searches
    const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Escape') setFocused(false);

        if (queryInputRef.current === null || !queryInputRef.current.value.length) return;

        if (event.key === 'Enter') {
            const value = queryInputRef.current.value.trim();
            setPostQuery(value);
        }
    }, []);

    // Use effect to manage focus based on query results
    useEffect(() => {
        if (!userQueryList.length) setFocused(false);
    }, [userQueryList]);

    // Memoize focus and blur handlers
    const handleInputFocus = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.target.value.length) setFocused(true);
    }, []);

    const handleInputBlur = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
        // Placeholder for potential blur logic
        console.log("(!) unhandled input blur event", event.target.value);
    }, []);

    return {
        queryInputRef,
        focused,
        userQueryList,
        postQueryList,
        handleInputChange,
        handleKeyDown,
        handleInputFocus,
        handleInputBlur,
        setUserQuery,
        fetchUserQuery,
        fetchPostQuery
    };
};

export default useSearch;