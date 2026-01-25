import { useState, useEffect, useCallback, useRef } from 'react';
import { SessionTimeoutManager, SessionTimeoutConfig, SessionTimeoutState, SessionTimeoutEvents, SessionTimeoutMetrics } from '@core/auth/services/SessionTimeoutManager';

/**
 * React hook for session timeout management
 * 
 * Provides enterprise-grade session timeout functionality with:
 * - Intelligent timeout detection and warnings
 * - User-friendly countdown timers
 * - Graceful session extension capabilities
 * - Cross-tab synchronization
 * - Performance monitoring and analytics
 * - Accessibility compliance
 */

export interface UseSessionTimeoutOptions extends Partial<SessionTimeoutConfig> {
  /** Enable automatic cleanup on unmount (default: true) */
  autoCleanup?: boolean;
  /** Enable debug logging (default: false) */
  debug?: boolean;
}

export interface UseSessionTimeoutReturn {
  /** Current session state */
  state: SessionTimeoutState;
  /** Current metrics */
  metrics: SessionTimeoutMetrics;
  /** Configuration */
  config: SessionTimeoutConfig;
  /** Whether session can be extended */
  canExtend: boolean;
  /** Remaining extensions count */
  remainingExtensions: number;
  /** Extend the session */
  extendSession: (extensionTime?: number) => boolean;
  /** Reset the session */
  resetSession: () => void;
  /** Update configuration */
  updateConfig: (newConfig: Partial<SessionTimeoutConfig>) => void;
  /** Get formatted time remaining */
  getTimeRemaining: () => string;
  /** Get formatted session duration */
  getSessionDuration: () => string;
  /** Is session currently active */
  isActive: boolean;
  /** Is session in warning state */
  isWarning: boolean;
  /** Is session in final warning state */
  isFinalWarning: boolean;
  /** Is session expired */
  isExpired: boolean;
  /** Is session extended */
  isExtended: boolean;
}

/**
 * Hook for session timeout management
 */
