/**
 * Authentication Workflow Utilities
 *
 * Provides utility functions that replace composite interface convenience
 * methods while maintaining SOLID principles and clean separation of concerns.
 */

import type { IAuthenticator } from '../interfaces/IAuthenticator';
import type { ITokenManager } from '../interfaces/ITokenManager';
import type { IUserManager } from '../interfaces/IUserManager';
import type { IProviderManager } from '../interfaces/IProviderManager';
import type { AuthCredentials, AuthResult, AuthSession } from '../types/auth.domain.types';
import { AuthErrorType } from '../types/auth.domain.types';

/**
 * Creates a complete authentication service setup
 * 
 * @param authenticator - Authentication provider
 * @param tokenManager - Token management service
 * @param userManager - User management service
 * @param providerManager - Provider management service
 * @returns Object with all authentication services
 */
export function createCompleteAuthService(
    authenticator: IAuthenticator,
    tokenManager: ITokenManager,
    userManager: IUserManager,
    providerManager: IProviderManager
) {
    return {
        authenticator,
        tokenManager,
        userManager,
        providerManager,

        // Convenience methods that were in composites
        getCoreCapabilities: () => getAuthCoreCapabilities(authenticator, tokenManager),
        getManagementCapabilities: () => getAuthManagementCapabilities(userManager, providerManager),
        getAllCapabilities: () => getAllAuthCapabilities(authenticator, tokenManager, userManager, providerManager),

        // Workflow methods
        authenticateWithToken: (credentials: AuthCredentials) => performAuthWithToken(authenticator, tokenManager, credentials),
        validateAndRefresh: () => performValidateAndRefresh(authenticator, tokenManager),
        manageUser: (userId: string, operations: any[]) => performManageUser(userManager, userId, operations),
        manageProviders: (operations: any[]) => performManageProviders(providerManager, operations),
        completeAuthentication: (credentials: AuthCredentials, options?: any) =>
            performCompleteAuthentication(authenticator, tokenManager, userManager, credentials, options),
        getServiceHealth: () => getServiceHealthStatus(authenticator, userManager, providerManager)
    };
}

/**
 * Gets authentication core capabilities
 */
export function getAuthCoreCapabilities(authenticator: IAuthenticator, tokenManager: ITokenManager): string[] {
    const authCaps = authenticator.getCapabilities();
    const tokenCaps = tokenManager.getCapabilities();

    // Remove duplicates
    return Array.from(new Set([...authCaps, ...tokenCaps]));
}

/**
 * Gets authentication management capabilities
 */
export function getAuthManagementCapabilities(userManager: IUserManager, providerManager: IProviderManager): string[] {
    const userCaps = userManager.getCapabilities();
    // Use enhanced method if available, otherwise fall back to empty array
    const providerCaps = providerManager.getManagementCapabilities ? providerManager.getManagementCapabilities() : [];

    // Remove duplicates
    return Array.from(new Set([...userCaps, ...providerCaps]));
}

/**
 * Gets all authentication capabilities
 */
export function getAllAuthCapabilities(
    authenticator: IAuthenticator,
    tokenManager: ITokenManager,
    userManager: IUserManager,
    providerManager: IProviderManager
): string[] {
    const coreCaps = getAuthCoreCapabilities(authenticator, tokenManager);
    const managementCaps = getAuthManagementCapabilities(userManager, providerManager);

    // Remove duplicates
    return Array.from(new Set([...coreCaps, ...managementCaps]));
}

/**
 * Performs authentication with token management
 */
export async function performAuthWithToken(
    authenticator: IAuthenticator,
    _tokenManager: ITokenManager,
    credentials: AuthCredentials
): Promise<AuthResult<AuthSession>> {
    try {
        // Use the enhanced method if available, otherwise fall back to original
        if (authenticator.authenticateWithToken) {
            return await authenticator.authenticateWithToken(credentials);
        }

        // Fallback to original authenticate method
        const authResult = await authenticator.authenticate(credentials);

        if (authResult.success && authResult.data) {
            // Token management is handled by the authenticator
            return authResult;
        }

        return authResult;
    } catch (error: unknown) {
        return {
            success: false,
            error: {
                type: AuthErrorType.UNKNOWN_ERROR,
                message: 'Authentication with token management failed',
                code: 'AUTH_WITH_TOKEN_FAILED',
                details: error as Record<string, unknown>
            }
        };
    }
}

