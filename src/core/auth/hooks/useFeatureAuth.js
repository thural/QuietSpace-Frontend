/**
 * Feature Authentication Hook
 * 
 * React hook for accessing authentication state in features using DI.
 * This eliminates direct store access and follows Black Box pattern.
 */

import { useCallback } from 'react';
import { useDIContainer } from '@core/di/index.js';
import { createFeatureAuthService } from '../factory/featureAuthFactory.js';

/**
 * Hook for accessing authentication state in features
 * 
 * @returns {Object} Authentication state and methods
 * @property {string} token - Authentication token
 * @property {*} authData - Authentication data
 * @property {boolean} isAuthenticated - Authentication status
 * @property {string} userId - User ID
 * @property {string} userEmail - User email
 * @property {string} authHeader - Authorization header
 * @property {Function} hasPermission - Permission check function
 * @property {Function} hasAnyRole - Role check function
 * @property {Function} setToken - Set token function
 * @property {Function} clearAuth - Clear auth function
 * @property {Function} refreshToken - Refresh token function
 * @property {*} authService - Raw auth service instance
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

    const hasPermission = useCallback((permission) => {
        return authService.hasPermission(permission);
    }, [authService]);

    const hasAnyRole = useCallback((roles) => {
        return authService.hasAnyRole(roles);
    }, [authService]);

    const setToken = useCallback((token) => {
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
 * @returns {Object} Authentication state with reactivity
 */
export const useReactiveFeatureAuth = () => {
    const auth = useFeatureAuth();

    // TODO: Add reactivity by listening to auth events
    // This could be implemented using an event system

    return auth;
};
