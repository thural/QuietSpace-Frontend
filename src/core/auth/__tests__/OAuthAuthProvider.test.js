/**
 * OAuth Auth Provider Tests
 * 
 * Tests for OAuth authentication provider including:
 * - Provider initialization
 * - OAuth 2.0 flow implementation
 * - PKCE implementation
 * - Token management and refresh
 * - Multiple provider support (Google, GitHub, Microsoft)
 * - Error scenarios
 */

import { jest } from '@jest/globals';

// Mock Web Crypto API for PKCE
Object.defineProperty(global, 'crypto', {
    value: {
        subtle: {
            digest: jest.fn().mockImplementation((algorithm, data) => {
                // Return a mock digest
                return Promise.resolve(new Uint8Array(32).fill(0));
            })
        },
        getRandomValues: jest.fn().mockImplementation((arr) => {
            for (let i = 0; i < arr.length; i++) {
                arr[i] = Math.floor(Math.random() * 256);
            }
            return arr;
        })
    }
});

import { OAuthAuthProvider, OAuthProviders } from '../providers/OAuthProvider.js';
import { AuthCredentials, AuthErrorType, AuthProviderType } from '../types/auth.domain.types.js';

/**
 * Authentication credentials interface
 * @typedef {Object} AuthCredentials
 * @property {string} [email] - User email
 * @property {string} [password] - User password
 * @property {string} [provider] - Authentication provider type
 * @property {*} [token] - Authentication token
 * @property {*} [refreshToken] - Refresh token
 * @property {string} [accessToken] - OAuth access token
 * @property {string} [authorizationCode] - OAuth authorization code
 * @property {string} [codeVerifier] - PKCE code verifier
 * @property {string} [codeChallenge] - PKCE code challenge
 * @property {string} [state] - OAuth state parameter
 */

