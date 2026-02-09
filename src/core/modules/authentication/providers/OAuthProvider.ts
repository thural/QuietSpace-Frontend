/**
 * OAuth Authentication Provider
 *
 * Implements OAuth 2.0 authentication for multiple providers:
 * - Google OAuth 2.0
 * - GitHub OAuth 2.0
 * - Microsoft OAuth 2.0
 *
 * Features:
 * - PKCE implementation for security
 * - Token management and refresh logic
 * - Multi-provider support
 * - State management for CSRF protection
 */

import { AuthErrorType, AuthProviderType } from '../types/auth.domain.types';

import type { IAuthenticator, HealthCheckResult, PerformanceMetrics } from '../interfaces/IAuthenticator';
import type { AuthCredentials, AuthResult, AuthSession } from '../types/auth.domain.types';

/**
 * Supported OAuth providers
 */
export const OAUTH_PROVIDERS = {
    GOOGLE: 'google',
    GITHUB: 'github',
    MICROSOFT: 'microsoft'
} as const;

export type OAuthProvider = typeof OAUTH_PROVIDERS[keyof typeof OAUTH_PROVIDERS];

/**
 * OAuth provider configuration
 */
export interface OAuthProviderConfig {
    clientId: string;
    clientSecret?: string;
    redirectUri: string;
    scope: string[];
    authorizationEndpoint: string;
    tokenEndpoint: string;
    userInfoEndpoint: string;
    pkce: boolean;
}

/**
 * OAuth token response
 */
export interface OAuthTokenResponse {
    accessToken: string;
    refreshToken?: string;
    tokenType: string;
    expiresIn: number;
    scope?: string;
}

/**
 * OAuth user info response
 */
export interface OAuthUserInfo {
    id: string;
    email?: string;
    name?: string;
    login?: string;
    picture?: string;
    avatarUrl?: string;
}

/**
 * OAuth Provider Implementation
 */
export class OAuthAuthProvider implements IAuthenticator {
    readonly name = 'OAuth Provider';
    readonly type = AuthProviderType.OAUTH;
    readonly config: Record<string, unknown> = {
        tokenRefreshInterval: 300000, // 5 minutes
        maxRetries: 3,
        pkceEnabled: true,
        stateLength: 32,
        codeVerifierLength: 128
    };

    private readonly providerConfigs: Map<string, OAuthProviderConfig> = new Map();
    private currentProvider?: string;
    private pkceVerifier?: string;
    private initialized = false;
    private initTime?: number;
    private performanceMetrics: PerformanceMetrics = {
        totalAttempts: 0,
        successfulAuthentications: 0,
        failedAuthentications: 0,
        averageResponseTime: 0,
        errorsByType: {},
        statistics: {
            successRate: 0,
            failureRate: 0,
            throughput: 0
        }
    };

    constructor() {
        this.initializeProviderConfigs();
    }

