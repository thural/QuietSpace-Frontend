/**
 * Local authentication repository implementation
 * 
 * Implements data access layer for authentication
 * using localStorage for token and session storage.
 */

import { IAuthRepository } from '../interfaces/authInterfaces';
import { AuthSession } from '../types/authTypes';

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
            const token = localStorage.getItem('refreshToken');
            return token;
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
}
