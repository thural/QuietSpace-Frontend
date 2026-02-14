/** @jsxImportSource @emotion/react */
import { PureComponent, ReactNode } from 'react';
import { countdownContainerStyles, countdownDisplayStyles, countdownMessageStyles } from './styles';
import { ICountdownTimerProps } from './interfaces';

/**
 * Timer data interface
 */
interface TimerData {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
}

/**
 * CountdownTimer Component State Interface
 */
interface ICountdownTimerState {
  timeLeft: TimerData;
  hasTimedOut: boolean;
}

/**
 * Enterprise CountdownTimer Component
 * 
 * A versatile countdown timer component with enterprise-grade styling,
 * theme integration, and responsive design. Built with Emotion CSS
 * for optimal performance and consistency.
 * 
 * @example
 * ```tsx
 * <CountdownTimer 
 *   period={60000}
 *   timeUpMessage="Time's up!"
 * />
 * ```
 */
class CountdownTimer extends PureComponent<ICountdownTimerProps, ICountdownTimerState> {
  private intervalId: NodeJS.Timeout | null = null;
  private endTime: number;

  constructor(props: ICountdownTimerProps) {
    super(props);

    const { period = 900000 } = props;
    this.endTime = Date.now() + period;

    this.state = {
      timeLeft: this.calculateTimeLeft(),
      hasTimedOut: false
    };
  }

  /**
   * Calculates the remaining time
   * 
   * @returns TimerData object with remaining time
   */
  private calculateTimeLeft = (): TimerData => {
    const now = Date.now();
    const difference = this.endTime - now;

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0
      };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
      milliseconds: difference % 1000
    };
  };

  /**
   * Updates the timer state
   */
  private updateTimer = (): void => {
    const timeLeft = this.calculateTimeLeft();
    const hasTimedOut = timeLeft.days === 0 && timeLeft.hours === 0 &&
      timeLeft.minutes === 0 && timeLeft.seconds === 0;

    this.setState({ timeLeft, hasTimedOut });

    if (hasTimedOut && this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  };

  /**
   * Resets the timer to the initial period
   */
  public resetTimer = (): void => {
    const { period = 900000 } = this.props;
    this.endTime = Date.now() + period;

    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.intervalId = setInterval(this.updateTimer, 100);
    this.updateTimer();
  };

  override componentDidMount(): void {
    this.intervalId = setInterval(this.updateTimer, 100);
  }

  override componentWillUnmount(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  /**
   * Renders the countdown timer with enterprise styling
   * 
   * @returns JSX element representing the countdown timer
   */
  override render(): ReactNode {
    const { timeUpMessage = "Time's up!" } = this.props;
    const { timeLeft, hasTimedOut } = this.state;

    const formatTime = (value: number): string =>
      value.toString().padStart(2, '0');

    const timeString = hasTimedOut
      ? timeUpMessage
      : `${formatTime(timeLeft.hours)}:${formatTime(timeLeft.minutes)}:${formatTime(timeLeft.seconds)}`;

    return (
      <div css={countdownContainerStyles(undefined)}>
        <div css={countdownDisplayStyles(undefined, hasTimedOut)}>
          {timeString}
        </div>
        {!hasTimedOut && (
          <div css={countdownMessageStyles(undefined)}>
            Time remaining
          </div>
        )}
      </div>
    );
  }
}

export default CountdownTimer;
