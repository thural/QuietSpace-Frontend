import React, { useEffect, useMemo, useState } from "react";

export const calculateTimeLeft = (expireDate) => {
    let year = new Date().getFullYear();
    const difference = expireDate - +new Date();
    let timeLeft = {};

    if (difference > 0) {
        timeLeft = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
        };
    }

    return timeLeft;
};


export const displayCountdown = (interval = 900000, timeUpMessage = "Time's up!") => {

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    const expireDate = useMemo(() => { return interval + +new Date() }, [interval]);

    useEffect(() => {
        setTimeout(() => {
            setTimeLeft(calculateTimeLeft(expireDate));
        }, 1000);
    });

    const timerComponents = [];

    Object.keys(timeLeft).forEach((interval) => {
        if (!timeLeft[interval]) {
            return;
        }

        timerComponents.push(
            <span>
                {timeLeft[interval]} {interval}{" "}
            </span>
        );
    });

    return {
        hasTimeOut: false,
        component: (
            <div>{timerComponents.length ? timerComponents : <span>{timeUpMessage}</span>}</div>)
    };
}

