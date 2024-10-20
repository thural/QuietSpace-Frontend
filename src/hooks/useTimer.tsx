import { useEffect, useMemo, useState } from "react";

interface TimerBaseData {
    hasTimeOut: boolean
}

interface TimerData extends TimerBaseData {
    hasTimeOut: false
    days: number
    hours: number
    minutes: number
    seconds: number
}

export const calculateTimeLeft = (period: number) => {
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

const processExpireDate = (interval: number) => (interval + +new Date());

let hasReset = false;
const resetTimer = () => { hasReset = !hasReset; }

export const displayCountdown = (period = 900000, timeUpMessage = "time's up!") => {

    const expireDate = useMemo(() => processExpireDate(period), [period, hasReset]);
    const [timeLeft, setTimeLeft] = useState<TimerData | TimerBaseData>(calculateTimeLeft(expireDate));

    useEffect(() => {
        setTimeout(() => {
            setTimeLeft(calculateTimeLeft(expireDate));
        }, 1000);
    });

    const timerComponents: Array<JSX.Element> = [];

    Object.keys(timeLeft).forEach((timeLabel) => {
        const key = timeLabel as keyof TimerData;

        if (!timeLeft[key]) return;

        timerComponents.push(
            <span>
                {timeLeft[key]} {timeLabel}{" "}
            </span>
        );
    });

    return {
        hasTimeOut: timeLeft.hasTimeOut,
        resetTimer,
        component: (
            <div>{timerComponents.length ? timerComponents : <span>{timeUpMessage}</span>}</div>)
    }
}