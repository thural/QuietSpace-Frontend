import { useEffect, useState, useMemo, useCallback } from "react";

/**
 * Base data structure for timer state.
 * 
 * @interface TimerBaseData
 */
interface TimerBaseData {
    hasTimeOut: boolean;
}

/**
 * Extended data structure for timer with detailed time breakdown.
 * 
 * @interface TimerData
 * @extends TimerBaseData
 */
export interface TimerData extends TimerBaseData {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

/**
 * Calculates the time left until a specified period.
 *
 * @param {number} period - The future time in milliseconds.
 * @returns {TimerData} - An object containing time breakdown and timeout status.
 */
const calculateTimeLeft = (period: number): TimerData => {
    const difference = period - +new Date();

    if (difference > 0) return {
        hasTimeOut: false,
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
    };

    return { hasTimeOut: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
}

/**
 * Processes the expiration date based on the given interval.
 *
 * @param {number} interval - The countdown interval in milliseconds.
 * @returns {number} - The calculated expiration date in milliseconds.
 */
const processExpireDate = (interval: number): number => (interval + +new Date());

let hasReset = false;

/**
 * Resets the timer state.
 */
const resetTimer = () => { hasReset = !hasReset; }

/**
 * Custom hook to manage countdown timer.
 *
 * @param {number} period - The countdown period in milliseconds.
 * @returns {object} - Timer data and methods.
 */
const useTimer = (period: number) => {
    const expireDate = useMemo(() => processExpireDate(period), [period, hasReset]);
    const [timeLeft, setTimeLeft] = useState<Partial<TimerData>>(calculateTimeLeft(expireDate));

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft(expireDate));
        }, 1000);

        return () => clearTimeout(timer);
    }, [expireDate]);

    return { timeLeft, resetTimer };
}

export { useTimer, resetTimer };
