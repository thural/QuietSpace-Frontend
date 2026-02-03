/**
 * Feature Authentication Hook
 *
 * React hook for accessing authentication state in features using DI.
 * This eliminates direct store access and follows Black Box pattern.
 */

import { useCallback } from 'react';

import { useDIContainer } from '../../dependency-injection/providers';
import { createFeatureAuthService } from '../factory/featureAuthFactory';

/**
 * Hook for accessing authentication state in features
 *
 * @returns Authentication state and methods
 */
export const useFeatureAuth = () => {
    const container = useDIContainer();
    const authService = createFeatureAuthService(container);

    const getToken = useCallback(() => {
        return authService.getToken();
    }, [authService]);

    const getAuthData = useCallback(() => {
        return authService.getAuthData();
    }, [authService]);

    const isAuthenticated = useCallback(() => {
        return authService.isAuthenticated();
    }, [authService]);

    const getUserId = useCallback(() => {
        return authService.getUserId();
    }, [authService]);

    const getUserEmail = useCallback(() => {
        return authService.getUserEmail();
    }, [authService]);

    const getAuthHeader = useCallback(() => {
        return authService.getAuthHeader();
    }, [authService]);

    const hasPermission = useCallback((permission: string) => {
        return authService.hasPermission(permission);
    }, [authService]);

    const hasAnyRole = useCallback((roles: string[]) => {
        return authService.hasAnyRole(roles);
    }, [authService]);

    const setToken = useCallback((token: string) => {
        authService.setToken(token);
    }, [authService]);

    const clearAuth = useCallback(() => {
        authService.clearAuth();
    }, [authService]);

    const refreshToken = useCallback(async () => {
        return await authService.refreshToken();
    }, [authService]);

    return {
        // State getters
        token: getToken(),
        authData: getAuthData(),
        isAuthenticated: isAuthenticated(),
        userId: getUserId(),
        userEmail: getUserEmail(),
        authHeader: getAuthHeader(),

        // Permission checks
        hasPermission,
        hasAnyRole,

        // Actions
        setToken,
        clearAuth,
        refreshToken,

        // Raw service access (for advanced usage)
        authService
    };
};

/**
 * Hook for accessing authentication state with reactive updates
 *
 * @returns Authentication state with reactivity
 */
export const useReactiveFeatureAuth = () => {
    const auth = useFeatureAuth();

    // TODO: Add reactivity by listening to auth events
    // This could be implemented using an event system

    return auth;
};
