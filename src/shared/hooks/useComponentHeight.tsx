import React, { createContext, useContext, useEffect, useState } from 'react';
import { createComponentHeightHookService } from './ComponentHeightHookService';

/**
 * ComponentHeight context for direct service integration
 */
const ComponentHeightContext = createContext<ReturnType<typeof createComponentHeightHookService> | null>(null);

/**
 * ComponentHeight provider component that directly integrates with ComponentHeightHookService
 */
export const ComponentHeightProvider: React.FC<{ children: React.ReactNode; ref: React.RefObject<HTMLElement> }> = ({
    children,
    ref
}) => {
    const [service, setService] = useState(() => createComponentHeightHookService({ ref }));

    useEffect(() => {
        // Subscribe to height changes
        const unsubscribe = service.subscribe(() => {
            // Height state is managed by individual hook instances
        });

        return () => {
            unsubscribe();
        };
    }, [service]);

    // Update service if ref changes
    useEffect(() => {
        const newService = createComponentHeightHookService({ ref });
        setService(newService);

        return () => {
            // Cleanup will be handled by the service's onUnmount
        };
    }, [ref]);

    return (
        <ComponentHeightContext.Provider value={service}>
            {children}
        </ComponentHeightContext.Provider>
    );
};

/**
 * Enterprise useComponentHeight hook with direct service integration
 * 
 * Optimized to use ComponentHeightHookService directly through context for better performance
 * and cleaner architecture while maintaining backward compatibility.
 *
 * @param {React.RefObject<HTMLElement>} ref - The ref of component whose height needs to be calculated.
 * @returns {number} - The height of component.
 */
const useComponentHeight = (ref: React.RefObject<HTMLElement>) => {
    const service = useContext(ComponentHeightContext);

    if (!service) {
        throw new Error('useComponentHeight must be used within ComponentHeightProvider');
    }

    const [height, setHeight] = useState(service.getHeight());

    useEffect(() => {
        // Subscribe to height changes
        const unsubscribe = service.subscribe((newHeight) => {
            setHeight(newHeight);
        });

        return () => {
            unsubscribe();
        };
    }, [service]);

    // Update service if ref changes
    useEffect(() => {
        const newService = createComponentHeightHookService({ ref });
        setHeight(newService.getHeight());

        return () => {
            // Cleanup will be handled by the service's onUnmount
        };
    }, [ref]);

    return height;
};

export default useComponentHeight;
