import { useState, useEffect } from 'react';

/**
 * Custom hook to calculate the number of placeholders based on window height.
 *
 * @param {number} placeholderHeight - The height of a single placeholder element.
 * @returns {number} - The calculated number of placeholders.
 */
const usePlaceholderCount = (placeholderHeight: number) => {
    const [placeholders, setPlaceholders] = useState(0);

    useEffect(() => {
        const calculatePlaceholders = () => {
            const windowHeight = window.innerHeight;
            const numPlaceholders = Math.ceil(windowHeight / placeholderHeight);
            setPlaceholders(numPlaceholders);
        };

        calculatePlaceholders();

        window.addEventListener('resize', calculatePlaceholders);

        return () => {
            window.removeEventListener('resize', calculatePlaceholders);
        };
    }, [placeholderHeight]);

    return placeholders;
};

export default usePlaceholderCount;
