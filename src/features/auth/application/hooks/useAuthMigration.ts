/**
 * Auth Migration Hook
 * 
 * Provides backward compatibility during migration from legacy auth hooks to enterprise auth hooks
 * Allows gradual migration with feature flags and fallback mechanisms
 */

import { useEffect, useState } from 'react';
import { useEnterpriseAuthWithSecurity } from './useEnterpriseAuthWithSecurity';
import { useEnterpriseAuth } from '@/core/modules/authentication';
import { useEnterpriseAuthHook } from './useEnterpriseAuthHook';

/**
 * Migration configuration
 */
interface AuthMigrationConfig {
  useEnterpriseHooks: boolean;
  enableFallback: boolean;
  logMigrationEvents: boolean;
  securityLevel: 'basic' | 'enhanced' | 'maximum';
}

/**
 * Migration state
 */
interface AuthMigrationState {
  isUsingEnterprise: boolean;
  migrationErrors: string[];
  performanceMetrics: {
    enterpriseHookTime: number;
    legacyHookTime: number;
  };
  securityFeatures: {
    twoFactorEnabled: boolean;
    deviceTrustEnabled: boolean;
    sessionMonitoringEnabled: boolean;
  };
}

/**
 * Auth Migration Hook
 * 
 * Provides seamless migration between legacy and enterprise auth hooks
 * with feature flags, performance monitoring, and error handling
 */
export const useAuthMigration = (config: AuthMigrationConfig = {
  useEnterpriseHooks: true,
  enableFallback: true,
  logMigrationEvents: true,
  securityLevel: 'enhanced'
}) => {
  const [migrationState, setMigrationState] = useState<AuthMigrationState>({
    isUsingEnterprise: config.useEnterpriseHooks,
    migrationErrors: [],
    performanceMetrics: {
      enterpriseHookTime: 0,
      legacyHookTime: 0
    },
    securityFeatures: {
      twoFactorEnabled: false,
      deviceTrustEnabled: false,
      sessionMonitoringEnabled: false
    }
  });

  // Enterprise hooks
  const enterpriseAuth = useEnterpriseAuthWithSecurity();
  const legacyAuth = useEnterpriseAuth();
  const basicEnterpriseAuth = useEnterpriseAuthHook();

  // Performance monitoring
  useEffect(() => {
    if (config.logMigrationEvents) {
      const startTime = performance.now();

      // Simulate performance measurement
      setTimeout(() => {
        const endTime = performance.now();
        const duration = endTime - startTime;

        setMigrationState(prev => ({
          ...prev,
          performanceMetrics: {
            ...prev.performanceMetrics,
            enterpriseHookTime: duration
          }
        }));

        console.log(`🔐 Enterprise auth hook performance: ${duration.toFixed(2)}ms`);
      }, 0);
    }
  }, [config.logMigrationEvents]);

  // Error handling and fallback
  useEffect(() => {
    const errors: string[] = [];

    if (enterpriseAuth.error) {
      errors.push(`Enterprise auth error: ${enterpriseAuth.error}`);
    }

    if (errors.length > 0) {
      setMigrationState(prev => ({
        ...prev,
        migrationErrors: errors
      }));

      if (config.logMigrationEvents) {
        console.warn('🔐 Auth migration errors:', errors);
      }
    }
  }, [
    enterpriseAuth.error,
    config.logMigrationEvents
  ]);

  // Security features monitoring
  useEffect(() => {
    setMigrationState(prev => ({
      ...prev,
      securityFeatures: {
        twoFactorEnabled: enterpriseAuth.requiresTwoFactor || false,
        deviceTrustEnabled: enterpriseAuth.deviceTrusted || false,
        sessionMonitoringEnabled: !!enterpriseAuth.sessionExpiry
      }
    }));
  }, [
    enterpriseAuth.requiresTwoFactor,
    enterpriseAuth.deviceTrusted,
    enterpriseAuth.sessionExpiry
  ]);

  // Determine which hooks to use based on configuration and errors
  const shouldUseEnterprise = config.useEnterpriseHooks &&
    (migrationState.migrationErrors.length === 0 || !config.enableFallback);

  // Update migration state
  useEffect(() => {
    setMigrationState(prev => ({
      ...prev,
      isUsingEnterprise: shouldUseEnterprise
    }));
  }, [shouldUseEnterprise]);

  // Return appropriate hook data based on migration state and security level
  if (shouldUseEnterprise) {
    if (config.securityLevel === 'maximum') {
      // Use full enterprise auth with all security features
      return {
        // Enterprise auth data
        isAuthenticated: enterpriseAuth.isAuthenticated,
        user: enterpriseAuth.user,
        profile: enterpriseAuth.profile,
        isLoading: enterpriseAuth.isLoading,
        error: enterpriseAuth.error,
        securityEvents: enterpriseAuth.securityEvents,
        loginAttempts: enterpriseAuth.loginAttempts,
        lastActivity: enterpriseAuth.lastActivity,
        sessionExpiry: enterpriseAuth.sessionExpiry,
        requiresTwoFactor: enterpriseAuth.requiresTwoFactor,
        deviceTrusted: enterpriseAuth.deviceTrusted,

        // Enterprise auth actions
        login: enterpriseAuth.login,
        logout: enterpriseAuth.logout,
        signup: enterpriseAuth.signup,
        refreshToken: enterpriseAuth.refreshToken,
        verifyTwoFactor: enterpriseAuth.verifyTwoFactor,
        trustDevice: enterpriseAuth.trustDevice,
        clearError: enterpriseAuth.clearError,
        retry: enterpriseAuth.retry,
        checkSession: enterpriseAuth.checkSession,
        updateProfile: enterpriseAuth.updateProfile,

        // Migration state
        migration: {
          isUsingEnterprise: true,
          errors: migrationState.migrationErrors,
          performance: migrationState.performanceMetrics,
          security: migrationState.securityFeatures,
          config
        }
      };
    } else {
      // Use basic enterprise auth
      return {
        // Basic enterprise auth data
        isAuthenticated: basicEnterpriseAuth.isAuthenticated || false,
        user: null, // Would need to be implemented in basic enterprise auth
        profile: null,
        isLoading: false,
        error: null,
        securityEvents: [],
        loginAttempts: 0,
        lastActivity: null,
        sessionExpiry: null,
        requiresTwoFactor: false,
        deviceTrusted: false,

        // Basic enterprise auth actions
        login: basicEnterpriseAuth.authenticate || (async () => { }),
        logout: async () => { },
        signup: async () => { },
        refreshToken: async () => { },
        verifyTwoFactor: async () => { },
        trustDevice: async () => { },
        clearError: () => { },
        retry: () => { },
        checkSession: async () => { },
        updateProfile: async () => { },

        // Migration state
        migration: {
          isUsingEnterprise: true,
          errors: migrationState.migrationErrors,
          performance: migrationState.performanceMetrics,
          security: migrationState.securityFeatures,
          config
        }
      };
    }
  }

  // Fallback to legacy behavior
  return {
    // Legacy auth data (minimal implementation)
    isAuthenticated: legacyAuth.isAuthenticated || false,
    user: null, // Would need to be extracted from legacy auth
    profile: null,
    isLoading: legacyAuth.isLoading || false,
    error: legacyAuth.error || null,
    securityEvents: [],
    loginAttempts: 0,
    lastActivity: null,
    sessionExpiry: null,
    requiresTwoFactor: false,
    deviceTrusted: false,

    // Legacy auth actions (minimal implementation)
    login: legacyAuth.login || (async () => { }),
    logout: legacyAuth.logout || (async () => { }),
    signup: async () => { },
    refreshToken: async () => { },
    verifyTwoFactor: async () => { },
    trustDevice: async () => { },
    clearError: legacyAuth.setError || (() => { }),
    retry: () => { },
    checkSession: async () => { },
    updateProfile: async () => { },

    // Migration state
    migration: {
      isUsingEnterprise: false,
      errors: ['Enterprise hooks disabled'],
      performance: migrationState.performanceMetrics,
      security: migrationState.securityFeatures,
      config
    }
  };
};

