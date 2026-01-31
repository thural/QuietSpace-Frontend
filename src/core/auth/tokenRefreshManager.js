import { AuthResponse } from '@auth/index.js';
import { fetchAccessToken } from '@auth/data/authRequests.js';
import { getRefreshToken } from '@shared/utils/authStoreUtils.js';

/**
 * Authentication response interface
 * @typedef {Object} AuthResponse
 * @property {string} id - User ID
 * @property {string} accessToken - Access token
 * @property {string} refreshToken - Refresh token
 * @property {string} userId - User ID
 * @property {string} message - Response message
 */

/**
 * Token refresh options interface
 * @typedef {Object} TokenRefreshOptions
 * @property {number} [interval] - Refresh interval in milliseconds
 * @property {Function} [onSuccess] - Success callback
 * @property {Function} [onError] - Error callback
 */

/**
 * Token refresh management service
 * 
 * Handles automatic token refresh without business logic or state management
 */
class TokenRefreshManager {
    static intervalId = 0;

    /**
     * Starts automatic token refresh
     * 
     * @param {TokenRefreshOptions} options - Refresh configuration
     * @returns {Promise<void>}
     */
    static async startRefresh(options = {}) {
        this.stopRefresh();

        const { interval = 540000, onSuccess, onError } = options;

        // Initial token fetch
        await this.refreshToken(onSuccess, onError);

        // Set up periodic refresh
        this.intervalId = window.setInterval(
            () => this.refreshToken(onSuccess, onError),
            interval
        );
    }

    /**
     * Stops automatic token refresh
     * @returns {void}
     */
    static stopRefresh() {
        if (this.intervalId) {
            window.clearInterval(this.intervalId);
            this.intervalId = 0;
        }
    }

    /**
     * Manually refreshes the access token
     * 
     * @param {Function} onSuccess - Success callback
     * @param {Function} onError - Error callback
     * @returns {Promise<void>}
     */
    static async refreshToken(onSuccess, onError) {
        try {
            const refreshToken = getRefreshToken();
            const data = await fetchAccessToken(refreshToken);
            onSuccess?.(data);
        } catch (error) {
            onError?.(error instanceof Error ? error : new Error(String(error)));
        }
    }
}

export default TokenRefreshManager;
