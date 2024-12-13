import { useEffect, useRef, useState } from "react";

/**
 * Custom hook that tracks whether an element has been seen in the viewport.
 *
 * This hook uses the Intersection Observer API to determine if the element
 * referenced by the returned ref has entered the viewport. It returns a boolean
 * indicating if the element was seen and a ref to be attached to the target element.
 *
 * @returns {[boolean, React.RefObject]} - An array containing:
 *  - `wasSeen`: A boolean indicating if the element has been seen.
 *  - `wasSeenRef`: A ref to be attached to the element to track its visibility.
 */
function useWasSeen() {
    const [wasSeen, setWasSeen] = useState(
        typeof IntersectionObserver !== "function"
    );

    const wasSeenRef = useRef(null);

    useEffect(() => {
        if (wasSeenRef.current && !wasSeen) {
            const observer = new IntersectionObserver(
                ([entry]) => entry.isIntersecting && setWasSeen(true)
            );
            observer.observe(wasSeenRef.current);
            return () => {
                observer.disconnect();
            };
        }
    }, [wasSeen]);

    return [wasSeen, wasSeenRef];
}

export default useWasSeen;