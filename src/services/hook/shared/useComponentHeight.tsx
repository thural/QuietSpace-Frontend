import React, { useEffect, useState } from 'react';

/**
 * Custom hook to calculate the height of a given component.
 *
 * @param {React.RefObject<HTMLElement>} ref - The ref of the component whose height needs to be calculated.
 * @returns {number} - The height of the component.
 */
const useComponentHeight = (ref: React.RefObject<HTMLElement>) => {
    const [height, setHeight] = useState<number>(0);

    useEffect(() => {
        if (ref.current) {
            const updateHeight = () => {
                setHeight(ref.current!.clientHeight);
            };

            // Initial height calculation
            updateHeight();

            // Add resize event listener
            window.addEventListener('resize', updateHeight);

            // Cleanup event listener
            return () => {
                window.removeEventListener('resize', updateHeight);
            };
        }
    }, [ref]);

    return height;
};

export default useComponentHeight;
