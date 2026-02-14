import { useEffect, useState } from "react";
import { createHoverStateHookService } from './HoverStateHookService';

/**
 * Custom hook to manage hover state for an element.
 * 
 * Now uses the HoverStateHookService for better performance and resource management.
 * Maintains backward compatibility while leveraging enterprise class-based patterns.
 * 
 * @returns {Object} - An object containing hover state and handlers.
 * @returns {boolean} isHovering - Indicates if element is currently being hovered over.
 * @returns {function} handleMouseOver - Function to handle mouse over events.
 * @returns {function} handleMouseOut - Function to handle mouse out events.
 */
export const useHoverState = () => {
    const [service] = useState(() => createHoverStateHookService());
    const [isHovering, setIsHovering] = useState(service.getHoverState());

    useEffect(() => {
        // Subscribe to hover state changes
        const unsubscribe = service.subscribe((newHoverState) => {
            setIsHovering(newHoverState);
        });

        return unsubscribe;
    }, [service]);

    return {
        isHovering,
        handleMouseOver: service.handleMouseOver,
        handleMouseOut: service.handleMouseOut
    };
};

export default useHoverState;