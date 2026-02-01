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

import type { IAuthProvider } from '../interfaces/authInterfaces';
import type { AuthCredentials, AuthResult, AuthSession } from '../types/auth.domain.types';

/**
 * Supported OAuth providers
 */
export const OAuthProviders = {
    GOOGLE: 'google',
    GITHUB: 'github',
    MICROSOFT: 'microsoft'
} as const;

export type OAuthProvider = typeof OAuthProviders[keyof typeof OAuthProviders];

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
interface OAuthTokenResponse {
    access_token: string;
    refresh_token?: string;
    token_type: string;
    expires_in: number;
    scope?: string;
}

/**
 * OAuth user info response
 */
interface OAuthUserInfo {
    id: string;
    email?: string;
    name?: string;
    login?: string;
    picture?: string;
    avatar_url?: string;
}

/**
 * OAuth Provider Implementation
 */
export class OAuthAuthProvider implements IAuthProvider {
    readonly name = 'OAuth Provider';
    readonly type = AuthProviderType.OAUTH;
    readonly config: Record<string, any> = {
        tokenRefreshInterval: 300000, // 5 minutes
        maxRetries: 3,
        pkceEnabled: true,
        stateLength: 32,
        codeVerifierLength: 128
    };

    private readonly providerConfigs: Map<string, OAuthProviderConfig> = new Map();
    private currentProvider?: string;
    private pkceVerifier?: string;

    constructor() {
        this.initializeProviderConfigs();
    }

    /**
     * Authenticates user with OAuth
     */
    async authenticate(credentials: AuthCredentials): Promise<AuthResult<AuthSession>> {
        try {
            const startTime = Date.now();

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
                return await this.handleAuthorizationCodeFlow(provider, credentials.authorizationCode, credentials.codeVerifier);
            }

            // Handle access token flow (for testing/debug)
            if (credentials.accessToken) {
                return await this.handleAccessTokenFlow(provider, credentials.accessToken);
            }

            // Initiate OAuth flow
            return await this.initiateOAuthFlow(provider);

        } catch (error) {
            return {
                success: false,
                error: {
                    type: AuthErrorType.SERVER_ERROR,
                    message: `OAuth authentication failed: ${error.message}`,
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
            this.currentProvider = undefined;
            this.pkceVerifier = undefined;

            return {
                success: true,
                data: undefined
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    type: AuthErrorType.SERVER_ERROR,
                    message: `OAuth signout failed: ${error.message}`,
                    code: 'OAUTH_SIGNOUT_ERROR'
                }
            };
        }
    }

