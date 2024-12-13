import { UserResponse } from "@/api/schemas/inferred/user";
import React, { useCallback, useState } from 'react';

/**
 * Custom hook to manage a search query with optional debouncing and minimum length requirements.
 * 
 * @template T
 * @param {(value: string) => void} queryFn - Function to execute the search query.
 * @param {Object} [options] - Options for the query handling.
 * @param {number} [options.debounceTime=1000] - Time in milliseconds to wait before executing the query.
 * @param {number} [options.minQueryLength=1] - Minimum length of the query string before executing the search.
 * @returns {Object} - An object containing search-related state and methods.
 * @returns {boolean} focused - Indicates if the input is currently focused.
 * @returns {T[]} queryResult - The results of the search query.
 * @returns {boolean} isSubmitting - Indicates if a query submission is in progress.
 * @returns {function} setQueryResult - Function to directly set the query result.
 * @returns {function} handleQuerySubmit - Function to submit the search query.
 * @returns {function} handleInputChange - Function to handle changes in the input field.
 * @returns {function} handleKeyDown - Function to handle key down events in the input field.
 * @returns {function} handleInputFocus - Function to handle focus events on the input field.
 * @returns {function} handleInputBlur - Function to handle blur events on the input field.
 */
export const useSearchQuery = <T = UserResponse>(
    queryFn: (value: string) => void,
    options?: {
        debounceTime?: number,
        minQueryLength?: number
    }
) => {
    const [focused, setFocused] = useState(false);
    const [queryResult, setQueryResult] = useState<T[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    /**
     * Handles the submission of a search query.
     * 
     * @param {string} value - The query string to submit.
     */
    const handleQuerySubmit = useCallback(async (value: string) => {
        const minQueryLength = options?.minQueryLength ?? 1;
        const debounceTime = options?.debounceTime ?? 1000;

        if (isSubmitting || value.length < minQueryLength) return;

        setIsSubmitting(true);
        queryFn(value);

        setTimeout(() => {
            setIsSubmitting(false);
        }, debounceTime);
    }, [queryFn, isSubmitting, options]);

    /**
     * Handles changes in the input field.
     * 
     * @param {React.ChangeEvent<HTMLInputElement>} event - The change event from the input.
     */
    const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setFocused(true);

        if (value.length) {
            handleQuerySubmit(value);
        } else {
            setQueryResult([]);
        }
    }, [handleQuerySubmit]);

    /**
     * Handles key down events in the input field.
     * 
     * @param {React.KeyboardEvent} event - The key down event from the input.
     */
    const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
        if (event.key === 'Escape') setFocused(false);
    }, []);

    /**
     * Handles focus events on the input field.
     */
    const handleInputFocus = useCallback(() => setFocused(true), []);

    /**
     * Handles blur events on the input field.
     * 
     * @param {React.FocusEvent} event - The blur event from the input.
     * @param {React.RefObject<HTMLDivElement>} resultListRef - Reference to the result list element.
     */
    const handleInputBlur = useCallback((event: React.FocusEvent, resultListRef: React.RefObject<HTMLDivElement>) => {
        if (resultListRef.current && resultListRef.current.contains(event.relatedTarget as Node)) return;
        // setFocused(false);
    }, []);

    return {
        focused,
        queryResult,
        isSubmitting,
        setQueryResult,
        handleQuerySubmit,
        handleInputChange,
        handleKeyDown,
        handleInputFocus,
        handleInputBlur,
    };
};

export default useSearchQuery;
