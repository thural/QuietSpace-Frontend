import { useCallback, useState } from "react";

/**
 * Custom hook to manage hover state for an element.
 * 
 * @returns {Object} - An object containing hover state and handlers.
 * @returns {boolean} isHovering - Indicates if the element is currently being hovered over.
 * @returns {function} handleMouseOver - Function to handle mouse over events.
 * @returns {function} handleMouseOut - Function to handle mouse out events.
 */
export const useHoverState = () => {
    const [isHovering, setIsHovering] = useState(false);

    /**
     * Handles the mouse over event.
     * 
     * Sets the hover state to true.
     */
    const handleMouseOver = useCallback(() => {
        setIsHovering(true);
    }, []);

    /**
     * Handles the mouse out event.
     * 
     * Sets the hover state to false.
     */
    const handleMouseOut = useCallback(() => {
        setIsHovering(false);
    }, []);

    return {
        isHovering,
        handleMouseOver,
        handleMouseOut
    };
};

export default useHoverState;