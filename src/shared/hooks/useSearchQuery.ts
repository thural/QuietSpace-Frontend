import { UserResponse } from "@/features/profile/data/models/user";
import React, { useEffect, useState } from 'react';
import { createSearchQueryHookService } from './SearchQueryHookService';

/**
 * Custom hook to manage a search query with optional debouncing and minimum length requirements.
 * 
 * Now uses the SearchQueryHookService for better performance and resource management.
 * Maintains backward compatibility while leveraging enterprise class-based patterns.
 * 
 * @template T
 * @param {(value: string) => void} queryFn - Function to execute search query.
 * @param {Object} [options] - Options for query handling.
 * @param {number} [options.debounceTime=1000] - Time in milliseconds to wait before executing query.
 * @param {number} [options.minQueryLength=1] - Minimum length of query string before executing search.
 * @returns {Object} - An object containing search-related state and methods.
 * @returns {boolean} focused - Indicates if input is currently focused.
 * @returns {T[]} queryResult - The results of search query.
 * @returns {boolean} isSubmitting - Indicates if a query submission is in progress.
 * @returns {function} setQueryResult - Function to directly set query result.
 * @returns {function} handleQuerySubmit - Function to submit search query.
 * @returns {function} handleInputChange - Function to handle changes in input field.
 * @returns {function} handleKeyDown - Function to handle key down events in input field.
 * @returns {function} handleInputFocus - Function to handle focus events on input field.
 * @returns {function} handleInputBlur - Function to handle blur events on input field.
 */
export const useSearchQuery = <T = UserResponse>(
    queryFn: (value: string) => void,
    options?: {
        debounceTime?: number;
        minQueryLength?: number;
    }
) => {
    const [service] = useState(() => createSearchQueryHookService({ queryFn, options }));
    const [searchState, setSearchState] = useState(service.getSearchState());

    useEffect(() => {
        // Subscribe to search state changes
        const unsubscribe = service.subscribe((newState) => {
            setSearchState(newState);
        });

        return unsubscribe;
    }, [service]);

    return {
        focused: searchState.focused,
        queryResult: searchState.queryResult,
        isSubmitting: searchState.isSubmitting,
        setQueryResult: (results: T[]) => {
            service.setQueryResult(results);
            setSearchState(prev => ({ ...prev, queryResult: results }));
        },
        handleQuerySubmit: service.handleQuerySubmit,
        handleInputChange: service.handleInputChange,
        handleKeyDown: service.handleKeyDown,
        handleInputFocus: service.handleInputFocus,
        handleInputBlur: service.handleInputBlur,
    };
};

export default useSearchQuery;
