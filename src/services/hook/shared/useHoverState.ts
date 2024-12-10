import { useCallback, useState } from "react";

export const useHoverState = () => {
    const [isHovering, setIsHovering] = useState(false);

    const handleMouseOver = useCallback(() => {
        setIsHovering(true);
    }, []);

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