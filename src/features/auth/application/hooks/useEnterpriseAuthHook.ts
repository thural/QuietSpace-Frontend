import { useCallback } from 'react';
import { LoginBody, SignupBody } from '@shared/types/auth.dto';
import { useService } from '@core/modules/dependency-injection';
import { TYPES } from '@core/modules/dependency-injection/types';
import { EnterpriseAuthAdapter } from '@core/modules/authentication/adapters/EnterpriseAuthAdapter';
import { useAuthStore } from '@core/modules/state-management/zustand';

/**
 * Enterprise authentication hook using the enterprise auth service
 * from the dependency injection container.
 * 
 * Provides enhanced authentication with enterprise features:
 * - Advanced security monitoring
 * - Comprehensive logging
 * - Metrics collection
 * - Plugin support
 */
export const useEnterpriseAuthHook = () => {
    const {
        logout,
        setLoading,
        setError,
        setAuthData
    } = useAuthStore();

    const container = useService(TYPES.AUTH_CONTAINER) as any;
    const authAdapter = container.get(EnterpriseAuthAdapter);

    /**
     * Authenticates user with credentials using enterprise auth service
     */
    const authenticate = useCallback(async (credentials: LoginBody) => {
        try {
            setLoading(true);
            setError(null);

            // Use enterprise auth adapter for authentication
            const authData = await authAdapter.authenticate(credentials);
            setAuthData(authData);
        } catch (error) {
            setError(error instanceof Error ? error : new Error(String(error)));
        } finally {
            setLoading(false);
        }
    }, [authAdapter, setLoading, setError, setAuthData]);

    /**
     * Registers new user with enterprise validation
     */
    const signup = useCallback(async (userData: SignupBody) => {
        try {
            setLoading(true);
            setError(null);

            // Use enterprise auth adapter for registration
            await authAdapter.register(userData);
        } catch (error) {
            setError(error instanceof Error ? error : new Error(String(error)));
        } finally {
            setLoading(false);
        }
    }, [authAdapter, setLoading, setError]);

    /**
     * Activates user account with enterprise security
     */
    const activate = useCallback(async (code: string) => {
        try {
            setLoading(true);
            setError(null);

            await authAdapter.activate(code);
        } catch (error) {
            setError(error instanceof Error ? error : new Error(String(error)));
        } finally {
            setLoading(false);
        }
    }, [authAdapter, setLoading, setError]);

    /**
     * Signs out current user with enterprise cleanup
     */
    const signout = useCallback(async () => {
        try {
            setLoading(true);

            await authAdapter.signout();
            logout();
        } catch (error) {
            setError(error instanceof Error ? error : new Error(String(error)));
        } finally {
            setLoading(false);
        }
    }, [authAdapter, logout, setLoading, setError]);

    /**
     * Gets security metrics from enterprise auth service
     */
    const getSecurityMetrics = useCallback(() => {
        return authAdapter.getSecurityMetrics();
    }, [authAdapter]);

    /**
     * Validates session with enterprise security checks
     */
    const validateSession = useCallback(async () => {
        try {
            const result = await authAdapter.validateSession();
            return result.success;
        } catch {
            return false;
        }
    }, [authAdapter]);

    return {
        authenticate,
        signup,
        activate,
        signout,
        getSecurityMetrics,
        validateSession
    };
};

export default useEnterpriseAuthHook;
