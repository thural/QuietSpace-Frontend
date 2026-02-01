/**
 * Token Provider for DI-based Authentication
 *
 * Provides authentication tokens through dependency injection
 * instead of direct store access, following Black Box pattern.
 */

import type { ITokenProvider } from '../interfaces';

// DI Container interface for type safety
interface IDIContainer {
  getByToken<T>(token: string): T;
}

// Auth service interface for type safety
interface IAuthService {
  getToken(): string | undefined;
  setToken(token: string): void;
  clearToken(): void;
  refreshToken(): Promise<string>;
}

/**
 * DI-based Token Provider Implementation
 *
 * This provider gets tokens from the DI container instead of
 * directly accessing the auth store, maintaining proper separation.
 */
export class TokenProvider implements ITokenProvider {
  private readonly authService: IAuthService | null;
  private readonly container: IDIContainer;

  constructor(container: IDIContainer) {
    this.container = container;
    // Try to get auth service from DI container
    try {
      this.authService = container.getByToken<IAuthService>('AUTH_SERVICE');
    } catch {
      console.warn('Auth service not found in DI container, token provider may not work correctly');
      this.authService = null;
    }
  }

  /**
   * Get current authentication token
   * @returns Current token or null if not authenticated
   */
  getToken(): string | null {
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
   * @param token - New authentication token
   */
  setToken(token: string): void {
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
  clearToken(): void {
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
   * @returns True if token exists and is valid
   */
  isAuthenticated(): boolean {
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
   * @returns New token or null if refresh failed
   */
  async refreshToken(): Promise<string | null> {
    try {
      // Try to refresh through auth service
      if (this.authService?.refreshToken) {
        return await this.authService.refreshToken();
      }

      // Fallback implementation
      const token = this.getToken();
      if (!token) return null;

      // Make refresh request using current API client
      const { createApiClient } = await import('../factory');
      const client = createApiClient();

      const response = await client.post('/auth/refresh-token');
      const newToken = (response.data as { accessToken?: string })?.accessToken;

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
}
