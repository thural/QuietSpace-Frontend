import { useEffect, useRef, useState } from "react";


function useWasSeen() {
    const [wasSeen, setWasSeen] = useState(
        typeof IntersectionObserver !== "function"
    );

    const ref = useRef(null);
    useEffect(() => {
        if (ref.current && !wasSeen) {
            const observer = new IntersectionObserver(
                ([entry]) => entry.isIntersecting && setWasSeen(true)
            );
            observer.observe(ref.current);
            return () => {
                observer.disconnect();
            };
        }
    }, [wasSeen]);
    return [wasSeen, ref];
}

export default useWasSeen