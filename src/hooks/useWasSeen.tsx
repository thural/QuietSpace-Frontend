import { useEffect, useRef, useState } from "react";


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

export default useWasSeen