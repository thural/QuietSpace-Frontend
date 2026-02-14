/**
 * CountdownTimer Props Interface
 * 
 * Defines the contract for the CountdownTimer component which provides
 * enterprise-grade countdown functionality with theme integration.
 * 
 * @interface ICountdownTimerProps
 */

import { ReactElement } from 'react';
import { ProcedureFn } from "@/shared/types/genericTypes";

/**
 * Display output interface for the countdown timer
 */
export interface ICountDownDisplay {
  /** Whether the timer has timed out */
  hasTimeOut: boolean | undefined;
  
  /** Function to reset the timer */
  resetTimer: ProcedureFn;
  
  /** React component to display */
  component: ReactElement;
}

/**
 * Props interface for CountdownTimer component
 */
export interface ICountdownTimerProps {
  /** Countdown period in milliseconds (default: 900000 = 15 minutes) */
  period?: number;
  
  /** Message to display when time is up */
  timeUpMessage?: string;
}
