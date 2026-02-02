import React, { useEffect, useState, useRef } from 'react';
import { getComponentHeightService } from '../services/ComponentHeightService';

/**
 * Enterprise useComponentHeight hook
 * 
 * Now uses the ComponentHeightService for better performance and resource management.
 * Maintains backward compatibility while leveraging enterprise patterns.
 *
 * @param {React.RefObject<HTMLElement>} ref - The ref of the component whose height needs to be calculated.
 * @returns {number} - The height of the component.
 */
const useComponentHeight = (ref: React.RefObject<HTMLElement>) => {
    const [height, setHeight] = useState<number>(0);
    const unsubscribeRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        // Get the enterprise service
        const service = getComponentHeightService();

        // Subscribe to height changes
        unsubscribeRef.current = service.subscribe(ref, (newHeight) => {
            setHeight(newHeight);
        });

        // Cleanup subscription
        return () => {
            if (unsubscribeRef.current) {
                unsubscribeRef.current();
                unsubscribeRef.current = null;
            }
        };
    }, [ref]);

    return height;
};

export default useComponentHeight;
