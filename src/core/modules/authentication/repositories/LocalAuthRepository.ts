/**
 * Local authentication repository implementation
 *
 * Implements data access layer for authentication
 * using localStorage for token and session storage.
 */

import type { IAuthRepository } from '../interfaces/authInterfaces';
import type { AuthSession, AuthResult } from '../types/auth.domain.types';
import { AuthErrorType } from '../types/auth.domain.types';

/**
 * Local authentication repository
 */
export class LocalAuthRepository implements IAuthRepository {
    /**
     * Stores authentication session
     */
    async storeSession(session: AuthSession): Promise<void> {
        try {
            const sessionData = {
                user: session.user,
                token: session.token,
                provider: session.provider,
                createdAt: session.createdAt,
                expiresAt: session.expiresAt,
                isActive: session.isActive,
                metadata: session.metadata
            };

            localStorage.setItem('authSession', JSON.stringify(sessionData));
        } catch (error) {
            console.error('Failed to store session:', error);
            throw error;
        }
    }

    /**
     * Retrieves stored session
     */
    async getSession(): Promise<AuthSession | null> {
        try {
            const sessionData = localStorage.getItem('authSession');
            if (!sessionData) {
                return null;
            }

            const session = JSON.parse(sessionData) as AuthSession;

            // Validate session expiration
            if (new Date() > session.expiresAt) {
                await this.removeSession();
                return null;
            }

            return session;
        } catch (error) {
            console.error('Failed to retrieve session:', error);
            return null;
        }
    }

    /**
     * Removes stored session
     */
    async removeSession(): Promise<void> {
        try {
            localStorage.removeItem('authSession');
        } catch (error) {
            console.error('Failed to remove session:', error);
            throw error;
        }
    }

    /**
     * Stores refresh token
     */
    async storeRefreshToken(token: string): Promise<void> {
        try {
            localStorage.setItem('refreshToken', token);
        } catch (error) {
            console.error('Failed to store refresh token:', error);
            throw error;
        }
    }

    /**
     * Retrieves refresh token
     */
    async getRefreshToken(): Promise<string | null> {
        try {
            return localStorage.getItem('refreshToken');
        } catch (error) {
            console.error('Failed to retrieve refresh token:', error);
            return null;
        }
    }

    /**
     * Clears all authentication data
     */
    async clear(): Promise<void> {
        try {
            localStorage.removeItem('authSession');
            localStorage.removeItem('refreshToken');
        } catch (error) {
            console.error('Failed to clear auth data:', error);
            throw error;
        }
    }

    /**
     * Creates new user account
     */
    async createUser(userData: unknown): Promise<AuthResult<unknown>> {
        try {
            // In a real implementation, this would call an API
            // For now, simulate user creation
            console.log('Creating user:', userData);

            return {
                success: true,
                data: userData
            };
        } catch (error) {
            console.error('Failed to create user:', error);
            return {
                success: false,
                error: {
                    type: AuthErrorType.SERVER_ERROR,
                    message: 'Failed to create user account',
                    details: error as Record<string, unknown>
                }
            };
        }
    }

    /**
     * Activates user account with code
     */
    async activateUser(code: string): Promise<AuthResult<void>> {
        try {
            // In a real implementation, this would call an API
            // For now, simulate activation
            console.log('Activating user with code:', code);

            return {
                success: true,
                data: undefined
            };
        } catch (error) {
            console.error('Failed to activate user:', error);
            return {
                success: false,
                error: {
                    type: AuthErrorType.SERVER_ERROR,
                    message: 'Failed to activate account',
                    details: error as Record<string, unknown>
                }
            };
        }
    }

    /**
     * Resends activation code to user
     */
    async resendActivationCode(email: string): Promise<AuthResult<void>> {
        try {
            // In a real implementation, this would call an API
            // For now, simulate resend
            console.log('Resending activation code to:', email);

            return {
                success: true,
                data: undefined
            };
        } catch (error) {
            console.error('Failed to resend activation code:', error);
            return {
                success: false,
                error: {
                    type: AuthErrorType.SERVER_ERROR,
                    message: 'Failed to resend activation code',
                    details: error as Record<string, unknown>
                }
            };
        }
    }

    /**
     * Refreshes authentication token with user data
     */
    async refreshToken(): Promise<AuthResult<AuthSession>> {
        try {
            const refreshToken = await this.getRefreshToken();
            if (!refreshToken) {
                return {
                    success: false,
                    error: {
                        type: AuthErrorType.TOKEN_EXPIRED,
                        message: 'No refresh token available'
                    }
                };
            }

            // In a real implementation, this would call an API
            // For now, simulate token refresh by extending current session
            const currentSession = await this.getSession();
            if (!currentSession) {
                return {
                    success: false,
                    error: {
                        type: AuthErrorType.TOKEN_INVALID,
                        message: 'No active session to refresh'
                    }
                };
            }

            // Extend session expiration
            const newExpiration = new Date();
            newExpiration.setHours(newExpiration.getHours() + 24); // Add 24 hours

            const refreshedSession: AuthSession = {
                ...currentSession,
                expiresAt: newExpiration,
                isActive: true,
                metadata: {
                    ...currentSession.metadata,
                    refreshedAt: new Date(),
                    lastActivity: new Date(),
                    ipAddress: currentSession.metadata?.ipAddress || 'unknown',
                    userAgent: currentSession.metadata?.userAgent || 'unknown'
                }
            };

            // Store the refreshed session
            await this.storeSession(refreshedSession);

            return {
                success: true,
                data: refreshedSession
            };
        } catch (error) {
            console.error('Failed to refresh token:', error);
            return {
                success: false,
                error: {
                    type: AuthErrorType.NETWORK_ERROR,
                    message: 'Failed to refresh authentication token',
                    details: error as Record<string, unknown>
                }
            };
        }
    }
}