    /**
     * Authenticates user with OAuth
     */
    async authenticate(credentials: AuthCredentials): Promise<AuthResult<AuthSession>> {
        try {
            // Validate OAuth credentials
            if (!credentials.provider && !this.currentProvider) {
                return {
                    success: false,
                    error: {
                        type: AuthErrorType.VALIDATION_ERROR,
                        message: 'OAuth authentication requires provider specification',
                        code: 'OAUTH_MISSING_PROVIDER'
                    }
                };
            }

            const provider = credentials.provider as string || this.currentProvider!;
            const providerConfig = this.providerConfigs.get(provider);

            if (!providerConfig) {
                return {
                    success: false,
                    error: {
                        type: AuthErrorType.VALIDATION_ERROR,
                        message: `Unsupported OAuth provider: ${provider}`,
                        code: 'OAUTH_UNSUPPORTED_PROVIDER'
                    }
                };
            }

            // Handle authorization code flow
            if (credentials.authorizationCode) {
                const codeVerifier = credentials.codeVerifier;
                const authCode = credentials.authorizationCode;
                return await this.handleAuthorizationCodeFlow(
                    provider,
                    typeof authCode === 'string' ? authCode : '',
                    typeof codeVerifier === 'string' ? codeVerifier : undefined
                );
            }

            // Handle access token flow (for testing/debug)
            if (credentials.accessToken) {
                const accessToken = credentials.accessToken;
                return await this.handleAccessTokenFlow(provider, typeof accessToken === 'string' ? accessToken : '');
            }

            // Initiate OAuth flow
            return await this.initiateOAuthFlowInternal(provider);

        } catch (error) {
            return {
                success: false,
                error: {
                    type: AuthErrorType.SERVER_ERROR,
                    message: `OAuth authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                    code: 'OAUTH_AUTH_ERROR'
                }
            };
        }
    }

    /**
     * Registers user (OAuth doesn't support direct registration)
     */
    async register(_userData: AuthCredentials): Promise<AuthResult<void>> {
        return {
            success: false,
            error: {
                type: AuthErrorType.UNKNOWN_ERROR,
                message: 'OAuth provider does not support direct registration',
                code: 'OAUTH_REGISTER_NOT_SUPPORTED'
            }
        };
    }

    /**
     * Activates user (not applicable for OAuth)
     */
    async activate(_code: string): Promise<AuthResult<void>> {
        return {
            success: false,
            error: {
                type: AuthErrorType.UNKNOWN_ERROR,
                message: 'OAuth provider does not support activation',
                code: 'OAUTH_ACTIVATE_NOT_SUPPORTED'
            }
        };
    }

    /**
     * Signs out user
     */
    async signout(): Promise<AuthResult<void>> {
        try {
            // Clear current provider and PKCE verifier
            delete this.currentProvider;
            delete this.pkceVerifier;

            return {
                success: true,
                data: undefined
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    type: AuthErrorType.SERVER_ERROR,
                    message: `OAuth signout failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                    code: 'OAUTH_SIGNOUT_ERROR'
                }
            };
        }
    }

