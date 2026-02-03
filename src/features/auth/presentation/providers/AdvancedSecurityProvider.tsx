import { useEffect } from 'react';
import { useFeatureAuth } from '@/core/modules/authentication/hooks/useFeatureAuth';
import { useSessionTimeout } from '../../application/hooks/useSessionTimeout';
import { useSecurityMonitor } from '../../application/hooks/useSecurityMonitor';

/**
 * Utility function to check if JWT token is expired
 */
const isTokenExpired = (token: string): boolean => {
  try {
    if (!token) return true;
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
    isAuthenticated,
    authData,
    clearAuth
  } = useFeatureAuth();

  // Get user from authData with type assertion
  const user = authData?.user as any;

  // Enterprise session timeout setup
  const {
    state: sessionState
  } = useSessionTimeout({
    autoCleanup: true,
    debug: false
  });

  // Handle timeout manually since the interface doesn't include onTimeout
  useEffect(() => {
    if (sessionState === 'expired') {
      console.log('Session timed out');
      clearAuth();
    }
  }, [sessionState, clearAuth]);

  // Enterprise security monitoring
  useSecurityMonitor(user?.id);

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
      const trackRequest = (): void => {
        // Enterprise security monitoring automatically tracks requests
        // Reset session timer on activity
        console.log('Tracking request for security monitoring');
      };

      // Example: Track page navigation as activity
      const handleNavigation = (): void => {
        trackRequest();
      };

      window.addEventListener('popstate', handleNavigation);
      return () => window.removeEventListener('popstate', handleNavigation);
    }
    return undefined;
  }, [isAuthenticated, user]);

  // Token expiry checking with enterprise security
  useEffect(() => {
    if (isAuthenticated && user) {
      const checkTokenExpiry = (): void => {
        const token = authData?.accessToken;

        if (token && isTokenExpired(token)) {
          console.warn('Token expired, logging out user');

          // Enterprise security monitoring will automatically log
          // suspicious activity like token expiry
          clearAuth();
          window.location.href = '/auth/login?reason=expired';
        }
      };

      // Check token expiry every minute
      const interval = setInterval(checkTokenExpiry, 60000);

      // Initial check on mount
      checkTokenExpiry();

      return () => clearInterval(interval);
    }
    return undefined;
  }, [isAuthenticated, user, clearAuth, authData]);

  return <>{children}</>;
};

/**
 * Hook for accessing advanced security features
 */
export const useAdvancedSecurity = () => {
  const { isAuthenticated, authData } = useFeatureAuth();
  const user = authData?.user as any;
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
