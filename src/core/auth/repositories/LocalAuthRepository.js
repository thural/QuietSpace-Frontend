/**
 * Local authentication repository implementation
 * 
 * Implements data access layer for authentication
 * using localStorage for token and session storage.
 */

// Import types via JSDoc typedefs
/**
 * @typedef {import('../interfaces/authInterfaces.js').IAuthRepository} IAuthRepository
 * @typedef {import('../types/auth.domain.types.js').AuthSession} AuthSession
 */

/**
 * Local authentication repository
 * 
 * @class LocalAuthRepository
 * @description Local storage-based repository for authentication data
 */
export class LocalAuthRepository {
    /**
     * Stores authentication session
     * 
     * @param {AuthSession} session 
     * @returns {Promise<void>}
     */
    async storeSession(session) {
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
     * 
     * @returns {Promise<AuthSession|null>} Stored session or null if not found
     */
    async getSession() {
        try {
            const sessionData = localStorage.getItem('authSession');
            if (!sessionData) {
                return null;
            }

            const session = JSON.parse(sessionData);

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
     * 
     * @returns {Promise<void>}
     */
    async removeSession() {
        try {
            localStorage.removeItem('authSession');
        } catch (error) {
            console.error('Failed to remove session:', error);
            throw error;
        }
    }

    /**
     * Stores authentication token
     * 
     * @param {string} token 
     * @returns {Promise<void>}
     */
    async storeToken(token) {
        try {
            localStorage.setItem('authToken', token);
        } catch (error) {
            console.error('Failed to store token:', error);
            throw error;
        }
    }

    /**
     * Retrieves stored token
     * 
     * @returns {Promise<string|null>} Stored token or null if not found
     */
    async getToken() {
        try {
            return localStorage.getItem('authToken');
        } catch (error) {
            console.error('Failed to retrieve token:', error);
            return null;
        }
    }

    /**
     * Removes stored token
     * 
     * @returns {Promise<void>}
     */
    async removeToken() {
        try {
            localStorage.removeItem('authToken');
        } catch (error) {
            console.error('Failed to remove token:', error);
            throw error;
        }
    }

    /**
     * Stores user preferences
     * 
     * @param {Object} preferences 
     * @returns {Promise<void>}
     */
    async storeUserPreferences(preferences) {
        try {
            localStorage.setItem('authPreferences', JSON.stringify(preferences));
        } catch (error) {
            console.error('Failed to store user preferences:', error);
            throw error;
        }
    }

    /**
     * Retrieves user preferences
     * 
     * @returns {Promise<Object|null>} User preferences or null if not found
     */
    async getUserPreferences() {
        try {
            const preferencesData = localStorage.getItem('authPreferences');
            if (!preferencesData) {
                return null;
            }
            return JSON.parse(preferencesData);
        } catch (error) {
            console.error('Failed to retrieve user preferences:', error);
            return null;
        }
    }

    /**
     * Clears all authentication data
     * 
     * @returns {Promise<void>}
     */
    async clearAll() {
        try {
            localStorage.removeItem('authSession');
            localStorage.removeItem('authToken');
            localStorage.removeItem('authPreferences');
        } catch (error) {
            console.error('Failed to clear authentication data:', error);
            throw error;
        }
    }

    /**
     * Checks if session exists
     * 
     * @returns {Promise<boolean>} True if session exists and is valid
     */
    async hasSession() {
        const session = await this.getSession();
        return session !== null;
    }

    /**
     * Gets session expiration time
     * 
     * @returns {Promise<Date|null>} Session expiration time or null if no session
     */
    async getSessionExpiration() {
        const session = await this.getSession();
        return session ? session.expiresAt : null;
    }

    /**
     * Validates session integrity
     * 
     * @returns {Promise<boolean>} True if session is valid
     */
    async validateSession() {
        const session = await this.getSession();
        if (!session) {
            return false;
        }

        // Check if session is expired
        if (new Date() > session.expiresAt) {
            await this.removeSession();
            return false;
        }

        // Check if session is active
        return session.isActive;
    }
}
