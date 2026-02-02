import { useEffect, useState } from 'react';
import { createPlaceholderCountService } from '../services/PlaceholderCountService';

/**
 * Enterprise usePlaceholderCount hook
 * 
 * Now uses the PlaceholderCountService for better performance and resource management.
 * Maintains backward compatibility while leveraging enterprise patterns.
 *
 * @param {number} placeholderHeight - The height of a single placeholder element.
 * @returns {number} - The calculated number of placeholders that fit in the viewport.
 */
const usePlaceholderCount = (placeholderHeight: number) => {
    const [placeholders, setPlaceholders] = useState(0);

    useEffect(() => {
        // Create the enterprise service
        const service = createPlaceholderCountService(placeholderHeight);

        // Subscribe to count changes
        const unsubscribe = service.subscribe((count) => {
            setPlaceholders(count);
        });

        return () => {
            unsubscribe();
            service.destroy();
        };
    }, [placeholderHeight]);

    return placeholders;
};

export default usePlaceholderCount;