import React, { createContext, useContext, useEffect, useState } from 'react';
import { createPlaceholderCountHookService } from './PlaceholderCountHookService';

/**
 * PlaceholderCount context for direct service integration
 */
const PlaceholderCountContext = createContext<ReturnType<typeof createPlaceholderCountHookService> | null>(null);

/**
 * PlaceholderCount provider component that directly integrates with PlaceholderCountHookService
 */
export const PlaceholderCountProvider: React.FC<{ children: React.ReactNode; placeholderHeight: number }> = ({
    children,
    placeholderHeight
}) => {
    const [service, setService] = useState(() => createPlaceholderCountHookService({ placeholderHeight }));

    useEffect(() => {
        // Subscribe to count changes
        const unsubscribe = service.subscribe(() => {
            // Count state is managed by individual hook instances
        });

        return () => {
            unsubscribe();
        };
    }, [service]);

    // Update service if placeholderHeight changes
    useEffect(() => {
        const newService = createPlaceholderCountHookService({ placeholderHeight });
        setService(newService);

        return () => {
            // Cleanup will be handled by the service's onUnmount
        };
    }, [placeholderHeight]);

    return (
        <PlaceholderCountContext.Provider value={service}>
            {children}
        </PlaceholderCountContext.Provider>
    );
};

/**
 * Enterprise usePlaceholderCount hook with direct service integration
 * 
 * Optimized to use PlaceholderCountHookService directly through context for better performance
 * and cleaner architecture while maintaining backward compatibility.
 *
 * @param {number} placeholderHeight - The height of a single placeholder element.
 * @returns {number} - The calculated number of placeholders that fit in the viewport.
 */
const usePlaceholderCount = (placeholderHeight: number) => {
    const service = useContext(PlaceholderCountContext);

    if (!service) {
        throw new Error('usePlaceholderCount must be used within PlaceholderCountProvider');
    }

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
        setCount(newService.getCount());

        return () => {
            // Cleanup will be handled by the service's onUnmount
        };
    }, [placeholderHeight]);

    return count;
};

export default usePlaceholderCount;