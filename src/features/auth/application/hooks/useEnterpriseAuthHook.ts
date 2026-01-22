import { useCallback } from 'react';
import { LoginBody, SignupBody } from '@shared/types/auth.dto';
import { useService } from '@core/di';
import { EnterpriseAuthAdapter } from '@core/auth/adapters/EnterpriseAuthAdapter';
import { useAuthStore } from '@core/store/zustand';

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
        login,
        logout,
        setLoading,
        setError,
        setAuthData,
        setIsAuthenticated
    } = useAuthStore();

    const authAdapter = useService(EnterpriseAuthAdapter);

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
            setIsAuthenticated(true);
        } catch (error) {
            setError(error instanceof Error ? error : new Error(String(error)));
        } finally {
            setLoading(false);
        }
    }, [authAdapter, setLoading, setError, setAuthData, setIsAuthenticated]);

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
            setIsAuthenticated(false);
        } catch (error) {
            setError(error instanceof Error ? error : new Error(String(error)));
        } finally {
            setLoading(false);
        }
    }, [authAdapter, logout, setLoading, setError, setIsAuthenticated]);

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
