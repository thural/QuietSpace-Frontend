import { useEffect, useRef, useCallback } from 'react';
import { useAuthStore } from '@/core/store/zustand';

interface SessionTimeoutOptions {
  /** Session timeout in milliseconds (default: 30 minutes) */
  timeoutMs?: number;
  /** Warning time before timeout in milliseconds (default: 5 minutes) */
  warningMs?: number;
  /** Events that reset the session timer */
  events?: string[];
  /** Callback for session timeout warning */
  onWarning?: (timeRemaining: number) => void;
  /** Callback for session timeout */
  onTimeout?: () => void;
}

/**
 * Hook for managing session timeout with automatic logout
 * 
 * Tracks user activity and automatically logs out after inactivity.
 * Provides warning before timeout and customizable events.
 */
export const useSessionTimeout = (options: SessionTimeoutOptions = {}) => {
  const {
    timeoutMs = 30 * 60 * 1000, // 30 minutes
    warningMs = 5 * 60 * 1000,  // 5 minutes
    events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'],
    onWarning,
    onTimeout
  } = options;

  const { isAuthenticated, logout } = useAuthStore();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  /** Reset the session timer */
  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now();

    // Clear existing timers
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningRef.current) {
      clearTimeout(warningRef.current);
    }

    if (!isAuthenticated) return;

    // Set warning timer
    warningRef.current = setTimeout(() => {
      const timeRemaining = timeoutMs - warningMs;
      onWarning?.(timeRemaining);
    }, timeoutMs - warningMs);

    // Set timeout timer
    timeoutRef.current = setTimeout(() => {
      console.warn('Session timed out due to inactivity');
      onTimeout?.();
      logout();
    }, timeoutMs);
  }, [isAuthenticated, timeoutMs, warningMs, onWarning, onTimeout, logout]);

  /** Handle user activity events */
  const handleActivity = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  /** Setup event listeners */
  useEffect(() => {
    if (!isAuthenticated) return;

    // Add event listeners for user activity
    events.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    // Initial timer setup
    resetTimer();

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningRef.current) {
        clearTimeout(warningRef.current);
      }
    };
  }, [isAuthenticated, events, handleActivity, resetTimer]);

  /** Get session status */
  const getSessionStatus = useCallback(() => {
    const now = Date.now();
    const timeSinceActivity = now - lastActivityRef.current;
    const timeRemaining = Math.max(0, timeoutMs - timeSinceActivity);
    const isWarning = timeRemaining <= warningMs;
    const isExpired = timeRemaining <= 0;

    return {
      timeRemaining,
      timeSinceActivity,
      isWarning,
      isExpired,
      lastActivity: lastActivityRef.current
    };
  }, [timeoutMs, warningMs]);

  return {
    resetTimer,
    getSessionStatus,
    timeRemaining: getSessionStatus().timeRemaining,
    isWarning: getSessionStatus().isWarning
  };
};

/**
 * Session timeout manager class for advanced session management
 */
export class SessionTimeoutManager {
  private timeoutMs: number;
  private warningMs: number;
  private events: string[];
  private onWarning?: (timeRemaining: number) => void;
  private onTimeout?: () => void;
  private timeoutRef: NodeJS.Timeout | null = null;
  private warningRef: NodeJS.Timeout | null = null;
  private lastActivity: number = Date.now();
  private isActive: boolean = false;

  constructor(options: SessionTimeoutOptions = {}) {
    this.timeoutMs = options.timeoutMs || 30 * 60 * 1000;
    this.warningMs = options.warningMs || 5 * 60 * 1000;
    this.events = options.events || ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    this.onWarning = options.onWarning;
    this.onTimeout = options.onTimeout;
  }

  /** Start monitoring session */
  start() {
    if (this.isActive) return;

    this.isActive = true;
    this.lastActivity = Date.now();
    this.resetTimer();
    this.setupEventListeners();
  }

  /** Stop monitoring session */
  stop() {
    if (!this.isActive) return;

    this.isActive = false;
    this.clearTimers();
    this.removeEventListeners();
  }

  /** Reset the session timer */
  private resetTimer() {
    this.lastActivity = Date.now();
    this.clearTimers();

    // Set warning timer
    this.warningRef = setTimeout(() => {
      const timeRemaining = this.timeoutMs - this.warningMs;
      this.onWarning?.(timeRemaining);
    }, this.timeoutMs - this.warningMs);

    // Set timeout timer
    this.timeoutRef = setTimeout(() => {
      console.warn('Session timed out due to inactivity');
      this.onTimeout?.();
    }, this.timeoutMs);
  }

  /** Handle user activity */
  private handleActivity = () => {
    this.resetTimer();
  };

  /** Setup event listeners */
  private setupEventListeners() {
    this.events.forEach(event => {
      document.addEventListener(event, this.handleActivity, { passive: true });
    });
  }

  /** Remove event listeners */
  private removeEventListeners() {
    this.events.forEach(event => {
      document.removeEventListener(event, this.handleActivity);
    });
  }

  /** Clear all timers */
  private clearTimers() {
    if (this.timeoutRef) {
      clearTimeout(this.timeoutRef);
      this.timeoutRef = null;
    }
    if (this.warningRef) {
      clearTimeout(this.warningRef);
      this.warningRef = null;
    }
  }

  /** Get session status */
  getStatus() {
    const now = Date.now();
    const timeSinceActivity = now - this.lastActivity;
    const timeRemaining = Math.max(0, this.timeoutMs - timeSinceActivity);
    const isWarning = timeRemaining <= this.warningMs;
    const isExpired = timeRemaining <= 0;

    return {
      timeRemaining,
      timeSinceActivity,
      isWarning,
      isExpired,
      lastActivity: this.lastActivity,
      isActive: this.isActive
    };
  }
}

export default useSessionTimeout;