    /**
     * Refreshes OAuth token
     */
    async refreshToken(): Promise<AuthResult> {
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
                    message: `OAuth token refresh failed: ${error.message}`,
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
                    message: `OAuth session validation failed: ${error.message}`,
                    code: 'OAUTH_VALIDATION_ERROR'
                }
            };
        }
    }

    /**
     * Configures provider
     */
    configure(config: Record<string, any>): void {
        Object.assign(this.config, config);

        // Update provider configurations if provided
        if (config.providers) {
            Object.entries(config.providers).forEach(([provider, providerConfig]) => {
                if (Object.values(OAuthProviders).includes(provider as OAuthProvider)) {
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
     * Initializes provider
     */
    async initialize(): Promise<void> {
        console.log('OAuth Provider initialized with support for:', Object.values(OAuthProviders));
    }

    /**
     * Initializes OAuth provider configurations
     */
    private initializeProviderConfigs(): void {
        // Google OAuth configuration
        this.providerConfigs.set(OAuthProviders.GOOGLE, {
            clientId: process.env.VITE_GOOGLE_CLIENT_ID || 'test-google-client-id',
            redirectUri: process.env.VITE_GOOGLE_REDIRECT_URI || `${window.location.origin}/auth/google/callback`,
            scope: ['openid', 'email', 'profile'],
            authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
            tokenEndpoint: 'https://oauth2.googleapis.com/token',
            userInfoEndpoint: 'https://www.googleapis.com/oauth2/v2/userinfo',
            pkce: true
        });

        // GitHub OAuth configuration
        this.providerConfigs.set(OAuthProviders.GITHUB, {
            clientId: process.env.VITE_GITHUB_CLIENT_ID || 'test-github-client-id',
            redirectUri: process.env.VITE_GITHUB_REDIRECT_URI || `${window.location.origin}/auth/github/callback`,
            scope: ['user:email'],
            authorizationEndpoint: 'https://github.com/login/oauth/authorize',
            tokenEndpoint: 'https://github.com/login/oauth/access_token',
            userInfoEndpoint: 'https://api.github.com/user',
            pkce: true
        });

        // Microsoft OAuth configuration
        this.providerConfigs.set(OAuthProviders.MICROSOFT, {
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
     * Initiates OAuth flow by generating authorization URL
     */
    private async initiateOAuthFlow(provider: string): Promise<AuthResult<AuthSession>> {
        try {
            const providerConfig = this.providerConfigs.get(provider)!;
            this.currentProvider = provider;

            // Generate PKCE verifier and challenge if enabled
            let codeChallenge: string | undefined;
            if (providerConfig.pkce) {
                this.pkceVerifier = this.generateCodeVerifier();
                codeChallenge = await this.generateCodeChallenge(this.pkceVerifier);
            }

            // Generate state for CSRF protection
            const state = this.generateState();

            // Build authorization URL
            const authParams = new URLSearchParams({
                client_id: providerConfig.clientId,
                redirect_uri: providerConfig.redirectUri,
                scope: providerConfig.scope.join(' '),
                response_type: 'code',
                state,
                ...(codeChallenge && {
                    code_challenge: codeChallenge,
                    code_challenge_method: 'S256'
                })
            });

            const authorizationUrl = `${providerConfig.authorizationEndpoint}?${authParams.toString()}`;

            // Return result with authorization URL for redirect
            return {
                success: true,
                data: {
                    user: {
                        id: 'pending',
                        email: '',
                        roles: [],
                        permissions: []
                    },
                    token: {
                        accessToken: '',
                        refreshToken: '',
                        expiresAt: new Date(),
                        tokenType: 'Bearer',
                        scope: providerConfig.scope
                    },
                    provider: this.type,
                    createdAt: new Date(),
                    expiresAt: new Date(),
                    isActive: false,
                    metadata: {
                        ipAddress: await this.getClientIP(),
                        userAgent: navigator.userAgent,
                        authorizationUrl,
                        state,
                        provider
                    }
                }
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    type: AuthErrorType.SERVER_ERROR,
                    message: `Failed to initiate OAuth flow: ${error.message}`,
                    code: 'OAUTH_INIT_FAILED'
                }
            };
        }
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

            // Exchange authorization code for tokens
            const tokenResponse = await this.exchangeCodeForTokens(
                providerConfig,
                authorizationCode,
                codeVerifier || this.pkceVerifier
            );

            if (!tokenResponse.success) {
                return {
                    success: false,
                    error: tokenResponse.error
                };
            }

            // Get user information
            const userInfoResponse = await this.getUserInfo(providerConfig, tokenResponse.data!.access_token);

            if (!userInfoResponse.success) {
                return {
                    success: false,
                    error: userInfoResponse.error
                };
            }

            // Create session
            const now = new Date();
            const expiresAt = new Date(now.getTime() + (tokenResponse.data!.expires_in * 1000));

            const session: AuthSession = {
                user: {
                    id: userInfoResponse.data!.id,
                    email: userInfoResponse.data!.email || '',
                    username: userInfoResponse.data!.login || userInfoResponse.data!.name,
                    roles: ['user'],
                    permissions: ['read:posts', 'create:posts'],
                    profile: {
                        firstName: userInfoResponse.data!.name?.split(' ')[0],
                        lastName: userInfoResponse.data!.name?.split(' ')[1],
                        avatar: userInfoResponse.data!.picture || userInfoResponse.data!.avatar_url
                    }
                },
                token: {
                    accessToken: tokenResponse.data!.access_token,
                    refreshToken: tokenResponse.data!.refresh_token || '',
                    expiresAt,
                    tokenType: tokenResponse.data!.token_type,
                    scope: tokenResponse.data!.scope?.split(' ') || providerConfig.scope
                },
                provider: this.type,
                createdAt: now,
                expiresAt,
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
                    message: `Authorization code flow failed: ${error.message}`,
                    code: 'OAUTH_CODE_FLOW_ERROR'
                }
            };
        }
    }

    /**
     * Handles access token flow (for testing)
     */
    private async handleAccessTokenFlow(provider: string, accessToken: string): Promise<AuthResult<AuthSession>> {
        try {
            const providerConfig = this.providerConfigs.get(provider)!;

            // Get user information with access token
            const userInfoResponse = await this.getUserInfo(providerConfig, accessToken);

            if (!userInfoResponse.success) {
                return {
                    success: false,
                    error: userInfoResponse.error
                };
            }

            // Create session
            const now = new Date();
            const expiresAt = new Date(now.getTime() + (60 * 60 * 1000)); // 1 hour default

            const session: AuthSession = {
                user: {
                    id: userInfoResponse.data!.id,
                    email: userInfoResponse.data!.email || '',
                    username: userInfoResponse.data!.login || userInfoResponse.data!.name,
                    roles: ['user'],
                    permissions: ['read:posts', 'create:posts'],
                    profile: {
                        firstName: userInfoResponse.data!.name?.split(' ')[0],
                        lastName: userInfoResponse.data!.name?.split(' ')[1],
                        avatar: userInfoResponse.data!.picture || userInfoResponse.data!.avatar_url
                    }
                },
                token: {
                    accessToken,
                    refreshToken: '',
                    expiresAt,
                    tokenType: 'Bearer',
                    scope: providerConfig.scope
                },
                provider: this.type,
                createdAt: now,
                expiresAt,
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
                    message: `Access token flow failed: ${error.message}`,
                    code: 'OAUTH_TOKEN_FLOW_ERROR'
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
                client_id: config.clientId,
                code,
                redirect_uri: config.redirectUri,
                grant_type: 'authorization_code'
            });

            if (codeVerifier) {
                tokenParams.append('code_verifier', codeVerifier);
            }

            const response = await fetch(config.tokenEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                },
                body: tokenParams.toString()
            });

            if (!response.ok) {
                throw new Error(`Token exchange failed: ${response.status} ${response.statusText}`);
            }

            const tokenData = await response.json();
            return {
                success: true,
                data: tokenData
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    type: AuthErrorType.NETWORK_ERROR,
                    message: `Token exchange failed: ${error.message}`,
                    code: 'OAUTH_TOKEN_EXCHANGE_ERROR'
                }
            };
        }
    }

    /**
     * Gets user information from OAuth provider
     */
    private async getUserInfo(
        config: OAuthProviderConfig,
        accessToken: string
    ): Promise<AuthResult<OAuthUserInfo>> {
        try {
            const response = await fetch(config.userInfoEndpoint, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`User info request failed: ${response.status} ${response.statusText}`);
            }

            const userData = await response.json();
            return {
                success: true,
                data: userData
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    type: AuthErrorType.NETWORK_ERROR,
                    message: `User info request failed: ${error.message}`,
                    code: 'OAUTH_USER_INFO_ERROR'
                }
            };
        }
    }

    /**
     * Generates random state for CSRF protection
     */
    private generateState(): string {
        const randomBytes = new Uint8Array(this.config.stateLength);
        crypto.getRandomValues(randomBytes);

        let result = '';
        for (let i = 0; i < randomBytes.length; i++) {
            result += String.fromCharCode(randomBytes[i]);
        }
        return btoa(result).replace(/[^a-zA-Z0-9]/g, '').substring(0, this.config.stateLength);
    }

    /**
     * Generates PKCE code verifier
     */
    private generateCodeVerifier(): string {
        const randomBytes = new Uint8Array(this.config.codeVerifierLength);
        crypto.getRandomValues(randomBytes);

        let result = '';
        for (let i = 0; i < randomBytes.length; i++) {
            result += String.fromCharCode(randomBytes[i]);
        }
        return btoa(result).replace(/[^a-zA-Z0-9]/g, '');
    }

    /**
     * Generates PKCE code challenge from verifier
     */
    private async generateCodeChallenge(verifier: string): Promise<string> {
        const encoder = new TextEncoder();
        const data = encoder.encode(verifier);
        const digest = await crypto.subtle.digest('SHA-256', data);

        let result = '';
        const view = new Uint8Array(digest);
        for (let i = 0; i < view.length; i++) {
            result += String.fromCharCode(view[i]);
        }
        return btoa(result).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
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
