import { ProcedureFn } from "@/types/genericTypes";
import { useEffect, useMemo, useState } from "react";

interface TimerBaseData {
    hasTimeOut: boolean
}

interface TimerData extends TimerBaseData {
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
}

export interface CountDownDisplay {
    hasTimeOut: boolean | undefined
    resetTimer: ProcedureFn
    component: JSX.Element
}

const processExpireDate = (interval: number) => (interval + +new Date());

let hasReset = false;
const resetTimer = () => { hasReset = !hasReset; }

export const displayCountdown = (period = 900000, timeUpMessage = "time's up!"): CountDownDisplay => {

    const expireDate = useMemo(() => processExpireDate(period), [period, hasReset]);
    const [timeLeft, setTimeLeft] = useState<Partial<TimerData>>(calculateTimeLeft(expireDate));

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
        component: <div>{timerComponents.length ? timerComponents : <span>{timeUpMessage}</span>}</div>
    }
}