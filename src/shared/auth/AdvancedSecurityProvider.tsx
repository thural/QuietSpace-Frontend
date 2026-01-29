import { useEffect } from 'react';
import { useAuthStore } from '@/core/store/zustand';
import { useSessionTimeout } from './useSessionTimeout';
import { useMultiTabSync } from './useMultiTabSync';
import { useAuditLogger } from './auditLogger';
import { useAnomalyDetector } from './anomalyDetector';
import { SessionManager } from './SessionTimeoutWarning';

/**
 * Utility function to check if JWT token is expired
 */
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error parsing token:', error);
    return true; // Assume expired if can't parse
  }
};

/**
 * AdvancedSecurityProvider component
 * 
 * Integrates all advanced security features:
 * - Session timeout handling
 * - Multi-tab synchronization
 * - Security audit logging
 * - Anomaly detection
 */
export const AdvancedSecurityProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    user,
    isAuthenticated,
    login,
    logout,
    setAuthData,
    setIsAuthenticated
  } = useAuthStore();

  // Session timeout setup
  const { resetTimer } = useSessionTimeout({
    timeoutMs: 30 * 60 * 1000, // 30 minutes
    warningMs: 5 * 60 * 1000,  // 5 minutes warning
    onTimeout: () => {
      console.log('Session timed out');
      logout();
    }
  });

  // Multi-tab sync setup
  const {
    syncLogin,
    syncLogout,
    syncTokenRefresh,
    syncSessionTimeout
  } = useMultiTabSync({
    enabled: true,
    channelName: 'auth-sync'
  });

  // Audit logger setup
  const auditLog = useAuditLogger();

  // Anomaly detector setup
  const anomalyDetector = useAnomalyDetector({
    enabled: true,
    maxFailedLogins: 5,
    failedLoginWindow: 15,
    maxRequestsPerMinute: 100,
    enableLocationDetection: false, // Would need backend IP detection
    enableConcurrentSessionDetection: true
  });

  // Handle authentication events with audit logging
  useEffect(() => {
    if (isAuthenticated && user) {
      // Log successful login
      auditLog.logLoginSuccess(user.id, user.username, {
        timestamp: new Date().toISOString(),
        sessionId: 'session_' + Date.now()
      });

      // Track user session for anomaly detection
      anomalyDetector.trackUserSession(user.id, 'session_' + Date.now());

      // Sync login across tabs
      syncLogin(user, 'token_placeholder'); // Would use actual token
    }
  }, [isAuthenticated, user, auditLog, anomalyDetector, syncLogin]);

  // Handle logout events
  useEffect(() => {
    if (!isAuthenticated && user) {
      // Log logout
      auditLog.logLogout({
        timestamp: new Date().toISOString(),
        userId: user.id
      });

      // Sync logout across tabs
      syncLogout();
    }
  }, [isAuthenticated, user, auditLog, syncLogout]);

  // Track API requests for anomaly detection
  useEffect(() => {
    if (isAuthenticated && user) {
      // This would be called from API interceptors
      const trackRequest = () => {
        anomalyDetector.trackRequest(user.id);
        resetTimer(); // Reset session timer on activity
      };

      // Example: Track page navigation as activity
      const handleNavigation = () => {
        trackRequest();
      };

      window.addEventListener('popstate', handleNavigation);
      return () => window.removeEventListener('popstate', handleNavigation);
    }
  }, [isAuthenticated, user, anomalyDetector, resetTimer]);

  // Token expiry checking
  useEffect(() => {
    if (isAuthenticated && user) {
      const checkTokenExpiry = () => {
        const { token } = useAuthStore.getState();

        if (token && isTokenExpired(token)) {
          console.warn('Token expired, logging out user');

          // Log token expiry event
          auditLog.logSuspiciousActivity({
            type: 'TOKEN_EXPIRED',
            userId: user.id,
            timestamp: new Date().toISOString(),
            details: 'JWT token expired during session'
          }, 'HIGH');

          // Logout and redirect to login
          logout();
          window.location.href = '/auth/login?reason=expired';
        }
      };

      // Check token expiry every minute
      const interval = setInterval(checkTokenExpiry, 60000);

      // Initial check on mount
      checkTokenExpiry();

      return () => clearInterval(interval);
    }
  }, [isAuthenticated, user, auditLog, logout]);

  return (
    <SessionManager>
      {children}
    </SessionManager>
  );
};

/**
 * Hook for accessing advanced security features
 */
export const useAdvancedSecurity = () => {
  const { user, isAuthenticated } = useAuthStore();
  const auditLog = useAuditLogger();
  const anomalyDetector = useAnomalyDetector();

  return {
    // Audit logging
    logSecurityEvent: auditLog.logSuspiciousActivity,
    getAuditLogs: auditLog.getRecentLogs,
    exportAuditLogs: auditLog.exportLogs,

    // Anomaly detection
    getAnomalies: anomalyDetector.getRecentAnomalies,
    getUserRiskScore: user ? () => anomalyDetector.getUserRiskScore(user.id) : () => 0,
    isHighRiskUser: user ? () => anomalyDetector.isHighRiskUser(user.id) : () => false,

    // Current user info
    user,
    isAuthenticated
  };
};

export default AdvancedSecurityProvider;
