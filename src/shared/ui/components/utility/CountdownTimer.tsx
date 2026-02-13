import React, { PureComponent, ReactNode } from "react";
import { useTimer, resetTimer, TimerData } from "@/services/hook/common/useTimer";
import { ProcedureFn } from "@/shared/types/genericTypes";

/**
 * Display output for the countdown timer.
 * 
 * @interface ICountDownDisplay
 */
export interface ICountDownDisplay {
    hasTimeOut: boolean | undefined;
    resetTimer: ProcedureFn;
    component: React.ReactElement;
}

interface ICountdownTimerProps {
    period?: number;
    timeUpMessage?: string;
}

interface ICountdownTimerState {
    timeLeft: TimerData;
}

/**
 * Component for displaying a countdown timer with specified period and timeout message.
 *
 * @param {object} props - The component props.
 * @param {number} [props.period=900000] - The countdown period in milliseconds (default is 15 minutes).
 * @param {string} [props.timeUpMessage="time's up!"] - The message to display when the time is up.
 * @returns {JSX.Element} - The countdown timer component.
 */
class CountdownTimer extends PureComponent<ICountdownTimerProps, ICountdownTimerState> {
    private timer: (period: number) => { timeLeft: TimerData };

    constructor(props: ICountdownTimerProps) {
        super(props);

        const { period = 900000 } = props;

        // Initialize hook pattern
        this.timer = (periodMs: number) => {
            // Mock implementation - in real scenario this would use the hook
            const mockTimeLeft: TimerData = {
                days: 0,
                hours: 0,
                minutes: Math.floor(periodMs / 60000),
                seconds: Math.floor((periodMs % 60000) / 1000),
                milliseconds: periodMs % 1000
            };

            return { timeLeft: mockTimeLeft };
        };

        this.state = {
            timeLeft: this.timer(period).timeLeft
        };
    }

    override componentDidMount(): void {
        this.startTimer();
    }

    override componentDidUpdate(prevProps: ICountdownTimerProps): void {
        const { period = 900000 } = this.props;
        const { period: prevPeriod = 900000 } = prevProps;

        if (period !== prevPeriod) {
            this.setState({ timeLeft: this.timer(period).timeLeft });
            this.startTimer();
        }
    }

    /**
     * Start the timer countdown
     */
    private startTimer = (): void => {
        const { period = 900000 } = this.props;

        // Simulate timer countdown
        const interval = setInterval(() => {
            this.setState(prevState => {
                const { timeLeft } = prevState;
                const newTimeLeft = { ...timeLeft };

                // Decrease time
                if (newTimeLeft.seconds > 0) {
                    newTimeLeft.seconds--;
                } else if (newTimeLeft.minutes > 0) {
                    newTimeLeft.minutes--;
                    newTimeLeft.seconds = 59;
                } else if (newTimeLeft.hours > 0) {
                    newTimeLeft.hours--;
                    newTimeLeft.minutes = 59;
                    newTimeLeft.seconds = 59;
                } else if (newTimeLeft.days > 0) {
                    newTimeLeft.days--;
                    newTimeLeft.hours = 23;
                    newTimeLeft.minutes = 59;
                    newTimeLeft.seconds = 59;
                } else {
                    clearInterval(interval);
                }

                return { timeLeft: newTimeLeft };
            });
        }, 1000);
    };

    /**
     * Generate timer components
     */
    private generateTimerComponents = (): ReactNode[] => {
        const { timeLeft } = this.state;
        const timerComponents: ReactNode[] = [];

        Object.keys(timeLeft).forEach((timeLabel) => {
            const key = timeLabel as keyof TimerData;

            if (!timeLeft[key]) return;

            timerComponents.push(
                <span key={key}>
                    {timeLeft[key]} {timeLabel}{" "}
                </span>
            );
        });

        return timerComponents;
    };

    override render(): ReactNode {
        const { timeUpMessage = "time's up!" } = this.props;
        const timerComponents = this.generateTimerComponents();

        return (
            <div>
                {timerComponents.length ? timerComponents : <span>{timeUpMessage}</span>}
            </div>
        );
    }
}

export default CountdownTimer;
