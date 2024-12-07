import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';

/**
 * Custom hook to calculate the height of a given component.
 *
 * @param {React.ReactElement} component - The component to render and measure.
 * @returns {number} - The initial height of the component.
 */
const useComponentInitialHeight = (component: React.ReactElement) => {
    const [height, setHeight] = useState<number>(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = document.createElement('div');
        document.body.appendChild(container);
        const root = ReactDOM.createRoot(container);

        root.render(
            <div ref={containerRef} style={{ visibility: 'hidden', position: 'absolute' }}>
                {component}
            </div>
        );

        const measureHeight = () => {
            if (containerRef.current) {
                setHeight(containerRef.current.clientHeight);
                if (container.parentNode === document.body) {
                    document.body.removeChild(container);
                }
            }
        };

        // Wait for the next animation frame before measuring height
        requestAnimationFrame(measureHeight);

        return () => {
            if (container.parentNode === document.body) {
                document.body.removeChild(container);
            }
        };
    }, [component]);

    return height;
};

export default useComponentInitialHeight;
