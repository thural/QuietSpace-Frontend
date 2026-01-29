/**
 * Retrieves the refresh token using centralized authentication.
 *
 * @returns {string} - The refresh token from centralized auth.
 * @throws {Error} - Throws an error if the refresh token is not found.
 */
export const getRefreshToken = (): string => {
    try {
        // Use centralized auth service instead of direct localStorage access
        const authModule = require('@/core/auth/AuthModule');
        const authService = authModule.AuthModuleFactory.getInstance();
        
        // Get refresh token from centralized auth repository
        return authService.getRefreshToken();
    } catch (error) {
        console.error('Error getting refresh token from centralized auth:', error);
        throw new Error("Failed to retrieve refresh token from centralized auth");
    }
}

/**
 * Clears the refresh token using centralized authentication.
 *
 * This function removes the refresh token using the centralized auth service,
 * effectively logging out the user.
 */
export const clearRefreshToken = (): void => {
    try {
        // Use centralized auth service instead of direct localStorage access
        const authModule = require('@/core/auth/AuthModule');
        const authService = authModule.AuthModuleFactory.getInstance();
        
        // Clear refresh token through centralized auth
        authService.clear();
    } catch (error) {
        console.error('Error clearing refresh token through centralized auth:', error);
    }
}

/**
 * Clears the access token using centralized authentication.
 *
 * This function removes the access token using the centralized auth service.
 */
export const clearAccessToken = (): void => {
    try {
        // Use centralized auth service instead of direct localStorage access
        const authModule = require('@/core/auth/AuthModule');
        const authService = authModule.AuthModuleFactory.getInstance();
        
        // Clear tokens through centralized auth
        authService.clear();
    } catch (error) {
        console.error('Error clearing access token through centralized auth:', error);
    }
}

/**
 * Clears both the refresh and access tokens using centralized authentication.
 *
 * This function uses the centralized auth service to clear all authentication tokens,
 * effectively logging out the user.
 */
export const clearAuthTokens = (): void => {
    try {
        // Use centralized auth service instead of direct localStorage access
        const authModule = require('@/core/auth/AuthModule');
        const authService = authModule.AuthModuleFactory.getInstance();
        
        // Clear all tokens through centralized auth
        authService.clear();
    } catch (error) {
        console.error('Error clearing auth tokens through centralized auth:', error);
    }
}

/**
 * Sets the refresh token using centralized authentication.
 *
 * @param {string} token - The refresh token to be stored.
 */
export const setRefreshToken = (token: string): void => {
    try {
        // Use centralized auth service instead of direct localStorage access
        const authModule = require('@/core/auth/AuthModule');
        const authService = authModule.AuthModuleFactory.getInstance();
        
        // Store refresh token through centralized auth
        authService.storeRefreshToken(token);
    } catch (error) {
        console.error('Error setting refresh token through centralized auth:', error);
    }
}