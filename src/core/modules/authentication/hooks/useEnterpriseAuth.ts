/**
 * Enterprise Authentication Hook
 *
 * Provides comprehensive authentication operations using the core authentication module.
 * This hook eliminates direct auth state access and enforces enterprise patterns.
 */

import { useCallback, useState } from 'react';
import { createDefaultAuthService } from '../factory';
import { useFeatureAuth } from './useFeatureAuth';

import type { AuthCredentials } from '../types/auth.domain.types';

// Define signup body type for compatibility
interface SignupBody {
    email: string;
    password: string;
    username?: string;
    firstName?: string;
    lastName?: string;
}

interface LoginBody {
    email: string;
    password: string;
}

/**
 * Enterprise authentication hook with full functionality
 *
 * Provides all authentication operations through the core auth module,
 * eliminating direct state access and enforcing enterprise patterns.
 */
export const useEnterpriseAuth = () => {
    const authService = createDefaultAuthService();
    const featureAuth = useFeatureAuth();

    // React state for loading and error management
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    /**
     * Authenticates user with credentials
     */
    const authenticate = useCallback(async (credentials: LoginBody) => {
        try {
            setIsLoading(true);
            setError(null);

            const authCredentials: AuthCredentials = {
                email: credentials.email,
                password: credentials.password,
                username: credentials.email, // Use email as username for JWT
                type: 'jwt'
            };

            const result = await authService.authenticate('jwt', authCredentials);

            if (result.success && result.data) {
                // Store session using feature auth
                featureAuth.setToken(result.data.token.accessToken);
                return result.data;
            } else {
                throw new Error(result.error?.message || 'Authentication failed');
            }
        } catch (error) {
            const authError = error instanceof Error ? error : new Error(String(error));
            setError(authError);
            throw authError;
        } finally {
            setIsLoading(false);
        }
    }, [authService, featureAuth]);

    /**
     * Registers new user
     */
    const signup = useCallback(async (userData: SignupBody) => {
        try {
            setIsLoading(true);
            setError(null);

            const authCredentials: AuthCredentials = {
                email: userData.email,
                password: userData.password,
                username: userData.username || userData.email,
                type: 'jwt'
            };

            const result = await authService.register(authCredentials);

            if (result.success) {
                return result.data;
            } else {
                throw new Error(result.error?.message || 'Registration failed');
            }
        } catch (error) {
            const authError = error instanceof Error ? error : new Error(String(error));
            setError(authError);
            throw authError;
        } finally {
            setIsLoading(false);
        }
    }, [authService]);

    /**
     * Activates user account
     */
    const activate = useCallback(async (code: string) => {
        try {
            setIsLoading(true);
            setError(null);

            const result = await authService.activate(code);

            if (result.success && result.data) {
                // Store session from activation
                featureAuth.setToken(result.data.token.accessToken);
                return result.data;
            } else {
                throw new Error(result.error?.message || 'Activation failed');
            }
        } catch (error) {
            const authError = error instanceof Error ? error : new Error(String(error));
            setError(authError);
            throw authError;
        } finally {
            setIsLoading(false);
        }
    }, [authService, featureAuth]);

    /**
     * Signs out current user
     */
    const signout = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            await authService.globalSignout();
            featureAuth.clearAuth();
        } catch (error) {
            const authError = error instanceof Error ? error : new Error(String(error));
            setError(authError);
            // Always clear local auth even if server signout fails
            featureAuth.clearAuth();
            throw authError;
        } finally {
            setIsLoading(false);
        }
    }, [authService, featureAuth]);

    /**
     * Refreshes authentication token
     */
    const refreshToken = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const result = await featureAuth.refreshToken();

            if (result) {
                return result;
            } else {
                throw new Error('Token refresh failed');
            }
        } catch (error) {
            const authError = error instanceof Error ? error : new Error(String(error));
            setError(authError);
            throw authError;
        } finally {
            setIsLoading(false);
        }
    }, [featureAuth]);

    /**
     * Resends activation code
     */
    const resendActivationCode = useCallback(async (email: string) => {
        try {
            setIsLoading(true);
            setError(null);

            const result = await authService.resendActivationCode(email);

            if (result.success) {
                return result;
            } else {
                throw new Error(result.error?.message || 'Failed to resend activation code');
            }
        } catch (error) {
            const authError = error instanceof Error ? error : new Error(String(error));
            setError(authError);
            throw authError;
        } finally {
            setIsLoading(false);
        }
    }, [authService]);

    /**
     * Handles authentication failure
     */
    const handleAuthFailure = useCallback(() => {
        featureAuth.clearAuth();
        setError(new Error('Authentication expired. Please login again.'));
    }, [featureAuth]);

    /**
     * Validates current session
     */
    const validateSession = useCallback(async () => {
        try {
            if (!featureAuth.isAuthenticated) {
                return false;
            }

            const token = featureAuth.token;
            if (!token) {
                handleAuthFailure();
                return false;
            }

            // Basic token validation - in a real implementation, this would validate with the server
            const tokenParts = token.split('.');
            if (tokenParts.length !== 3) {
                handleAuthFailure();
                return false;
            }

            try {
                const payload = JSON.parse(atob(tokenParts[1]!));
                const now = Date.now() / 1000;

                // Check if token is expired
                if (payload.exp && payload.exp < now) {
                    await refreshToken();
                    return true;
                }

                return true;
            } catch (error) {
                handleAuthFailure();
                return false;
            }
        } catch (error) {
            handleAuthFailure();
            return false;
        }
    }, [featureAuth, handleAuthFailure, refreshToken]);

    return {
        // Authentication operations
        authenticate,
        signup,
        activate,
        signout,
        refreshToken,
        resendActivationCode,

        // State from feature auth
        token: featureAuth.token,
        authData: featureAuth.authData,
        isAuthenticated: featureAuth.isAuthenticated,
        userId: featureAuth.userId,
        userEmail: featureAuth.userEmail,
        authHeader: featureAuth.authHeader,

        // Permission checks
        hasPermission: featureAuth.hasPermission,
        hasAnyRole: featureAuth.hasAnyRole,

        // React state
        isLoading,
        error,
        setIsLoading,
        setError,

        // Utility methods
        handleAuthFailure,
        validateSession,

        // Raw service access (for advanced usage)
        authService,
        featureAuth
    };
};

/**
 * Default export for convenience
 */
export default useEnterpriseAuth;
