import { useCallback } from 'react';
import { LoginBody, SignupBody } from '@shared/types/auth.dto';
import AuthService from '@core/auth/authService';
import TokenRefreshManager from '@core/auth/tokenRefreshManager';
import { useAuthStore } from '@core/store/zustand';

/**
 * Clean authentication hook with proper separation of concerns
 * 
 * This hook provides authentication operations without:
 * - Callback orchestration
 * - Complex state management
 * - Cross-layer operations
 * 
 * @returns Authentication operations bound to auth store
 */
export const useJwtAuth = () => {
    const {
        login,
        logout,
        setLoading,
        setError,
        setAuthData,
        setIsAuthenticated
    } = useAuthStore();

    /**
     * Authenticates user with credentials
     */
    const authenticate = useCallback(async (credentials: LoginBody) => {
        try {
            setLoading(true);
            setError(null);

            const authData = await AuthService.authenticate(credentials);
            setAuthData(authData);
            setIsAuthenticated(true);
        } catch (error) {
            setError(error instanceof Error ? error : new Error(String(error)));
        } finally {
            setLoading(false);
        }
    }, [login, logout, setLoading, setError, setAuthData, setIsAuthenticated]);

    /**
     * Registers new user
     */
    const signup = useCallback(async (userData: SignupBody) => {
        try {
            setLoading(true);
            setError(null);

            await AuthService.register(userData);
            // Registration successful - navigate to activation
        } catch (error) {
            setError(error instanceof Error ? error : new Error(String(error)));
        } finally {
            setLoading(false);
        }
    }, [setLoading, setError]);

    /**
     * Activates user account
     */
    const activate = useCallback(async (code: string) => {
        try {
            setLoading(true);
            setError(null);

            await AuthService.activate(code);
            // Activation successful - navigate to login
        } catch (error) {
            setError(error instanceof Error ? error : new Error(String(error)));
        } finally {
            setLoading(false);
        }
    }, [setLoading, setError]);

    /**
     * Signs out current user
     */
    const signout = useCallback(async () => {
        try {
            setLoading(true);

            await AuthService.signout();
            logout(); // Reset user data using logout action
            setIsAuthenticated(false);
        } catch (error) {
            setError(error instanceof Error ? error : new Error(String(error)));
        } finally {
            setLoading(false);
        }
    }, [login, setLoading, setError, setIsAuthenticated]);

    /**
     * Initializes token refresh on app startup
     */
    const initializeTokenRefresh = useCallback(async () => {
        try {
            await TokenRefreshManager.startRefresh({
                interval: 490000,
                onSuccess: (data) => {
                    setAuthData(data);
                    setIsAuthenticated(true);
                },
                onError: (error) => {
                    setError(error);
                    setIsAuthenticated(false);
                    TokenRefreshManager.stopRefresh();
                }
            });
        } catch (error) {
            setError(error instanceof Error ? error : new Error(String(error)));
            setIsAuthenticated(false);
        }
    }, [setAuthData, setIsAuthenticated, setError]);

    /**
     * Stops token refresh on logout
     */
    const stopTokenRefresh = useCallback(() => {
        TokenRefreshManager.stopRefresh();
    }, []);

    return {
        authenticate,
        signup,
        activate,
        signout,
        initializeTokenRefresh,
        stopTokenRefresh
    };
};

export default useJwtAuth;