import { EnterpriseAuthService } from '../enterprise/AuthService.js';
import { AuthResponse } from '@features/auth/data/models/auth.js';
import { LoginBody, SignupBody } from '@shared/types/auth.dto.js';

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
 * Login body interface
 * @typedef {Object} LoginBody
 * @property {string} email - User email
 * @property {string} password - User password
 * @property {*} [additionalFields] - Additional login fields
 */

/**
 * Signup body interface
 * @typedef {Object} SignupBody
 * @property {string} email - User email
 * @property {string} password - User password
 * @property {string} firstname - First name
 * @property {string} lastname - Last name
 * @property {*} [additionalFields] - Additional signup fields
 */

/**
 * Adapter to bridge enterprise auth service with existing auth interfaces
 * 
 * This adapter makes the enterprise auth service compatible with the current
 * authentication system while providing enterprise-grade features.
 */
export class EnterpriseAuthAdapter {
    /**
     * @param {EnterpriseAuthService} enterpriseAuth - Enterprise auth service instance
     */
    constructor(enterpriseAuth) {
        this.enterpriseAuth = enterpriseAuth;
    }

    /**
     * Authenticates user using enterprise auth service
     * @param {LoginBody} credentials - Login credentials
     * @returns {Promise<AuthResponse>} Authentication response
     */
    async authenticate(credentials) {
        const authCredentials = {
            email: credentials.email,
            password: credentials.password,
            // Add any additional fields needed by enterprise auth
        };

        const result = await this.enterpriseAuth.authenticate('jwt', authCredentials);

        if (!result.success) {
            throw new Error(result.error?.message || 'Authentication failed');
        }

        // Convert enterprise auth session to AuthResponse format
        const session = result.data;
        return {
            id: session.user.id,
            accessToken: session.token.accessToken,
            refreshToken: session.token.refreshToken,
            userId: session.user.id,
            message: 'Authentication successful'
        };
    }

    /**
     * Registers new user using enterprise auth service
     * @param {SignupBody} userData - User registration data
     * @returns {Promise<void>}
     */
    async register(userData) {
        // Prepare credentials for enterprise registration
        const authCredentials = {
            email: userData.email,
            password: userData.password,
            firstName: userData.firstname,
            lastName: userData.lastname
        };

        // Use enterprise auth service for registration
        const result = await this.enterpriseAuth.authenticate('jwt', authCredentials);

        if (!result.success) {
            throw new Error(result.error?.message || 'Registration failed');
        }

        console.log('Enterprise registration successful for:', userData.email);
    }

    /**
     * Activates user account using enterprise auth service
     * @param {string} code - Activation code
     * @returns {Promise<void>}
     */
    async activate(code) {
        // This would need to be implemented in the enterprise auth service
        console.log('Enterprise activation with code:', code);
    }

    /**
     * Signs out user using enterprise auth service
     * @returns {Promise<void>}
     */
    async signout() {
        await this.enterpriseAuth.globalSignout();
    }

    /**
     * Gets security metrics from enterprise auth service
     * @returns {*} Security metrics
     */
    getSecurityMetrics() {
        return this.enterpriseAuth.getMetrics();
    }

    /**
     * Validates current session using enterprise auth service
     * @returns {Promise<{success: boolean, error?: string}>} Session validation result
     */
    async validateSession() {
        try {
            const session = await this.enterpriseAuth.getCurrentSession();
            return { success: !!session };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Session validation failed'
            };
        }
    }
}
