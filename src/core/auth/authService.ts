import { AuthResponse } from '../../features/auth/data/models/auth';
import { LoginBody, SignupBody } from '../../shared/types/authTypes';
import {
    fetchAccessToken,
    fetchActivation,
    fetchLogin,
    fetchLogout,
    fetchSignup
} from '../../features/auth/data/authRequests';
import {
    clearAuthTokens,
    getRefreshToken,
    setRefreshToken
} from '../../shared/utils/authStoreUtils';

/**
 * Abstract base authentication service
 * 
 * Provides common authentication functionality and enforces
 * consistent implementation across authentication services.
 */
abstract class BaseAuthService {
    /**
     * Validates user credentials format
     * 
     * @param credentials - User credentials to validate
     * @returns boolean - Whether credentials are valid
     */
    protected static validateCredentials(credentials: LoginBody): boolean {
        return !!(credentials.email && credentials.password);
    }

    /**
     * Handles authentication errors consistently
     * 
     * @param error - Error to handle
     * @throws Error - Processed error with additional context
     */
    protected static handleAuthError(error: unknown): never {
        if (error instanceof Error) {
            throw new Error(`Authentication failed: ${error.message}`);
        }
        throw new Error('Authentication failed: Unknown error occurred');
    }

    /**
     * Logs authentication attempts for audit purposes
     * 
     * @param action - Authentication action being performed
     * @param details - Additional details about the attempt
     */
    protected static logAuthAttempt(action: string, details?: object): void {
        console.log(`[AuthService] ${action}`, {
            timestamp: new Date().toISOString(),
            details
        });
    }
}

/**
 * Concrete authentication service implementation
 * 
 * Extends BaseAuthService to provide JWT-based authentication
 * with proper separation of concerns and error handling.
 */
export class AuthService extends BaseAuthService {
    /**
     * Authenticates a user with credentials
     * 
     * @param credentials - User login credentials
     * @returns Promise<AuthResponse> - Authentication response with tokens
     */
    static async authenticate(credentials: LoginBody): Promise<AuthResponse> {
        try {
            // Validate credentials before proceeding
            if (!this.validateCredentials(credentials)) {
                throw new Error('Invalid credentials format');
            }

            // Log authentication attempt
            this.logAuthAttempt('login', { email: credentials.email });

            const response = await fetchLogin(credentials);
            setRefreshToken(response.refreshToken);

            this.logAuthAttempt('login_success', { userId: response.userId });
            return response;
        } catch (error) {
            throw this.handleAuthError(error);
        }
    }

    /**
     * Registers a new user
     * 
     * @param userData - User registration data
     * @returns Promise<void> - Registration completion
     */
    static async register(userData: SignupBody): Promise<void> {
        try {
            // Log registration attempt
            this.logAuthAttempt('register', { email: userData.email });

            await fetchSignup(userData);

            this.logAuthAttempt('register_success');
        } catch (error) {
            throw this.handleAuthError(error);
        }
    }

    /**
     * Activates a user account
     * 
     * @param code - Activation code
     * @returns Promise<void> - Activation completion
     */
    static async activate(code: string): Promise<void> {
        try {
            // Validate activation code format
            if (!code || code.trim().length === 0) {
                throw new Error('Invalid activation code format');
            }

            // Log activation attempt
            this.logAuthAttempt('activate', { code: code.substring(0, 4) + '***' });

            await fetchActivation(code);

            this.logAuthAttempt('activate_success');
        } catch (error) {
            throw this.handleAuthError(error);
        }
    }

    /**
     * Signs out current user
     * 
     * @returns Promise<void> - Logout completion
     */
    static async signout(): Promise<void> {
        try {
            // Log logout attempt
            this.logAuthAttempt('logout');

            const refreshToken = getRefreshToken();
            await fetchLogout(refreshToken);

            // Clear tokens regardless of API call success
            clearAuthTokens();

            this.logAuthAttempt('logout_success');
        } catch (error) {
            throw this.handleAuthError(error);
        }
    }

    /**
     * Refreshes access token using refresh token
     * 
     * @returns Promise<AuthResponse> - New authentication response
     */
    static async refreshAccessToken(): Promise<AuthResponse> {
        try {
            // Log refresh attempt
            this.logAuthAttempt('token_refresh');

            const refreshToken = getRefreshToken();
            const response = await fetchAccessToken(refreshToken);

            this.logAuthAttempt('token_refresh_success');
            return response;
        } catch (error) {
            throw this.handleAuthError(error);
        }
    }

    /**
     * Gets current authentication status
     * 
     * @returns boolean - Whether user has valid refresh token
     */
    static hasValidRefreshToken(): boolean {
        try {
            const refreshToken = getRefreshToken();
            return !!refreshToken && refreshToken.length > 0;
        } catch {
            return false;
        }
    }

    /**
     * Validates authentication token format
     * 
     * @param token - Token to validate
     * @returns boolean - Whether token format is valid
     */
    static isValidTokenFormat(token: string): boolean {
        return !!token && token.split('.').length === 3;
    }
}

export default AuthService;
