import { useCallback, useRef } from "react";

/**
 * Custom debounce function.
 *
 * @param {Function} func - The function to debounce.
 * @param {number} wait - The time to wait in milliseconds.
 * @returns {Function} - The debounced function.
 */
const useDebounce = (func: Function, wait: number) => {
    const timeoutRef = useRef<number | undefined>(undefined);

    const debouncedFunc = useCallback((...args: [any]) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = window.setTimeout(() => {
            func(...args);
        }, wait);
    }, [func, wait]);

    return debouncedFunc;
};

export default useDebounce