import { AuthResponse } from '@auth';
import { fetchAccessToken } from '@auth/data/authRequests';
import { getRefreshToken } from '@shared/utils/authStoreUtils';

/**
 * Token refresh management service
 * 
 * Handles automatic token refresh without business logic or state management
 */
class TokenRefreshManager {
    private static intervalId: number = 0;

    /**
     * Starts automatic token refresh
     * 
     * @param options - Refresh configuration
     */
    static async startRefresh(options: {
        interval?: number;
        onSuccess?: (data: AuthResponse) => void;
        onError?: (error: Error) => void;
    } = {}): Promise<void> {
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
     */
    static stopRefresh(): void {
        if (this.intervalId) {
            window.clearInterval(this.intervalId);
            this.intervalId = 0;
        }
    }

    /**
     * Manually refreshes the access token
     * 
     * @param onSuccess - Success callback
     * @param onError - Error callback
     */
    private static async refreshToken(
        onSuccess?: (data: AuthResponse) => void,
        onError?: (error: Error) => void
    ): Promise<void> {
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
