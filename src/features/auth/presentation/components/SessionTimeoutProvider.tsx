import React, { createContext, useContext, ReactNode } from 'react';
import { useSessionTimeoutUI, useSessionTimeoutAnalytics } from '@features/auth/application/hooks/useSessionTimeout';
import { SessionTimeoutWarning, SessionTimeoutFinalWarning, SessionTimeoutExpired, SessionTimeoutIndicator } from '@features/auth/presentation/components/SessionTimeoutModals';

/**
 * Session Timeout Context
 * 
 * Provides session timeout management context for the entire application.
 */
interface SessionTimeoutContextValue {
  // Basic session timeout functionality
  state: any;
  metrics: any;
  config: any;
  canExtend: boolean;
  remainingExtensions: number;
  extendSession: (extensionTime?: number) => boolean;
  resetSession: () => void;
  updateConfig: (newConfig: any) => void;
  getTimeRemaining: () => string;
  getSessionDuration: () => string;
  isActive: boolean;
  isWarning: boolean;
  isFinalWarning: boolean;
  isExpired: boolean;
  isExtended: boolean;

  // UI integration
  showWarning: boolean;
  showFinalWarning: boolean;
  showExpired: boolean;
  handleExtendSession: () => boolean;
  handleDismissWarning: () => void;
  handleDismissFinalWarning: () => void;
  handleExpired: () => void;

  // Analytics
  analytics: any;
}

const SessionTimeoutContext = createContext<SessionTimeoutContextValue | null>(null);

/**
 * Props for SessionTimeoutProvider
 */
export interface SessionTimeoutProviderProps {
  children: ReactNode;
  /** Session timeout configuration */
  config?: {
    sessionDuration?: number;
    warningTime?: number;
    finalWarningTime?: number;
    gracePeriod?: number;
    enableCrossTabSync?: boolean;
    enableActivityTracking?: boolean;
    inactivityTimeout?: number;
    enableMonitoring?: boolean;
    maxExtensions?: number;
  };
  /** Enable debug logging */
  debug?: boolean;
  /** Show session indicator */
  showIndicator?: boolean;
  /** Enable analytics tracking */
  enableAnalytics?: boolean;
  /** Custom event handlers */
  onWarning?: (timeRemaining: number) => void;
  onFinalWarning?: (timeRemaining: number) => void;
  onTimeout?: () => void;
  onExtended?: (newExpiryTime: number) => void;
  onStateChange?: (state: any) => void;
  onActivity?: (activityType: string) => void;
}

/**
 * Session Timeout Provider
 * 
 * Provides comprehensive session timeout management for React applications.
 * 
 * Features:
 * - Intelligent timeout detection and warnings
 * - User-friendly countdown timers
 * - Graceful session extension capabilities
 * - Cross-tab synchronization
 * - Performance monitoring and analytics
 * - Accessibility compliance
 * - Customizable event handlers
 * 
 * Usage:
 * ```tsx
 * <SessionTimeoutProvider
 *   config={{
 *     sessionDuration: 30 * 60 * 1000, // 30 minutes
 *     warningTime: 5 * 60 * 1000, // 5 minutes
 *     finalWarningTime: 60 * 1000, // 1 minute
 *     maxExtensions: 3
 *   }}
 *   onTimeout={() => console.log('Session expired')}
 *   onExtended={(newTime) => console.log('Session extended to:', newTime)}
 * >
 *   <App />
 * </SessionTimeoutProvider>
 * ```
 */
