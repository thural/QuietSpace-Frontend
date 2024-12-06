import { useEffect, useRef, useState, useCallback } from "react";
import useUserSearch from "./useUserSearch";
import usePostSearch from "./usePostSearch";

/**
 * Custom hook for search functionality.
 *
 * @returns {Object} - An object containing search-related states and handlers.
 */
const useSearch = () => {
    const queryInputRef = useRef<HTMLInputElement>(null);
    const [focused, setFocused] = useState(false);
    const [userQuery, setUserQuery] = useState('');
    const [postQuery, setPostQuery] = useState('');

    const { userQueryList, fetchUserQuery } = useUserSearch(userQuery);
    const { postQueryList, fetchPostQuery } = usePostSearch(postQuery);

    useEffect(() => {
        if (!userQueryList.length) setFocused(false);
    }, [userQueryList]);

    /**
     * Handle input change event.
     *
     * @param {React.ChangeEvent<HTMLInputElement>} event - The input change event.
     */
    const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        event.stopPropagation();
        const value = event.target.value.trim();
        setUserQuery(value);
        setFocused(!!value);
    }, []);

    /**
     * Handle key down event in input.
     *
     * @param {React.KeyboardEvent<HTMLInputElement>} event - The key down event.
     */
    const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Escape') setFocused(false);
        if (queryInputRef.current === null || !queryInputRef.current.value.length) return;
        if (event.key === 'Enter') {
            const value = queryInputRef.current.value.trim();
            setPostQuery(value);
        }
    }, []);

    /**
     * Handle input focus event.
     *
     * @param {React.FocusEvent<HTMLInputElement>} event - The input focus event.
     */
    const handleInputFocus = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.target.value.length) setFocused(true);
    }, []);

    /**
     * Handle input blur event.
     *
     * @param {React.FocusEvent<HTMLInputElement>} event - The input blur event.
     */
    const handleInputBlur = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
        // TODO: implement logic to handle input blur events
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
