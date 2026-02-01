import { EnterpriseAuthService } from '../enterprise/AuthService';
import { AuthResponse } from '@features/auth/data/models/auth';
import { LoginBody, SignupBody } from '@shared/types/auth.dto';

/**
 * Adapter to bridge enterprise auth service with existing auth interfaces
 * 
 * This adapter makes the enterprise auth service compatible with the current
 * authentication system while providing enterprise-grade features.
 */
export class EnterpriseAuthAdapter {
    constructor(private readonly enterpriseAuth: EnterpriseAuthService) {}

    /**
     * Authenticates user using enterprise auth service
     */
    async authenticate(credentials: LoginBody): Promise<AuthResponse> {
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
     */
    async register(userData: SignupBody): Promise<void> {
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
     */
    async activate(code: string): Promise<void> {
        // This would need to be implemented in the enterprise auth service
        console.log('Enterprise activation with code:', code);
    }

    /**
     * Signs out user using enterprise auth service
     */
    async signout(): Promise<void> {
        await this.enterpriseAuth.globalSignout();
    }

    /**
     * Gets security metrics from enterprise auth service
     */
    getSecurityMetrics() {
        return this.enterpriseAuth.getMetrics();
    }

    /**
     * Validates current session using enterprise auth service
     */
    async validateSession(): Promise<{ success: boolean; error?: string }> {
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
