/**
 * Search Hook.
 * 
 * Main hook for managing search functionality across users and posts.
 * Coordinates between user and post search hooks and provides unified search interface.
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { useSearchService, useQueryService } from "./useSearchDI";

/**
 * SearchState interface.
 * 
 * Defines the state structure for search functionality.
 */
export interface SearchState {
    queryInputRef: React.RefObject<HTMLInputElement>;
    focused: boolean;
    userQuery: string;
    postQuery: string;
}

/**
 * SearchActions interface.
 * 
 * Defines the actions available for search functionality.
 */
export interface SearchActions {
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    handleInputFocus: (event: React.FocusEvent<HTMLInputElement>) => void;
    handleInputBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
    setUserQuery: (query: string) => void;
    setPostQuery: (query: string) => void;
    fetchUserQuery: (query: string) => void;
    fetchPostQuery: (query: string) => void;
}

/**
 * Custom hook to manage search functionality for users and posts.
 * 
 * @returns {SearchState & SearchActions} - An object containing search-related state and methods.
 */
const useSearch = () => {
    const queryInputRef = useRef<HTMLInputElement>(null);
    const [focused, setFocused] = useState(false);
    const [userQuery, setUserQuery] = useState('');
    const [postQuery, setPostQuery] = useState('');

    const searchService = useSearchService();
    const queryService = useQueryService();

    // Initialize empty states
    const [userQueryList, setUserQueryList] = useState([]);
    const [postQueryList, setPostQueryList] = useState([]);

    /**
     * Handles changes in user query input.
     * 
     * @param {React.ChangeEvent<HTMLInputElement>} event - The change event from input.
     */
    const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        event.stopPropagation();
        const value = event.target.value.trim();

        setUserQuery(value);
        setFocused(!!value);
    }, []);

    /**
     * Handles key down events in input.
     * 
     * @param {React.KeyboardEvent<HTMLInputElement>} event - The key down event from input.
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
     * Handles focus events on input.
     * 
     * @param {React.FocusEvent<HTMLInputElement>} event - The focus event from input.
     */
    const handleInputFocus = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.target.value.length) setFocused(true);
    }, []);

    /**
     * Handles blur events on input.
     * 
     * @param {React.FocusEvent<HTMLInputElement>} event - The blur event from input.
     */
    const handleInputBlur = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
        console.log("(!) unhandled input blur event", event.target.value);
    }, []);

    // Search functions using DI container
    const fetchUserQuery = useCallback(async (query: string) => {
        try {
            const results = await searchService.searchUsers(query);
            setUserQueryList(results);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }, [searchService]);

    const fetchPostQuery = useCallback(async (query: string) => {
        try {
            const results = await searchService.searchPosts(query);
            setPostQueryList(results);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    }, [searchService]);

    return {
        queryInputRef,
        focused,
        userQuery,
        postQuery,
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
}

export default useSearch;
