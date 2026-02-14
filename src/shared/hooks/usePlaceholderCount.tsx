import { useEffect, useState } from 'react';
import { createPlaceholderCountHookService } from './PlaceholderCountHookService';

/**
 * Enterprise usePlaceholderCount hook
 * 
 * Now uses the PlaceholderCountHookService for better performance and resource management.
 * Maintains backward compatibility while leveraging enterprise class-based patterns.
 *
 * @param {number} placeholderHeight - The height of a single placeholder element.
 * @returns {number} - The calculated number of placeholders that fit in the viewport.
 */
const usePlaceholderCount = (placeholderHeight: number) => {
    const [service, setService] = useState(() => createPlaceholderCountHookService({ placeholderHeight }));
    const [count, setCount] = useState(service.getCount());

    useEffect(() => {
        // Subscribe to count changes
        const unsubscribe = service.subscribe((newCount) => {
            setCount(newCount);
        });

        return () => {
            unsubscribe();
        };
    }, [service]);

    // Update service if placeholderHeight changes
    useEffect(() => {
        const newService = createPlaceholderCountHookService({ placeholderHeight });
        setService(newService);
        setCount(newService.getCount());

        return () => {
            // Cleanup will be handled by the service's onUnmount
        };
    }, [placeholderHeight]);

    return count;
};

export default usePlaceholderCount;