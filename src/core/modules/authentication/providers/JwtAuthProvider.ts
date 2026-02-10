import { AuthProviderType } from '../types/auth.domain.types';

import type { AuthCredentials, AuthResult, AuthSession } from '../types/auth.domain.types';
import { BaseAuthenticator } from './BaseAuthenticator';
import { createMockSession, createSuccessResult, delay } from './ProviderUtils';

/**
 * JWT Authentication Provider Implementation
 */
export class JwtAuthProvider extends BaseAuthenticator {
    protected override _name = 'JWT Provider';
    protected override _type = AuthProviderType.JWT;
    protected override _config: Record<string, any> = {
        tokenRefreshInterval: 540000, // 9 minutes
        maxRetries: 3,
        encryptionEnabled: true
    };

    /**
     * JWT-specific authentication implementation
     */
    protected async authenticateImpl(credentials: AuthCredentials): Promise<AuthResult<AuthSession>> {
        if (!credentials.email || !credentials.password) {
            throw new Error('Invalid credentials');
        }

        await delay(100);
        const session = createMockSession('jwt' as AuthProviderType, {
            user: {
                email: credentials.email,
                username: credentials.username || credentials.email
            }
        });

        return createSuccessResult(session);
    }

    /**
     * JWT-specific session validation
     */
    protected async validateSessionImpl(): Promise<AuthResult<boolean>> {
        return {
            success: true,
            data: true
        };
    }

    /**
     * JWT-specific token refresh
     */
    protected async refreshTokenImpl(): Promise<AuthResult<AuthSession>> {
        const session = createMockSession('jwt' as AuthProviderType);
        return createSuccessResult(session);
    }

    /**
     * JWT-specific health check
     */
    protected async performHealthCheck(): Promise<boolean> {
        // Mock health check - in real implementation, would check JWT service
        return true;
    }

    /**
     * Gets JWT-specific capabilities
     */
    override getCapabilities(): string[] {
        return [...super.getCapabilities(), 'jwt_auth', 'token_management'];
    }
}

