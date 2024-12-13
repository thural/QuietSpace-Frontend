import { useEffect, useRef, useState, useCallback } from "react";
import useUserSearch from "./useUserSearch";
import usePostSearch from "./usePostSearch";

/**
 * Custom hook to manage search functionality for users and posts.
 * 
 * @returns {Object} - An object containing search-related data and methods.
 * @returns {React.RefObject<HTMLInputElement>} queryInputRef - Reference to the input element for queries.
 * @returns {boolean} focused - Indicates if the input is currently focused.
 * @returns {Array} userQueryList - The list of user query results.
 * @returns {Array} postQueryList - The list of post query results.
 * @returns {function} handleInputChange - Function to handle changes in the user query input.
 * @returns {function} handleKeyDown - Function to handle key down events in the input.
 * @returns {function} handleInputFocus - Function to handle focus events on the input.
 * @returns {function} handleInputBlur - Function to handle blur events on the input.
 * @returns {function} setUserQuery - Function to set the user query state.
 * @returns {function} fetchUserQuery - Function to fetch user query results.
 * @returns {function} fetchPostQuery - Function to fetch post query results.
 */

const useSearch = () => {
    const queryInputRef = useRef<HTMLInputElement>(null);
    const [focused, setFocused] = useState(false);
    const [userQuery, setUserQuery] = useState('');
    const [postQuery, setPostQuery] = useState('');

    const { userQueryList, fetchUserQuery } = useUserSearch(userQuery);
    const { postQueryList, fetchPostQuery } = usePostSearch(postQuery);

    /**
     * Handles changes in the user query input.
     * 
     * @param {React.ChangeEvent<HTMLInputElement>} event - The change event from the input.
     */
    const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        event.stopPropagation();
        const value = event.target.value.trim();

        setUserQuery(value);
        setFocused(!!value);
    }, []);

    /**
     * Handles key down events in the input.
     * 
     * @param {React.KeyboardEvent<HTMLInputElement>} event - The key down event from the input.
     */
    const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Escape') setFocused(false);

        if (queryInputRef.current === null || !queryInputRef.current.value.length) return;

        if (event.key === 'Enter') {
            const value = queryInputRef.current.value.trim();
            setPostQuery(value);
        }
    }, []);

    useEffect(() => {
        if (!userQueryList.length) setFocused(false);
    }, [userQueryList]);

    /**
     * Handles focus events on the input.
     * 
     * @param {React.FocusEvent<HTMLInputElement>} event - The focus event from the input.
     */
    const handleInputFocus = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.target.value.length) setFocused(true);
    }, []);

    /**
     * Handles blur events on the input.
     * 
     * @param {React.FocusEvent<HTMLInputElement>} event - The blur event from the input.
     */
    const handleInputBlur = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
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