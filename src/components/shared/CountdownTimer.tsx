import React from "react";
import { useTimer, resetTimer, TimerData } from "@/services/hook/common/useTimer";
import { ProcedureFn } from "@/types/genericTypes";

/**
 * Display output for the countdown timer.
 * 
 * @interface CountDownDisplay
 */
export interface CountDownDisplay {
    hasTimeOut: boolean | undefined;
    resetTimer: ProcedureFn;
    component: JSX.Element;
}

/**
 * Component for displaying a countdown timer with specified period and timeout message.
 *
 * @param {object} props - The component props.
 * @param {number} [props.period=900000] - The countdown period in milliseconds (default is 15 minutes).
 * @param {string} [props.timeUpMessage="time's up!"] - The message to display when the time is up.
 * @returns {JSX.Element} - The countdown timer component.
 */
const CountdownTimer: React.FC<{ period?: number, timeUpMessage?: string }> = ({ period = 900000, timeUpMessage = "time's up!" }) => {
    const { timeLeft } = useTimer(period);

    const timerComponents: Array<JSX.Element> = [];

    Object.keys(timeLeft).forEach((timeLabel) => {
        const key = timeLabel as keyof TimerData

        if (!timeLeft[key]) return;

        timerComponents.push(
            <span key={key}>
                {timeLeft[key]} {timeLabel}{" "}
            </span>
        );
    });

    return <div>{timerComponents.length ? timerComponents : <span>{timeUpMessage}</span>}</div>;
}

export default CountdownTimer;
