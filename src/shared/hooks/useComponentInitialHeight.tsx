import React, { useEffect, useState } from 'react';
import { createComponentInitialHeightHookService } from './ComponentInitialHeightHookService';

/**
 * Enterprise useComponentInitialHeight hook
 * 
 * Now uses the ComponentInitialHeightHookService for better performance and resource management.
 * Maintains backward compatibility while leveraging enterprise class-based patterns.
 *
 * @param {React.ReactElement} component - The component to render and measure.
 * @returns {number} - The initial height of component.
 */
const useComponentInitialHeight = (component: React.ReactElement) => {
    const [service, setService] = useState(() => createComponentInitialHeightHookService({ component }));
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
        setService(newService);
        setHeight(newService.getHeight());

        return () => {
            // Cleanup will be handled by the service's onUnmount
        };
    }, [component]);

    return height;
};

export default useComponentInitialHeight;
