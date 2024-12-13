import { useState, useEffect } from 'react';

/**
 * Custom hook to calculate the number of placeholders based on window height.
 *
 * This hook determines how many placeholder elements can fit within the 
 * current viewport height, given the height of a single placeholder. 
 * It recalculates the number of placeholders when the window is resized.
 *
 * @param {number} placeholderHeight - The height of a single placeholder element.
 * @returns {number} - The calculated number of placeholders that fit in the viewport.
 */
const usePlaceholderCount = (placeholderHeight: number) => {
    const [placeholders, setPlaceholders] = useState(0);

    useEffect(() => {
        /**
         * Calculates the number of placeholders that can fit in the window height.
         *
         * This function retrieves the current window height and divides it by 
         * the height of the placeholder to determine how many placeholders can 
         * be displayed. It uses Math.ceil to round up to ensure that any 
         * remaining space is accounted for as an additional placeholder.
         */
        const calculatePlaceholders = () => {
            const windowHeight = window.innerHeight;
            const numPlaceholders = Math.ceil(windowHeight / placeholderHeight);
            setPlaceholders(numPlaceholders);
        };

        // Initial calculation of placeholders
        calculatePlaceholders();

        // Event listener to recalculate placeholders on window resize
        window.addEventListener('resize', calculatePlaceholders);

        // Cleanup function to remove the event listener
        return () => {
            window.removeEventListener('resize', calculatePlaceholders);
        };
    }, [placeholderHeight]);

    return placeholders;
};

export default usePlaceholderCount;