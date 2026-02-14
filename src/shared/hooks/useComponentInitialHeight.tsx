import React, { createContext, useContext, useEffect, useState } from 'react';
import { createComponentInitialHeightHookService } from './ComponentInitialHeightHookService';

/**
 * ComponentInitialHeight context for direct service integration
 */
const ComponentInitialHeightContext = createContext<ReturnType<typeof createComponentInitialHeightHookService> | null>(null);

/**
 * ComponentInitialHeight provider component that directly integrates with ComponentInitialHeightHookService
 */
export const ComponentInitialHeightProvider: React.FC<{ children: React.ReactNode; component: React.ReactElement }> = ({
    children,
    component
}) => {
    const [service, setService] = useState(() => createComponentInitialHeightHookService({ component }));

    useEffect(() => {
        // Subscribe to height changes
        const unsubscribe = service.subscribe(() => {
            // Height state is managed by individual hook instances
        });

        return () => {
            unsubscribe();
        };
    }, [service]);

    // Update service if component changes
    useEffect(() => {
        const newService = createComponentInitialHeightHookService({ component });
        setService(newService);

        return () => {
            // Cleanup will be handled by the service's onUnmount
        };
    }, [component]);

    return (
        <ComponentInitialHeightContext.Provider value={service}>
            {children}
        </ComponentInitialHeightContext.Provider>
    );
};

/**
 * Enterprise useComponentInitialHeight hook with direct service integration
 * 
 * Optimized to use ComponentInitialHeightHookService directly through context for better performance
 * and cleaner architecture while maintaining backward compatibility.
 *
 * @param {React.ReactElement} component - The component to render and measure.
 * @returns {number} - The initial height of component.
 */
const useComponentInitialHeight = (component: React.ReactElement) => {
    const service = useContext(ComponentInitialHeightContext);

    if (!service) {
        throw new Error('useComponentInitialHeight must be used within ComponentInitialHeightProvider');
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

    // Update service if component changes
    useEffect(() => {
        const newService = createComponentInitialHeightHookService({ component });
        setHeight(newService.getHeight());

        return () => {
            // Cleanup will be handled by the service's onUnmount
        };
    }, [component]);

    return height;
};

export default useComponentInitialHeight;