export function useSessionTimeout(options: UseSessionTimeoutOptions = {}): UseSessionTimeoutReturn {
  const {
    autoCleanup = true,
    debug = false,
    ...config
  } = options;

  const [state, setState] = useState<SessionTimeoutState>(() => ({
    status: 'active',
    timeRemaining: config.sessionDuration || 30 * 60 * 1000,
    sessionStart: Date.now(),
    lastActivity: Date.now(),
    warningsShown: 0,
    extensionsGranted: 0,
    maxExtensions: config.maxExtensions || 3
  }));

  const [metrics, setMetrics] = useState<SessionTimeoutMetrics>(() => ({
    totalSessionTime: 0,
    activeTime: 0,
    idleTime: 0,
    timeoutCount: 0,
    extensionCount: 0,
    averageSessionLength: 0,
    abandonmentRate: 0
  }));

  const managerRef = useRef<SessionTimeoutManager | null>(null);
  const configRef = useRef<SessionTimeoutConfig>(config);

  // Debug logging function
  const debugLog = useCallback((message: string, data?: any) => {
    if (debug) {
      console.log(`[SessionTimeout] ${message}`, data);
    }
  }, [debug]);

  // Initialize session manager
  useEffect(() => {
    const events: SessionTimeoutEvents = {
      onStateChange: (newState) => {
        debugLog('State changed', newState);
        setState(newState);
      },
      onWarning: (timeRemaining) => {
        debugLog('Warning shown', { timeRemaining });
        // Could trigger toast notification here
      },
      onFinalWarning: (timeRemaining) => {
        debugLog('Final warning shown', { timeRemaining });
        // Could trigger modal here
      },
      onTimeout: () => {
        debugLog('Session expired');
        // Could trigger logout here
      },
      onExtended: (newExpiryTime) => {
        debugLog('Session extended', { newExpiryTime });
        // Could trigger success notification here
      },
      onActivity: (activityType) => {
        debugLog('Activity detected', { activityType });
      }
    };

    managerRef.current = new SessionTimeoutManager(config, events);
    configRef.current = { ...managerRef.current.getConfig() };

    return () => {
      if (autoCleanup && managerRef.current) {
        managerRef.current.destroy();
        managerRef.current = null;
      }
    };
  }, [autoCleanup, debug, debugLog]);

  // Update metrics periodically
  useEffect(() => {
    if (!managerRef.current) return;

    const interval = setInterval(() => {
      const currentMetrics = managerRef.current?.getMetrics();
      if (currentMetrics) {
        setMetrics(currentMetrics);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Extend session function
  const extendSession = useCallback((extensionTime?: number): boolean => {
    if (!managerRef.current) return false;

    const result = managerRef.current.extendSession(extensionTime);
    debugLog('Session extension attempted', { extensionTime, success: result });
    return result;
  }, [debugLog]);

  // Reset session function
  const resetSession = useCallback(() => {
    if (!managerRef.current) return;

    managerRef.current.resetSession();
    debugLog('Session reset');
  }, [debugLog]);

  // Update configuration function
  const updateConfig = useCallback((newConfig: Partial<SessionTimeoutConfig>) => {
    if (!managerRef.current) return;

    managerRef.current.updateConfig(newConfig);
    configRef.current = { ...managerRef.current.getConfig() };
    debugLog('Configuration updated', newConfig);
  }, [debugLog]);

  // Get formatted time remaining
  const getTimeRemaining = useCallback((): string => {
    const timeRemaining = state.timeRemaining;
    const minutes = Math.floor(timeRemaining / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
    
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  }, [state.timeRemaining]);

  // Get formatted session duration
  const getSessionDuration = useCallback((): string => {
    const duration = Date.now() - state.sessionStart;
    const minutes = Math.floor(duration / (1000 * 60));
    const seconds = Math.floor((duration % (1000 * 60)) / 1000);
    
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  }, [state.sessionStart]);

  // Computed properties
  const canExtend = state.status !== 'expired' && state.extensionsGranted < state.maxExtensions;
  const remainingExtensions = Math.max(0, state.maxExtensions - state.extensionsGranted);
  const isActive = state.status === 'active';
  const isWarning = state.status === 'warning';
  const isFinalWarning = state.status === 'final-warning';
  const isExpired = state.status === 'expired';
  const isExtended = state.status === 'extended';

  return {
    state,
    metrics,
    config: configRef.current,
    canExtend,
    remainingExtensions,
    extendSession,
    resetSession,
    updateConfig,
    getTimeRemaining,
    getSessionDuration,
    isActive,
    isWarning,
    isFinalWarning,
    isExpired,
    isExtended
  };
}

/**
 * Hook for session timeout with UI integration
 */
export function useSessionTimeoutUI(options: UseSessionTimeoutOptions = {}) {
  const sessionTimeout = useSessionTimeout(options);
  const [showWarning, setShowWarning] = useState(false);
  const [showFinalWarning, setShowFinalWarning] = useState(false);
  const [showExpired, setShowExpired] = useState(false);

  // Show warning modal when session is in warning state
  useEffect(() => {
    if (sessionTimeout.isWarning && !showWarning) {
      setShowWarning(true);
    } else if (!sessionTimeout.isWarning && showWarning) {
      setShowWarning(false);
    }
  }, [sessionTimeout.isWarning, showWarning]);

  // Show final warning modal when session is in final warning state
  useEffect(() => {
    if (sessionTimeout.isFinalWarning && !showFinalWarning) {
      setShowFinalWarning(true);
    } else if (!sessionTimeout.isFinalWarning && showFinalWarning) {
      setShowFinalWarning(false);
    }
  }, [sessionTimeout.isFinalWarning, showFinalWarning]);

  // Show expired modal when session is expired
  useEffect(() => {
    if (sessionTimeout.isExpired && !showExpired) {
      setShowExpired(true);
    } else if (!sessionTimeout.isExpired && showExpired) {
      setShowExpired(false);
    }
  }, [sessionTimeout.isExpired, showExpired]);

  const handleExtendSession = useCallback(() => {
    const success = sessionTimeout.extendSession();
    if (success) {
      setShowWarning(false);
      setShowFinalWarning(false);
    }
    return success;
  }, [sessionTimeout]);

  const handleDismissWarning = useCallback(() => {
    setShowWarning(false);
  }, []);

  const handleDismissFinalWarning = useCallback(() => {
    setShowFinalWarning(false);
  }, []);

  const handleExpired = useCallback(() => {
    setShowExpired(false);
    // Handle logout or redirect to login page
    window.location.href = '/login';
  }, []);

  return {
    ...sessionTimeout,
    showWarning,
    showFinalWarning,
    showExpired,
    handleExtendSession,
    handleDismissWarning,
    handleDismissFinalWarning,
    handleExpired
  };
}

/**
 * Hook for session timeout analytics
 */
export function useSessionTimeoutAnalytics(options: UseSessionTimeoutOptions = {}) {
  const sessionTimeout = useSessionTimeout(options);
  const [analytics, setAnalytics] = useState({
    averageSessionLength: 0,
    abandonmentRate: 0,
    extensionRate: 0,
    warningEffectiveness: 0,
    totalSessions: 0,
    successfulExtensions: 0
  });

  // Calculate analytics
  useEffect(() => {
    const metrics = sessionTimeout.metrics;
    const state = sessionTimeout.state;

    const extensionRate = state.extensionsGranted > 0 ? 
      (state.extensionsGranted / (state.extensionsGranted + metrics.timeoutCount)) * 100 : 0;

    const warningEffectiveness = state.warningsShown > 0 ? 
      ((state.extensionsGranted / state.warningsShown) * 100) : 0;

    setAnalytics({
      averageSessionLength: metrics.averageSessionLength,
      abandonmentRate: metrics.abandonmentRate * 100,
      extensionRate,
      warningEffectiveness,
      totalSessions: metrics.timeoutCount + metrics.extensionCount,
      successfulExtensions: metrics.extensionCount
    });
  }, [sessionTimeout.metrics, sessionTimeout.state]);

  return {
    ...sessionTimeout,
    analytics
  };
}