export const SessionTimeoutProvider: React.FC<SessionTimeoutProviderProps> = ({
  children,
  config = {},
  debug = false,
  showIndicator = true,
  enableAnalytics = false,
  onWarning,
  onFinalWarning,
  onTimeout,
  onExtended,
  onStateChange,
  onActivity
}) => {
  // Use appropriate hook based on analytics setting
  const sessionTimeoutHook = enableAnalytics 
    ? useSessionTimeoutAnalytics({ ...config, debug, autoCleanup: false })
    : useSessionTimeoutUI({ ...config, debug, autoCleanup: false });

  const {
    state,
    metrics,
    config: currentConfig,
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
    isExtended,
    showWarning,
    showFinalWarning,
    showExpired,
    handleExtendSession,
    handleDismissWarning,
    handleDismissFinalWarning,
    handleExpired,
    analytics
  } = sessionTimeoutHook;

  // Apply custom event handlers
  React.useEffect(() => {
    if (onWarning && isWarning) {
      onWarning(state.timeRemaining);
    }
  }, [onWarning, isWarning, state.timeRemaining]);

  React.useEffect(() => {
    if (onFinalWarning && isFinalWarning) {
      onFinalWarning(state.timeRemaining);
    }
  }, [onFinalWarning, isFinalWarning, state.timeRemaining]);

  React.useEffect(() => {
    if (onTimeout && isExpired) {
      onTimeout();
    }
  }, [onTimeout, isExpired]);

  React.useEffect(() => {
    if (onExtended && isExtended) {
      onExtended(Date.now() + currentConfig.sessionDuration);
    }
  }, [onExtended, isExtended, currentConfig.sessionDuration]);

  React.useEffect(() => {
    if (onStateChange) {
      onStateChange(state);
    }
  }, [onStateChange, state]);

  React.useEffect(() => {
    if (onActivity && metrics.activeTime > 0) {
      onActivity('user-activity');
    }
  }, [onActivity, metrics.activeTime]);

  const contextValue: SessionTimeoutContextValue = {
    state,
    metrics,
    config: currentConfig,
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
    isExtended,
    showWarning,
    showFinalWarning,
    showExpired,
    handleExtendSession,
    handleDismissWarning,
    handleDismissFinalWarning,
    handleExpired,
    analytics: analytics || {}
  };

  return (
    <SessionTimeoutContext.Provider value={contextValue}>
      {children}
      
      {/* Session Timeout Modals */}
      <SessionTimeoutWarning />
      <SessionTimeoutFinalWarning />
      <SessionTimeoutExpired />
      
      {/* Session Indicator */}
      {showIndicator && <SessionTimeoutIndicator />}
    </SessionTimeoutContext.Provider>
  );
};

/**
 * Hook to access session timeout context
 */
export function useSessionTimeoutContext(): SessionTimeoutContextValue {
  const context = useContext(SessionTimeoutContext);
  
  if (!context) {
    throw new Error('useSessionTimeoutContext must be used within a SessionTimeoutProvider');
  }
  
  return context;
}

/**
 * Hook for session timeout with simplified API
 */
export function useSessionTimeoutSimple() {
  const {
    getTimeRemaining,
    canExtend,
    remainingExtensions,
    extendSession,
    isWarning,
    isFinalWarning,
    isExpired
  } = useSessionTimeoutContext();

  return {
    timeRemaining: getTimeRemaining(),
    canExtend,
    remainingExtensions,
    extendSession,
    isWarning,
    isFinalWarning,
    isExpired
  };
}

/**
 * Hook for session timeout analytics
 */
export function useSessionTimeoutAnalyticsData() {
  const { analytics, metrics } = useSessionTimeoutContext();
  
  return {
    analytics,
    metrics,
    // Computed analytics
    averageSessionLength: analytics.averageSessionLength || 0,
    abandonmentRate: analytics.abandonmentRate || 0,
    extensionRate: analytics.extensionRate || 0,
    warningEffectiveness: analytics.warningEffectiveness || 0,
    totalSessions: analytics.totalSessions || 0,
    successfulExtensions: analytics.successfulExtensions || 0
  };
}

/**
 * Session Timeout Guard Component
 * 
 * Protects routes/components that require active sessions.
 */
export interface SessionTimeoutGuardProps {
  children: ReactNode;
  /** Custom fallback component when session is expired */
  fallback?: ReactNode;
  /** Custom action when session expires */
  onExpired?: () => void;
  /** Show warning before redirect */
  showWarning?: boolean;
}

