import React, { createContext, useContext, useState, useEffect } from "react";
import { createHoverStateHookService } from './HoverStateHookService';

/**
 * HoverState context for direct service integration
 */
const HoverStateContext = createContext<ReturnType<typeof createHoverStateHookService> | null>(null);

/**
 * HoverState provider component that directly integrates with HoverStateHookService
 */
export const HoverStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [service] = useState(() => createHoverStateHookService());

    useEffect(() => {
        // Subscribe to hover state changes
        const unsubscribe = service.subscribe(() => {
            // Hover state is managed by individual hook instances
        });

        return () => {
            unsubscribe();
        };
    }, [service]);

    return React.createElement(
        HoverStateContext.Provider,
        { value: service },
        children
    );
};

/**
 * Custom hook to manage hover state for an element with direct service integration
 * 
 * Optimized to use HoverStateHookService directly through context for better performance
 * and cleaner architecture while maintaining backward compatibility.
 * 
 * @returns {Object} - An object containing hover state and handlers.
 * @returns {boolean} isHovering - Indicates if element is currently being hovered over.
 * @returns {function} handleMouseOver - Function to handle mouse over events.
 * @returns {function} handleMouseOut - Function to handle mouse out events.
 */
export const useHoverState = () => {
    const service = useContext(HoverStateContext);

    if (!service) {
        throw new Error('useHoverState must be used within HoverStateProvider');
    }

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