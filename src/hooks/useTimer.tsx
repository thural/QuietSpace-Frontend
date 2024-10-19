import React, { useEffect, useMemo, useState } from "react";

export const calculateTimeLeft = (period) => {
    const difference = period - +new Date();

    if (difference > 0) return {
        hasTimeOut: false,
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
    };

    return { hasTimeOut: true };
};

const processExpireDate = (interval) => (interval + +new Date());

let hasReset = false;
const resetTimer = () => { hasReset = !hasReset; }

export const displayCountdown = (period = 900000, timeUpMessage = "time's up!") => {

    const expireDate = useMemo(() => processExpireDate(period), [period, hasReset]);
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(expireDate));

    useEffect(() => {
        setTimeout(() => {
            setTimeLeft(calculateTimeLeft(expireDate));
        }, 1000);
    });

    const timerComponents = [];

    Object.keys(timeLeft).forEach((interval) => {
        if (!timeLeft[interval]) return;

        timerComponents.push(
            <span>
                {timeLeft[interval]} {interval}{" "}
            </span>
        );
    });

    return {
        hasTimeOut: timeLeft.hasTimeOut,
        resetTimer,
        component: (
            <div>{timerComponents.length ? timerComponents : <span>{timeUpMessage}</span>}</div>)
    };
}

