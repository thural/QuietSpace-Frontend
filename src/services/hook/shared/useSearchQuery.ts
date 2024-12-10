import { UserResponse } from "@/api/schemas/inferred/user";
import React, { useCallback, useState } from 'react';


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

    const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setFocused(true);

        if (value.length) {
            handleQuerySubmit(value);
        } else {
            setQueryResult([]);
        }
    }, [handleQuerySubmit]);

    const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
        if (event.key === 'Escape') setFocused(false);
    }, []);

    const handleInputFocus = useCallback(() => setFocused(true), []);

    const handleInputBlur = useCallback((event: React.FocusEvent, resultListRef: React.RefObject<HTMLDivElement>) => {
        if (resultListRef.current && resultListRef.current.contains(event.relatedTarget as Node)) return;
        // Commented out to match original behavior
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

export default useSearchQuery