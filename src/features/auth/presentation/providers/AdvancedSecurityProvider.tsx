import { useEffect } from 'react';
import { useAuthStore } from '@/core/store/zustand';
import { useSessionTimeout } from '../../application/hooks/useSessionTimeout';
import { useSecurityMonitor } from '../../application/hooks/useSecurityMonitor';

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
 * Integrates all advanced security features using enterprise-grade implementations:
 * - Enterprise session timeout management
 * - Comprehensive security monitoring
 * - Real-time security analytics
 */
export const AdvancedSecurityProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    user,
    isAuthenticated,
    logout
  } = useAuthStore();

  // Enterprise session timeout setup
  const {
    state: sessionState,
    metrics: sessionMetrics,
    extendSession,
    resetSession,
    isActive,
    isWarning,
    isFinalWarning
  } = useSessionTimeout({
    timeoutMs: 30 * 60 * 1000, // 30 minutes
    warningMs: 5 * 60 * 1000,  // 5 minutes warning
    autoCleanup: true,
    debug: false
  });

  // Handle timeout manually since the interface doesn't include onTimeout
  useEffect(() => {
    if (sessionState === 'expired') {
      console.log('Session timed out');
      logout();
    }
  }, [sessionState, logout]);

  // Enterprise security monitoring
  const {
    securityStatus,
    securitySettings,
    securityData,
    isLoading
  } = useSecurityMonitor(user?.id);

  // Handle authentication events with security monitoring
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('User authenticated:', user.id, user.username);

      // Security monitoring will automatically track login events
      // through the enterprise security system
    }
  }, [isAuthenticated, user]);

  // Handle logout events
  useEffect(() => {
    if (!isAuthenticated && user) {
      console.log('User logged out:', user.id);

      // Security monitoring will automatically track logout events
      // through the enterprise security system
    }
  }, [isAuthenticated, user]);

  // Track API requests for security monitoring
  useEffect(() => {
    if (isAuthenticated && user) {
      // This would be called from API interceptors
      const trackRequest = () => {
        // Enterprise security monitoring automatically tracks requests
        // Reset session timer on activity
        if (isActive) {
          extendSession();
        }
      };

      // Example: Track page navigation as activity
      const handleNavigation = () => {
        trackRequest();
      };

      window.addEventListener('popstate', handleNavigation);
      return () => window.removeEventListener('popstate', handleNavigation);
    }
  }, [isAuthenticated, user, extendSession, isActive]);

  // Token expiry checking with enterprise security
  useEffect(() => {
    if (isAuthenticated && user) {
      const checkTokenExpiry = () => {
        const { token } = useAuthStore.getState();

        if (token && isTokenExpired(token)) {
          console.warn('Token expired, logging out user');

          // Enterprise security monitoring will automatically log
          // suspicious activity like token expiry
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
  }, [isAuthenticated, user, logout]);

  return <>{children}</>;
};

/**
 * Hook for accessing advanced security features
 */
export const useAdvancedSecurity = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { securityStatus, securityData, isLoading } = useSecurityMonitor(user?.id);

  return {
    // Security monitoring (enterprise grade)
    getSecurityStatus: () => securityStatus,
    getSecurityData: () => securityData,
    isLoading,

    // Current user info
    user,
    isAuthenticated
  };
};

export default AdvancedSecurityProvider;
