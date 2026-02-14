import React, { useEffect, useState } from 'react';
import { createComponentHeightHookService } from './ComponentHeightHookService';

/**
 * Enterprise useComponentHeight hook
 * 
 * Now uses the ComponentHeightHookService for better performance and resource management.
 * Maintains backward compatibility while leveraging enterprise class-based patterns.
 *
 * @param {React.RefObject<HTMLElement>} ref - The ref of the component whose height needs to be calculated.
 * @returns {number} - The height of the component.
 */
const useComponentHeight = (ref: React.RefObject<HTMLElement>) => {
    const [service, setService] = useState(() => createComponentHeightHookService({ ref }));
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
        setService(newService);
        setHeight(newService.getHeight());

        return () => {
            // Cleanup will be handled by the service's onUnmount
        };
    }, [ref]);

    return height;
};

export default useComponentHeight;