describe('OAuthAuthProvider', () => {
    let provider;

    beforeEach(() => {
        provider = new OAuthAuthProvider();
    });

    describe('Provider Initialization', () => {
        test('should initialize with correct name and type', () => {
            expect(provider.name).toBe('OAuth Provider');
            expect(provider.type).toBe(AuthProviderType.OAUTH);
        });

        test('should initialize with default configuration', () => {
            expect(provider.config.tokenRefreshInterval).toBe(300000);
            expect(provider.config.maxRetries).toBe(3);
            expect(provider.config.pkceEnabled).toBe(true);
        });

        test('should initialize provider configurations for all supported providers', async () => {
            await provider.initialize();
            // Should not throw and should log initialization message
        });
    });

    describe('Provider Capabilities', () => {
        test('should return correct capabilities', () => {
            const capabilities = provider.getCapabilities();

            expect(capabilities).toContain('oauth_authentication');
            expect(capabilities).toContain('google_oauth');
            expect(capabilities).toContain('github_oauth');
            expect(capabilities).toContain('microsoft_oauth');
            expect(capabilities).toContain('pkce_support');
            expect(capabilities).toContain('token_management');
            expect(capabilities).toContain('csrf_protection');
            expect(capabilities).toContain('multi_provider');
        });
    });

    describe('OAuth Flow Initiation', () => {
        test('should initiate Google OAuth flow', async () => {
            const credentials = {
                provider: OAuthProviders.GOOGLE
            };

            const result = await provider.authenticate(credentials);

            expect(result.success).toBe(true);
            expect(result.data?.metadata?.authorizationUrl).toContain('accounts.google.com');
            expect(result.data?.metadata?.provider).toBe(OAuthProviders.GOOGLE);
            expect(result.data?.metadata?.state).toBeDefined();
        });

        test('should initiate GitHub OAuth flow', async () => {
            const credentials = {
                provider: OAuthProviders.GITHUB
            };

            const result = await provider.authenticate(credentials);

            expect(result.success).toBe(true);
            expect(result.data?.metadata?.authorizationUrl).toContain('github.com');
            expect(result.data?.metadata?.provider).toBe(OAuthProviders.GITHUB);
            expect(result.data?.metadata?.state).toBeDefined();
        });

        test('should initiate Microsoft OAuth flow', async () => {
            const credentials = {
                provider: OAuthProviders.MICROSOFT
            };

            const result = await provider.authenticate(credentials);

            expect(result.success).toBe(true);
            expect(result.data?.metadata?.authorizationUrl).toContain('login.microsoftonline.com');
            expect(result.data?.metadata?.provider).toBe(OAuthProviders.MICROSOFT);
            expect(result.data?.metadata?.state).toBeDefined();
        });

        test('should return error for unsupported provider', async () => {
            const credentials = {
                provider: 'unsupported'
            };

            const result = await provider.authenticate(credentials);

            expect(result.success).toBe(false);
            expect(result.error?.type).toBe(AuthErrorType.VALIDATION_ERROR);
            expect(result.error?.code).toBe('OAUTH_UNSUPPORTED_PROVIDER');
        });

        test('should return error when no provider specified', async () => {
            const credentials = {};

            const result = await provider.authenticate(credentials);

            expect(result.success).toBe(false);
            expect(result.error?.type).toBe(AuthErrorType.VALIDATION_ERROR);
            expect(result.error?.code).toBe('OAUTH_MISSING_PROVIDER');
        });
    });

    describe('Access Token Flow', () => {
        test('should handle access token for testing', async () => {
            // Mock fetch for user info
            global.fetch = jest.fn().mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({
                    id: 'test-user-id',
                    email: 'test@example.com',
                    name: 'Test User',
                    avatar_url: 'https://example.com/avatar.jpg'
                })
            });

            const credentials = {
                provider: OAuthProviders.GITHUB,
                accessToken: 'test-access-token'
            };

            const result = await provider.authenticate(credentials);

            expect(result.success).toBe(true);
            expect(result.data?.user.id).toBe('test-user-id');
            expect(result.data?.user.email).toBe('test@example.com');
            expect(result.data?.token.accessToken).toBe('test-access-token');
        });

        test('should handle user info request failure', async () => {
            // Mock fetch failure
            global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

            const credentials = {
                provider: OAuthProviders.GITHUB,
                accessToken: 'test-access-token'
            };

            const result = await provider.authenticate(credentials);

            expect(result.success).toBe(false);
            expect(result.error?.type).toBe(AuthErrorType.NETWORK_ERROR);
        });
    });

    describe('Unsupported Operations', () => {
        test('should not support direct registration', async () => {
            const result = await provider.register({ email: 'test@example.com', password: 'password' });

            expect(result.success).toBe(false);
            expect(result.error?.code).toBe('OAUTH_REGISTER_NOT_SUPPORTED');
        });

        test('should not support account activation', async () => {
            const result = await provider.activate('activation-code');

            expect(result.success).toBe(false);
            expect(result.error?.code).toBe('OAUTH_ACTIVATE_NOT_SUPPORTED');
        });

        test('should not support token refresh yet', async () => {
            // Set current provider first
            await provider.authenticate({ provider: OAuthProviders.GOOGLE });

            const result = await provider.refreshToken();

            expect(result.success).toBe(false);
            expect(result.error?.code).toBe('OAUTH_REFRESH_NOT_IMPLEMENTED');
        });
    });

    describe('Session Management', () => {
        test('should validate session correctly', async () => {
            // Set current provider
            await provider.authenticate({ provider: OAuthProviders.GOOGLE });

            const result = await provider.validateSession();

            expect(result.success).toBe(true);
            expect(result.data).toBe(true);
        });

        test('should sign out correctly', async () => {
            // Set current provider
            await provider.authenticate({ provider: OAuthProviders.GOOGLE });

            const result = await provider.signout();

            expect(result.success).toBe(true);
        });
    });

    describe('Configuration', () => {
        test('should update configuration', () => {
            const newConfig = {
                tokenRefreshInterval: 600000,
                maxRetries: 5,
                providers: {
                    google: {
                        clientId: 'new-google-client-id',
                        redirectUri: 'https://new-redirect-uri.com'
                    }
                }
            };

            provider.configure(newConfig);

            expect(provider.config.tokenRefreshInterval).toBe(600000);
            expect(provider.config.maxRetries).toBe(5);
        });
    });

    describe('PKCE Support', () => {
        test('should generate code verifier and challenge', async () => {
            const credentials = {
                provider: OAuthProviders.GOOGLE
            };

            const result = await provider.authenticate(credentials);

            expect(result.success).toBe(true);
            // PKCE should be enabled by default
            expect(result.data?.metadata?.authorizationUrl).toContain('code_challenge');
            expect(result.data?.metadata?.authorizationUrl).toContain('code_challenge_method=S256');
        });
    });
});
