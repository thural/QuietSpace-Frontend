/**
 * Feature Authentication Service
 *
 * Provides DI-based authentication services for feature modules.
 * This eliminates direct store access and maintains proper separation of concerns.
 */

import { TokenProvider } from '../../network/providers/TokenProvider';

import type { Container } from '../../di/factory';
import type { ITokenProvider } from '../../network/interfaces';

/**
 * Authentication service for feature modules
 *
 * Provides clean access to authentication state without direct store access.
 * Follows Black Box pattern and DI principles.
 */
export class FeatureAuthService {
    private readonly tokenProvider: ITokenProvider;

    constructor(container: Container) {
        this.tokenProvider = new TokenProvider(container);
    }

    /**
     * Get current authentication token
     * @returns Authentication token or null if not authenticated
     */
    getToken(): string | null {
        return this.tokenProvider.getToken();
    }

    /**
     * Get current authentication data
     * @returns Authentication data object or null
     */
    getAuthData(): { accessToken: string; user?: any } | null {
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
                    email: payload.email
                    // Add other user fields as needed
                }
            };
        } catch {
            return { accessToken: token };
        }
    }

    /**
     * Check if user is authenticated
     * @returns True if authenticated
     */
    isAuthenticated(): boolean {
        return this.tokenProvider.isAuthenticated();
    }

    /**
     * Get current user ID
     * @returns User ID or null if not authenticated
     */
    getUserId(): string | null {
        const authData = this.getAuthData();
        return authData?.user?.id || null;
    }

    /**
     * Get current user email
     * @returns User email or null if not available
     */
    getUserEmail(): string | null {
        const authData = this.getAuthData();
        return authData?.user?.email || null;
    }

    /**
     * Set authentication token
     * @param token - New authentication token
     */
    setToken(token: string): void {
        this.tokenProvider.setToken(token);
    }

    /**
     * Clear authentication
     */
    clearAuth(): void {
        this.tokenProvider.clearToken();
    }

    /**
     * Refresh authentication token
     * @returns New token or null if refresh failed
     */
    async refreshToken(): Promise<string | null> {
        return await this.tokenProvider.refreshToken();
    }

    /**
     * Get authorization header value
     * @returns Authorization header value or null
     */
    getAuthHeader(): { Authorization: string } | null {
        const token = this.getToken();
        return token ? { Authorization: `Bearer ${token}` } : null;
    }

    /**
     * Check if user has specific permission
     * @param permission - Permission to check
     * @returns True if user has permission
     */
    hasPermission(permission: string): boolean {
        // TODO: Implement permission checking logic
        // For now, return true if authenticated
        return this.isAuthenticated();
    }

    /**
     * Check if user has any of the specified roles
     * @param roles - Roles to check
     * @returns True if user has any of the roles
     */
    hasAnyRole(roles: string[]): boolean {
        // TODO: Implement role checking logic
        // For now, return true if authenticated
        return this.isAuthenticated();
    }
}