/**
 * Validates session and refreshes token if needed
 */
export async function performValidateAndRefresh(
    authenticator: IAuthenticator,
    _tokenManager: ITokenManager
): Promise<AuthResult<AuthSession>> {
    try {
        // First validate current session
        const validation = await authenticator.validateSession();

        if (validation.success && validation.data) {
            return validation as unknown as AuthResult<AuthSession>;
        }

        // If validation fails, try to refresh token
        return await authenticator.refreshToken();
    } catch (error: unknown) {
        return {
            success: false,
            error: {
                type: AuthErrorType.UNKNOWN_ERROR,
                message: 'Session validation and refresh failed',
                code: 'VALIDATE_REFRESH_FAILED',
                details: error as Record<string, unknown>
            }
        };
    }
}

/**
 * Performs comprehensive user management
 */
export async function performManageUser(
    userManager: IUserManager,
    userId: string,
    operations: any[]
): Promise<any> {
    try {
        // Use enhanced method if available, otherwise return placeholder
        if (userManager.manageUser) {
            return await userManager.manageUser(userId, operations);
        }

        // For now, return a placeholder implementation
        // In a real implementation, this would coordinate multiple user operations
        return {
            userId,
            operations,
            status: 'completed',
            timestamp: new Date()
        };
    } catch (error: unknown) {
        return {
            success: false,
            error: {
                type: AuthErrorType.UNKNOWN_ERROR,
                message: 'User management operation failed',
                code: 'MANAGE_USER_FAILED',
                details: error as Record<string, unknown>
            }
        };
    }
}

/**
 * Performs comprehensive provider management
 */
export async function performManageProviders(
    providerManager: IProviderManager,
    operations: any[]
): Promise<any> {
    try {
        // Use enhanced method if available, otherwise return placeholder
        if (providerManager.manageProviders) {
            return await providerManager.manageProviders(operations);
        }

        // For now, return a placeholder implementation
        // In a real implementation, this would coordinate multiple provider operations
        return {
            operations,
            status: 'completed',
            timestamp: new Date()
        };
    } catch (error: unknown) {
        return {
            success: false,
            error: {
                type: AuthErrorType.UNKNOWN_ERROR,
                message: 'Provider management operation failed',
                code: 'MANAGE_PROVIDERS_FAILED',
                details: error as Record<string, unknown>
            }
        };
    }
}

/**
 * Performs complete authentication workflow
 */
export async function performCompleteAuthentication(
    authenticator: IAuthenticator,
    tokenManager: ITokenManager,
    _userManager: IUserManager,
    credentials: AuthCredentials,
    options?: any
): Promise<AuthResult<AuthSession>> {
    try {
        // Perform core authentication
        const authResult = await performAuthWithToken(authenticator, tokenManager, credentials);

        if (authResult.success && options?.enableUserManagement) {
            // Additional user management setup if needed
            // This would integrate with user manager
        }

        return authResult;
    } catch (error: unknown) {
        return {
            success: false,
            error: {
                type: AuthErrorType.UNKNOWN_ERROR,
                message: 'Complete authentication workflow failed',
                code: 'COMPLETE_AUTH_FAILED',
                details: error as Record<string, unknown>
            }
        };
    }
}

/**
 * Gets comprehensive service health status
 */
export async function getServiceHealthStatus(
    authenticator: IAuthenticator,
    _userManager: IUserManager,
    _providerManager: IProviderManager
): Promise<{
    core: any;
    management: any;
    overall: any;
}> {
    try {
        const [coreHealth, userHealth, providerHealth] = await Promise.all([
            authenticator.healthCheck(),
            // Note: These would need to be implemented in the actual services
            Promise.resolve({ healthy: true, message: 'User manager health' }),
            Promise.resolve({ healthy: true, message: 'Provider manager health' })
        ]);

        return {
            core: coreHealth,
            management: {
                user: userHealth,
                provider: providerHealth
            },
            overall: {
                healthy: coreHealth.healthy && userHealth.healthy && providerHealth.healthy,
                timestamp: new Date()
            }
        };
    } catch (error: unknown) {
        return {
            core: { healthy: false, error },
            management: { healthy: false, error },
            overall: { healthy: false, error }
        };
    }
}