export const SessionTimeoutGuard: React.FC<SessionTimeoutGuardProps> = ({
  children,
  fallback = null,
  onExpired,
  showWarning = true
}) => {
  const { isExpired, handleExpired } = useSessionTimeoutContext();

  React.useEffect(() => {
    if (isExpired && onExpired) {
      onExpired();
    }
  }, [isExpired, onExpired]);

  if (isExpired) {
    if (showWarning) {
      // Let the modal handle the expired state
      return null;
    }
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

/**
 * Session Timeout Status Component
 * 
 * Displays current session status in a compact format.
 */
export interface SessionTimeoutStatusProps {
  /** Show detailed information */
  detailed?: boolean;
  /** Custom className */
  className?: string;
  /** Custom style */
  style?: React.CSSProperties;
}

export const SessionTimeoutStatus: React.FC<SessionTimeoutStatusProps> = ({
  detailed = false,
  className = '',
  style = {}
}) => {
  const {
    getTimeRemaining,
    canExtend,
    remainingExtensions,
    isActive,
    isWarning,
    isFinalWarning,
    isExpired
  } = useSessionTimeoutContext();

  const getStatusColor = () => {
    if (isExpired) return '#dc2626';
    if (isFinalWarning) return '#f59e0b';
    if (isWarning) return '#f59e0b';
    return '#10b981';
  };

  const getStatusText = () => {
    if (isExpired) return 'Expired';
    if (isFinalWarning) return 'Expiring Soon';
    if (isWarning) return 'Warning';
    return 'Active';
  };

  return (
    <div 
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '4px 8px',
        borderRadius: '4px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        border: `1px solid ${getStatusColor()}`,
        fontSize: '12px',
        color: getStatusColor(),
        ...style
      }}
    >
      <div style={{
        width: '6px',
        height: '6px',
        backgroundColor: getStatusColor(),
        borderRadius: '50%',
        animation: isFinalWarning ? 'pulse 1s infinite' : 'none'
      }} />
      
      <span style={{ fontWeight: '500' }}>
        {getStatusText()}
      </span>
      
      {!isExpired && (
        <span style={{ opacity: 0.7 }}>
          {getTimeRemaining()}
        </span>
      )}
      
      {detailed && remainingExtensions > 0 && (
        <span style={{ opacity: 0.5, fontSize: '10px' }}>
          ({remainingExtensions} left)
        </span>
      )}
    </div>
  );
};

/**
 * Session Timeout Debug Panel
 * 
 * Development tool for debugging session timeout behavior.
 */
export const SessionTimeoutDebugPanel: React.FC = () => {
  const {
    state,
    metrics,
    config,
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
    isExtended,
    analytics
  } = useSessionTimeoutContext();

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      color: 'white',
      padding: '16px',
      borderRadius: '8px',
      fontFamily: 'monospace',
      fontSize: '12px',
      maxWidth: '400px',
      zIndex: 9999
    }}>
      <h4 style={{ margin: '0 0 12px 0', color: '#10b981' }}>
        Session Timeout Debug
      </h4>
      
      <div style={{ marginBottom: '8px' }}>
        <strong>Status:</strong> {state.status}
      </div>
      
      <div style={{ marginBottom: '8px' }}>
        <strong>Time Remaining:</strong> {getTimeRemaining()}
      </div>
      
      <div style={{ marginBottom: '8px' }}>
        <strong>Session Duration:</strong> {getSessionDuration()}
      </div>
      
      <div style={{ marginBottom: '8px' }}>
        <strong>Can Extend:</strong> {canExtend ? 'Yes' : 'No'}
      </div>
      
      <div style={{ marginBottom: '8px' }}>
        <strong>Remaining Extensions:</strong> {remainingExtensions}
      </div>
      
      <div style={{ marginBottom: '12px' }}>
        <strong>Warnings Shown:</strong> {state.warningsShown}
      </div>
      
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button
          onClick={() => extendSession()}
          disabled={!canExtend}
          style={{
            padding: '4px 8px',
            backgroundColor: canExtend ? '#10b981' : '#374151',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '10px',
            cursor: canExtend ? 'pointer' : 'not-allowed'
          }}
        >
          Extend
        </button>
        
        <button
          onClick={resetSession}
          style={{
            padding: '4px 8px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '10px',
            cursor: 'pointer'
          }}
        >
          Reset
        </button>
        
        <button
          onClick={() => updateConfig({ sessionDuration: 60000 })}
          style={{
            padding: '4px 8px',
            backgroundColor: '#f59e0b',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '10px',
            cursor: 'pointer'
          }}
        >
          1min Test
        </button>
      </div>
      
      {analytics && (
        <div style={{ marginTop: '12px', borderTop: '1px solid #374151', paddingTop: '8px' }}>
          <strong>Analytics:</strong>
          <div>Extension Rate: {analytics.extensionRate?.toFixed(1)}%</div>
          <div>Abandonment Rate: {analytics.abandonmentRate?.toFixed(1)}%</div>
        </div>
      )}
    </div>
  );
};

export default SessionTimeoutProvider;
