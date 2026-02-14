import React, { useEffect, useState } from 'react';
import { getComponentInitialHeightService } from '../services/ComponentInitialHeightService';

/**
 * Enterprise useComponentInitialHeight hook
 * 
 * Now uses ComponentInitialHeightService for better performance and resource management.
 * Maintains backward compatibility while leveraging enterprise patterns.
 *
 * @param {React.ReactElement} component - The component to render and measure.
 * @returns {number} - The initial height of component.
 */
const useComponentInitialHeight = (component: React.ReactElement) => {
    const [height, setHeight] = useState<number>(0);
    const service = getComponentInitialHeightService();

    useEffect(() => {
        // Subscribe to height changes
        const unsubscribe = service.subscribe((newHeight) => {
            setHeight(newHeight);
        });

        // Calculate initial height
        service.calculateInitialHeight(component).then(calculatedHeight => {
            setHeight(calculatedHeight);
        });

        return unsubscribe;
    }, [component]);

    return height;
};

export default useComponentInitialHeight;