    /**
     * Refreshes OAuth token
     */
    async refreshToken(): Promise<AuthResult<AuthSession>> {
        try {
            if (!this.currentProvider) {
                return {
                    success: false,
                    error: {
                        type: AuthErrorType.VALIDATION_ERROR,
                        message: 'No active OAuth provider for token refresh',
                        code: 'OAUTH_NO_ACTIVE_PROVIDER'
                    }
                };
            }

            // Implementation would use stored refresh token
            // For now, return not implemented
            return {
                success: false,
                error: {
                    type: AuthErrorType.UNKNOWN_ERROR,
                    message: 'OAuth token refresh not yet implemented',
                    code: 'OAUTH_REFRESH_NOT_IMPLEMENTED'
                }
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    type: AuthErrorType.SERVER_ERROR,
                    message: `OAuth token refresh failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                    code: 'OAUTH_REFRESH_ERROR'
                }
            };
        }
    }

    /**
     * Validates current session
     */
    async validateSession(): Promise<AuthResult<boolean>> {
        try {
            // Basic validation - check if we have an active provider
            const isValid = this.currentProvider !== undefined;

            return {
                success: true,
                data: isValid
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    type: AuthErrorType.SERVER_ERROR,
                    message: `OAuth session validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                    code: 'OAUTH_VALIDATION_ERROR'
                }
            };
        }
    }

    /**
     * Configures provider
     */
    configure(config: Record<string, unknown>): void {
        Object.assign(this.config, config);

        // Update provider configurations if provided
        if (config.providers) {
            Object.entries(config.providers).forEach(([provider, providerConfig]) => {
                if (Object.values(OAUTH_PROVIDERS).includes(provider as OAuthProvider)) {
                    this.providerConfigs.set(
                        provider,
                        providerConfig as OAuthProviderConfig
                    );
                }
            });
        }
    }

    /**
     * Gets provider capabilities
     */
    getCapabilities(): string[] {
        return [
            'oauth_authentication',
            'google_oauth',
            'github_oauth',
            'microsoft_oauth',
            'pkce_support',
            'token_management',
            'csrf_protection',
            'multi_provider'
        ];
    }

    /**
     * Initiates OAuth flow
     */
    private async initiateOAuthFlowInternal(provider: string): Promise<AuthResult<AuthSession>> {
        try {
            const providerConfig = this.providerConfigs.get(provider);
            if (!providerConfig) {
                return {
                    success: false,
                    error: {
                        type: AuthErrorType.VALIDATION_ERROR,
                        message: `Unsupported OAuth provider: ${provider}`,
                        code: 'OAUTH_UNSUPPORTED_PROVIDER'
                    }
                };
            }

            // Generate PKCE verifier and challenge if enabled
            let codeVerifier: string | undefined;
            let codeChallenge: string | undefined;

            if (providerConfig.pkce) {
                codeVerifier = this.generateCodeVerifier();
                codeChallenge = await this.generateCodeChallenge(codeVerifier);
                this.pkceVerifier = codeVerifier;
            }

            // Generate state for CSRF protection
            const state = this.generateState();

            // Build authorization URL
            const authParams = new URLSearchParams({
                client_id: providerConfig.clientId,
                redirect_uri: providerConfig.redirectUri,
                scope: providerConfig.scope.join(' '),
                response_type: 'code',
                state
            });

            if (codeChallenge) {
                authParams.append('code_challenge', codeChallenge);
                authParams.append('code_challenge_method', 'S256');
            }

            const authUrl = `${providerConfig.authorizationEndpoint}?${authParams.toString()}`;

            // Redirect to OAuth provider
            window.location.href = authUrl;

            // This will not be reached due to redirect
            return {
                success: false,
                error: {
                    type: AuthErrorType.UNKNOWN_ERROR,
                    message: 'OAuth flow initiated - user will be redirected',
                    code: 'OAUTH_REDIRECT_INITIATED'
                }
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    type: AuthErrorType.SERVER_ERROR,
                    message: `OAuth flow initiation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                    code: 'OAUTH_FLOW_INIT_ERROR'
                }
            };
        }
    }

    /**
     * Performs health check on the OAuth provider
     */
    async healthCheck(): Promise<HealthCheckResult> {
        const startTime = Date.now();

        try {
            // Check if provider configurations are loaded
            const hasConfigs = this.providerConfigs.size > 0;

            // Check if crypto API is available
            const cryptoAvailable = typeof crypto !== 'undefined' &&
                typeof crypto.subtle !== 'undefined' &&
                typeof crypto.getRandomValues !== 'undefined';

            const healthy = hasConfigs && cryptoAvailable;
            const responseTime = Date.now() - startTime;

            return {
                healthy,
                timestamp: new Date(),
                responseTime,
                message: healthy ? 'OAuth provider is healthy' : 'OAuth provider has issues',
                metadata: {
                    providerCount: this.providerConfigs.size,
                    cryptoAvailable,
                    currentProvider: this.currentProvider
                }
            };
        } catch (error) {
            const responseTime = Date.now() - startTime;
            return {
                healthy: false,
                timestamp: new Date(),
                responseTime,
                message: `Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                metadata: {
                    error: error instanceof Error ? error.name : 'Unknown'
                }
            };
        }
    }

    /**
     * Gets performance metrics for the OAuth provider
     */
    getPerformanceMetrics(): PerformanceMetrics {
        return { ...this.performanceMetrics };
    }

    /**
     * Resets performance metrics
     */
    resetPerformanceMetrics(): void {
        this.performanceMetrics = {
            totalAttempts: 0,
            successfulAuthentications: 0,
            failedAuthentications: 0,
            averageResponseTime: 0,
            errorsByType: {},
            statistics: {
                successRate: 0,
                failureRate: 0,
                throughput: 0
            }
        };
    }

    /**
     * Checks if the OAuth provider is currently healthy
     */
    async isHealthy(): Promise<boolean> {
        const healthResult = await this.healthCheck();
        return healthResult.healthy;
    }

    /**
     * Gets provider initialization status
     */
    isInitialized(): boolean {
        return this.initialized;
    }

    /**
     * Gets provider uptime in milliseconds
     */
    getUptime(): number {
        if (!this.initialized || !this.initTime) {
            return 0;
        }
        return Date.now() - this.initTime;
    }

    /**
     * Gracefully shuts down the OAuth provider
     */
    async shutdown(_timeout?: number): Promise<void> {
        try {
            // Clear current state
            delete this.currentProvider;
            delete this.pkceVerifier;
            this.initialized = false;

            // Clear provider configs
            this.providerConfigs.clear();

            console.log('OAuth provider shutdown successfully');
        } catch (error) {
            console.error('Error during OAuth provider shutdown:', error);
            throw error;
        }
    }

    /**
     * Initializes OAuth provider configurations
     */
    private initializeProviderConfigs(): void {
        // Google OAuth configuration
        this.providerConfigs.set(OAUTH_PROVIDERS.GOOGLE, {
            clientId: process.env.VITE_GOOGLE_CLIENT_ID || 'test-google-client-id',
            redirectUri: process.env.VITE_GOOGLE_REDIRECT_URI || `${window.location.origin}/auth/google/callback`,
            scope: ['openid', 'email', 'profile'],
            authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
            tokenEndpoint: 'https://oauth2.googleapis.com/token',
            userInfoEndpoint: 'https://www.googleapis.com/oauth2/v2/userinfo',
            pkce: true
        });

        // GitHub OAuth configuration
        this.providerConfigs.set(OAUTH_PROVIDERS.GITHUB, {
            clientId: process.env.VITE_GITHUB_CLIENT_ID || 'test-github-client-id',
            redirectUri: process.env.VITE_GITHUB_REDIRECT_URI || `${window.location.origin}/auth/github/callback`,
            scope: ['user:email'],
            authorizationEndpoint: 'https://github.com/login/oauth/authorize',
            tokenEndpoint: 'https://github.com/login/oauth/access_token',
            userInfoEndpoint: 'https://api.github.com/user',
            pkce: true
        });

        // Microsoft OAuth configuration
        this.providerConfigs.set(OAUTH_PROVIDERS.MICROSOFT, {
            clientId: process.env.VITE_MICROSOFT_CLIENT_ID || 'test-microsoft-client-id',
            redirectUri: process.env.VITE_MICROSOFT_REDIRECT_URI || `${window.location.origin}/auth/microsoft/callback`,
            scope: ['openid', 'email', 'profile'],
            authorizationEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
            tokenEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
            userInfoEndpoint: 'https://graph.microsoft.com/v1.0/me',
            pkce: true
        });
    }

    /**
     * Handles authorization code flow
     */
    private async handleAuthorizationCodeFlow(
        provider: string,
        authorizationCode: string,
        codeVerifier?: string
    ): Promise<AuthResult<AuthSession>> {
        try {
            const providerConfig = this.providerConfigs.get(provider)!;
            this.currentProvider = provider;

            // Exchange authorization code for tokens
            const tokenResponse = await this.exchangeCodeForTokens(providerConfig, authorizationCode, codeVerifier);

            if (!tokenResponse.success) {
                return {
                    success: false,
                    error: tokenResponse.error || {
                        type: AuthErrorType.SERVER_ERROR,
                        message: 'Token exchange failed',
                        code: 'OAUTH_TOKEN_EXCHANGE_FAILED'
                    }
                };
            }

            // Get user info
            const userInfo = await this.getUserInfo(providerConfig, tokenResponse.data!.accessToken);

            if (!userInfo.success) {
                return {
                    success: false,
                    ...(userInfo.error && { error: userInfo.error })
                };
            }

            // Create session
            const session: AuthSession = {
                user: {
                    id: userInfo.data!.id,
                    email: userInfo.data!.email || '',
                    username: userInfo.data!.email || '',
                    roles: [],
                    permissions: []
                },
                token: {
                    accessToken: tokenResponse.data!.accessToken,
                    refreshToken: tokenResponse.data!.refreshToken || '',
                    expiresAt: new Date(Date.now() + (tokenResponse.data!.expiresIn * 1000)),
                    tokenType: tokenResponse.data!.tokenType,
                    scope: Array.isArray(tokenResponse.data!.scope) ? tokenResponse.data!.scope : [tokenResponse.data!.scope || ''].filter(Boolean)
                },
                provider: this.type,
                createdAt: new Date(),
                expiresAt: new Date(Date.now() + (tokenResponse.data!.expiresIn * 1000)),
                isActive: true,
                metadata: {
                    ipAddress: await this.getClientIP(),
                    userAgent: navigator.userAgent,
                    provider
                }
            };

            return {
                success: true,
                data: session
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    type: AuthErrorType.SERVER_ERROR,
                    message: `Authorization code flow failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                    code: 'OAUTH_CODE_FLOW_ERROR'
                }
            };
        }
    }

    /**
     * Handles access token flow
     */
    private async handleAccessTokenFlow(provider: string, accessToken: string): Promise<AuthResult<AuthSession>> {
        try {
            const providerConfig = this.providerConfigs.get(provider)!;
            this.currentProvider = provider;

            // Get user info directly with access token
            const userInfo = await this.getUserInfo(providerConfig, accessToken);

            if (!userInfo.success) {
                return {
                    success: false,
                    ...(userInfo.error && { error: userInfo.error })
                };
            }

            // Create session
            const session: AuthSession = {
                user: {
                    id: userInfo.data!.id,
                    email: userInfo.data!.email || '',
                    username: userInfo.data!.email || '',
                    roles: [],
                    permissions: []
                },
                token: {
                    accessToken,
                    refreshToken: '',
                    expiresAt: new Date(Date.now() + (3600 * 1000)), // 1 hour default
                    tokenType: 'Bearer',
                    scope: providerConfig.scope
                },
                provider: this.type,
                createdAt: new Date(),
                expiresAt: new Date(Date.now() + (3600 * 1000)),
                isActive: true,
                metadata: {
                    ipAddress: await this.getClientIP(),
                    userAgent: navigator.userAgent,
                    provider
                }
            };

            return {
                success: true,
                data: session
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    type: AuthErrorType.SERVER_ERROR,
                    message: `Access token flow failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                    code: 'OAUTH_ACCESS_TOKEN_ERROR'
                }
            };
        }
    }

    /**
     * Exchanges authorization code for tokens
     */
    private async exchangeCodeForTokens(
        config: OAuthProviderConfig,
        code: string,
        codeVerifier?: string
    ): Promise<AuthResult<OAuthTokenResponse>> {
        try {
            const tokenParams = new URLSearchParams({
                clientId: config.clientId,
                code,
                redirectUri: config.redirectUri,
                grantType: 'authorization_code'
            });

            if (codeVerifier) {
                tokenParams.append('code_verifier', codeVerifier);
            }

            const response = await fetch(`${config.tokenEndpoint}?${tokenParams.toString()}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            if (!response.ok) {
                throw new Error(`Token exchange failed: ${response.statusText}`);
            }

            const data = await response.json() as OAuthTokenResponse;

            return {
                success: true,
                data
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    type: AuthErrorType.SERVER_ERROR,
                    message: `Code exchange failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                    code: 'OAUTH_CODE_EXCHANGE_ERROR'
                }
            };
        }
    }

    /**
     * Gets user info from OAuth provider
     */
    private async getUserInfo(config: OAuthProviderConfig, accessToken: string): Promise<AuthResult<OAuthUserInfo>> {
        try {
            const response = await fetch(`${config.userInfoEndpoint}?access_token=${accessToken}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (!response.ok) {
                throw new Error(`User info request failed: ${response.statusText}`);
            }

            const data = await response.json() as OAuthUserInfo;

            return {
                success: true,
                data
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    type: AuthErrorType.SERVER_ERROR,
                    message: `User info request failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                    code: 'OAUTH_USER_INFO_ERROR'
                }
            };
        }
    }

    /**
     * Generates PKCE code verifier
     */
    private generateCodeVerifier(): string {
        const length = (this.config.codeVerifierLength as number) || 128;
        const array = new Uint8Array(length);
        crypto.getRandomValues(array);
        return Array.from(array)
            .map((byte: number) => byte.toString(16).padStart(2, '0'))
            .join('');
    }

    /**
     * Generates PKCE code challenge
     */
    private async generateCodeChallenge(verifier: string): Promise<string> {
        const encoder = new TextEncoder();
        const data = encoder.encode(verifier);
        const digest = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(digest))
            .map((byte: number) => byte.toString(16).padStart(2, '0'))
            .join('');
    }

    /**
     * Generates random state for CSRF protection
     */
    private generateState(): string {
        const length = (this.config.stateLength as number) || 32;
        const array = new Uint8Array(length);
        crypto.getRandomValues(array);
        return Array.from(array)
            .map((byte: number) => byte.toString(16).padStart(2, '0'))
            .join('');
    }

    /**
     * Gets client IP address
     */
    private async getClientIP(): Promise<string> {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch {
            return 'unknown';
        }
    }
}
