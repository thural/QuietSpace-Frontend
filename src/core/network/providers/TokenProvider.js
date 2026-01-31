/**
 * Token Provider for DI-based Authentication
 * 
 * Provides authentication tokens through dependency injection
 * instead of direct store access, following Black Box pattern.
 */

/**
 * Token provider interface
 * @typedef {Object} ITokenProvider
 * @property {() => string|null} getToken - Get current token
 * @property {(token: string) => void} setToken - Set token
 * @property {() => void} clearToken - Clear token
 * @property {() => boolean} hasToken - Check if token exists
 * @property {(callback: Function) => Function} subscribe - Subscribe to token changes
 * @property {() => Promise<string|null>} refreshToken - Refresh token
 */

/**
 * DI-based Token Provider Implementation
 * 
 * This provider gets tokens from the DI container instead of
 * directly accessing the auth store, maintaining proper separation.
 */
export class TokenProvider {
  constructor(container) {
    this.container = container;
    // Try to get auth service from DI container
    try {
      this.authService = container.getByToken('AUTH_SERVICE');
    } catch {
      console.warn('Auth service not found in DI container, token provider may not work correctly');
    }
  }

  /**
   * Get current authentication token
   * @returns {string|null} Current token or null if not authenticated
   */
  getToken() {
    try {
      // Try to get token from auth service first
      if (this.authService) {
        return this.authService.getToken?.() || null;
      }

      // Fallback to store access (temporary for backward compatibility)
      // This should be removed once all components use DI
      const { useAuthStore } = require('@/core/store/zustand');
      const { token } = useAuthStore.getState();
      return token || null;
    } catch (error) {
      console.error('Error getting authentication token:', error);
      return null;
    }
  }

  /**
   * Set authentication token
   * @param {string} token - New authentication token
   */
  setToken(token) {
    try {
      // Try to set token through auth service
      if (this.authService) {
        this.authService.setToken?.(token);
        return;
      }

      // Fallback to store access (temporary for backward compatibility)
      const { useAuthStore } = require('@/core/store/zustand');
      useAuthStore.getState().setAuthData({ accessToken: token });
    } catch (error) {
      console.error('Error setting authentication token:', error);
    }
  }

  /**
   * Clear authentication token
   */
  clearToken() {
    try {
      // Try to clear token through auth service
      if (this.authService) {
        this.authService.clearToken?.();
        return;
      }

      // Fallback to store access (temporary for backward compatibility)
      const { useAuthStore } = require('@/core/store/zustand');
      useAuthStore.getState().logout();
    } catch (error) {
      console.error('Error clearing authentication token:', error);
    }
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} True if token exists and is valid
   */
  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;

    // Basic token validation (you can enhance this)
    try {
      // Simple JWT validation (check if token is not expired)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Date.now() / 1000;
      return payload.exp > now;
    } catch {
      // If token is not a valid JWT, just check if it exists
      return token.length > 0;
    }
  }

  /**
   * Refresh authentication token
   * @returns {Promise<string|null>} New token or null if refresh failed
   */
  async refreshToken() {
    try {
      // Try to refresh through auth service
      if (this.authService?.refreshToken) {
        return await this.authService.refreshToken();
      }

      // Fallback implementation
      const token = this.getToken();
      if (!token) return null;

      // Make refresh request using current API client
      const { createApiClient } = await import('../factory.js');
      const client = createApiClient();

      const response = await client.post('/auth/refresh-token');
      const newToken = response.data?.accessToken;

      if (newToken) {
        this.setToken(newToken);
        return newToken;
      }

      return null;
    } catch (error) {
      console.error('Error refreshing authentication token:', error);
      return null;
    }
  }

  /**
   * Check if token exists
   * 
   * @returns {boolean} Whether token exists
   */
  hasToken() {
    return !!this.getToken();
  }

  /**
   * Subscribe to token changes
   * 
   * @param {(token: string|null) => void} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  subscribe(callback) {
    // This would typically integrate with the auth service or store
    // For now, return a no-op function
    return () => { };
  }
}
