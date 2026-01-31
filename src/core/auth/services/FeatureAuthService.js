/**
 * Feature Authentication Service
 * 
 * Provides DI-based authentication services for feature modules.
 * This eliminates direct store access and maintains proper separation of concerns.
 */

import { TokenProvider } from '@core/network/providers/TokenProvider.js';
import { Container } from '@core/di/factory.js';

/**
 * Authentication service for feature modules
 * 
 * Provides clean access to authentication state without direct store access.
 * Follows Black Box pattern and DI principles.
 */
export class FeatureAuthService {
    /** @type {Object} */
    #tokenProvider;

    /**
     * @param {Container} container 
     */
    constructor(container) {
        this.#tokenProvider = new TokenProvider(container);
    }

    /**
     * Get current authentication token
     * @returns {string|null} Authentication token or null if not authenticated
     */
    getToken() {
        return this.#tokenProvider.getToken();
    }

    /**
     * Get current authentication data
     * @returns {Object|null} Authentication data object or null
     */
    getAuthData() {
        const token = this.getToken();
        if (!token) return null;

        // TODO: Parse user data from token or get from auth service
        // For now, return basic token info
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return {
                accessToken: token,
                user: {
                    id: payload.sub || payload.userId,
                    email: payload.email,
                    // Add other user fields as needed
                }
            };
        } catch {
            return { accessToken: token };
        }
    }

    /**
     * Check if user is authenticated
     * @returns {boolean} True if authenticated
     */
    isAuthenticated() {
        return this.#tokenProvider.isAuthenticated();
    }

    /**
     * Get current user ID
     * @returns {string|null} User ID or null if not authenticated
     */
    getUserId() {
        const authData = this.getAuthData();
        return authData?.user?.id || null;
    }

    /**
     * Get current user email
     * @returns {string|null} User email or null if not available
     */
    getUserEmail() {
        const authData = this.getAuthData();
        return authData?.user?.email || null;
    }

    /**
     * Get current user object
     * @returns {Object|null} User object or null if not authenticated
     */
    getUser() {
        const authData = this.getAuthData();
        return authData?.user || null;
    }

    /**
     * Check if user has specific permission
     * @param {string} permission 
     * @returns {boolean} True if user has permission
     */
    hasPermission(permission) {
        const authData = this.getAuthData();
        if (!authData?.user) return false;

        // TODO: Implement proper permission checking
        // For now, return true if authenticated
        return this.isAuthenticated();
    }

    /**
     * Check if user has any of the specified permissions
     * @param {string[]} permissions 
     * @returns {boolean} True if user has any of the permissions
     */
    hasAnyPermission(permissions) {
        const authData = this.getAuthData();
        if (!authData?.user) return false;

        // TODO: Implement proper permission checking
        // For now, return true if authenticated
        return this.isAuthenticated();
    }

    /**
     * Get user roles
     * @returns {string[]} Array of user roles
     */
    getUserRoles() {
        const authData = this.getAuthData();
        if (!authData?.user) return [];

        // TODO: Extract roles from token or user data
        // For now, return empty array
        return [];
    }

    /**
     * Check if user has specific role
     * @param {string} role 
     * @returns {boolean} True if user has role
     */
    hasRole(role) {
        const roles = this.getUserRoles();
        return roles.includes(role);
    }

    /**
     * Refresh authentication token
     * @returns {Promise<boolean>} True if refresh successful
     */
    async refreshToken() {
        try {
            return await this.#tokenProvider.refreshToken();
        } catch (error) {
            console.error('Failed to refresh token:', error);
            return false;
        }
    }

    /**
     * Sign out user
     * @returns {Promise<boolean>} True if signout successful
     */
    async signout() {
        try {
            return await this.#tokenProvider.signout();
        } catch (error) {
            console.error('Failed to sign out:', error);
            return false;
        }
    }
}