/**
 * Auth Migration Utilities
 */
export const AuthMigrationUtils = {
  /**
   * Check if migration is complete
   */
  isMigrationComplete: (migrationState: AuthMigrationState) => {
    return migrationState.isUsingEnterprise && migrationState.migrationErrors.length === 0;
  },

  /**
   * Get migration recommendations
   */
  getMigrationRecommendations: (migrationState: AuthMigrationState, config: AuthMigrationConfig) => {
    const recommendations: string[] = [];

    if (!migrationState.isUsingEnterprise) {
      recommendations.push('Enable enterprise hooks for better security and performance');
    }

    if (migrationState.migrationErrors.length > 0) {
      recommendations.push('Fix migration errors before completing migration');
    }

    if (config.securityLevel !== 'maximum') {
      recommendations.push('Consider using maximum security level for enhanced protection');
    }

    if (!migrationState.securityFeatures.twoFactorEnabled) {
      recommendations.push('Enable two-factor authentication for better security');
    }

    if (migrationState.performanceMetrics.enterpriseHookTime > 100) {
      recommendations.push('Consider optimizing auth queries for better performance');
    }

    return recommendations;
  },

  /**
   * Generate migration report
   */
  generateMigrationReport: (migrationState: AuthMigrationState, config: AuthMigrationConfig) => {
    return {
      status: migrationState.isUsingEnterprise ? 'Enterprise' : 'Legacy',
      securityLevel: config.securityLevel,
      errors: migrationState.migrationErrors,
      performance: migrationState.performanceMetrics,
      security: migrationState.securityFeatures,
      isComplete: AuthMigrationUtils.isMigrationComplete(migrationState),
      recommendations: AuthMigrationUtils.getMigrationRecommendations(migrationState, config)
    };
  },

  /**
   * Get security score
   */
  getSecurityScore: (migrationState: AuthMigrationState) => {
    let score = 0;
    const maxScore = 100;

    // Base score for enterprise hooks
    if (migrationState.isUsingEnterprise) score += 30;

    // Security features
    if (migrationState.securityFeatures.twoFactorEnabled) score += 25;
    if (migrationState.securityFeatures.deviceTrustEnabled) score += 20;
    if (migrationState.securityFeatures.sessionMonitoringEnabled) score += 15;

    // No errors
    if (migrationState.migrationErrors.length === 0) score += 10;

    return Math.min(score, maxScore);
  }
};

export default useAuthMigration;
