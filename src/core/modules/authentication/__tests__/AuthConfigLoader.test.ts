/**
 * Tests for AuthConfigLoader
 */

import { FileBasedAuthConfig, createAuthConfigLoader, loadAuthConfiguration } from '../config/AuthConfigLoader';
import { AuthProviderType } from '../types/auth.domain.types';

import type { AuthConfigLoader } from '../config/AuthConfigLoader';

describe('AuthConfigLoader', () => {
    let loader: AuthConfigLoader;

    beforeEach(() => {
        loader = createAuthConfigLoader();
    });

    describe('Configuration Loading', () => {
        it('should load development configuration', async () => {
            const config = await loader.loadConfiguration();

            expect(config.get('defaultProvider')).toBe('jwt');
            expect(config.get('allowedProviders')).toContain(AuthProviderType.JWT);
            expect(config.get('allowedProviders')).toContain(AuthProviderType.OAUTH);
        });

        it('should load staging configuration', async () => {
            const stagingLoader = createAuthConfigLoader({ environment: 'staging' });
            const config = await stagingLoader.loadConfiguration();

            expect(config.get('defaultProvider')).toBe('oauth');
            expect(config.get('mfaRequired')).toBe(true);
            expect(config.get('apiBaseUrl')).toBe('https://api-staging.quietspace.com');
        });

        it('should load production configuration', async () => {
            const prodLoader = createAuthConfigLoader({ environment: 'production' });
            const config = await prodLoader.loadConfiguration();

            expect(config.get('defaultProvider')).toBe('saml');
            expect(config.get('mfaRequired')).toBe(true);
            expect(config.get('debugMode')).toBe(false);
            expect(config.get('apiBaseUrl')).toBe('https://api.quietspace.com');
        });

        it('should merge base configuration with environment-specific', async () => {
            const config = await loader.loadConfiguration();

            // Base config values should be preserved
            expect(config.get('encryptionEnabled')).toBe(true);
            expect(config.get('auditEnabled')).toBe(true);

            // Environment-specific values should override base
            expect(config.get('rateLimitingEnabled')).toBe(true); // Overridden in development
        });
    });

    describe('Environment Variable Overrides', () => {
        it('should apply environment variable overrides', async () => {
            const customEnv = {
                'AUTH_DEFAULT_PROVIDER': 'saml',
                'AUTH_MFA_REQUIRED': 'true',
                'AUTH_TOKEN_REFRESH_INTERVAL': '300000'
            };

            const envLoader = createAuthConfigLoader({
                customEnv,
                enableEnvOverrides: true
            });

            const config = await envLoader.loadConfiguration();

            expect(config.get('defaultProvider')).toBe('saml');
            expect(config.get('mfaRequired')).toBe(true);
            expect(config.get('tokenRefreshInterval')).toBe(300000);
        });

        it('should skip environment overrides when disabled', async () => {
            const customEnv = {
                'AUTH_DEFAULT_PROVIDER': 'saml',
                'AUTH_MFA_REQUIRED': 'true'
            };

            const envLoader = createAuthConfigLoader({
                customEnv,
                enableEnvOverrides: false
            });

            const config = await envLoader.loadConfiguration();

            // Should use file configuration, not environment variables
            expect(config.get('defaultProvider')).toBe('jwt'); // From development config
            expect(config.get('mfaRequired')).toBe(false); // From development config
        });
    });

    describe('Configuration Watching', () => {
        it('should notify watchers of configuration changes', async () => {
            const config = new FileBasedAuthConfig({
                provider: 'jwt',
                mfaRequired: false
            });

            const callback = jest.fn();
            const unsubscribe = config.watch('mfaRequired', callback);

            config.set('mfaRequired', true);
            expect(callback).toHaveBeenCalledWith(true);

            unsubscribe();
        });

        it('should allow unsubscribing from watchers', async () => {
            const config = new FileBasedAuthConfig({
                provider: 'jwt',
                mfaRequired: false
            });

            const callback = jest.fn();
            const unsubscribe = config.watch('mfaRequired', callback);

            unsubscribe();
            config.set('mfaRequired', true);
            expect(callback).not.toHaveBeenCalled();
        });
    });

    describe('Configuration Merging', () => {
        it('should deep merge nested objects', async () => {
            const config = new FileBasedAuthConfig({
                featureFlags: {
                    mfaRequired: false,
                    encryptionEnabled: true
                },
                token: {
                    refreshInterval: 540000
                }
            });

            config.updateConfig({
                featureFlags: {
                    mfaRequired: true
                },
                token: {
                    expiration: 7200000
                }
            });

            expect(config.get('featureFlags')).toEqual({
                mfaRequired: true,
                encryptionEnabled: true // Preserved from original
            });

            expect(config.get('token')).toEqual({
                refreshInterval: 540000, // Preserved from original
                expiration: 7200000 // Added
            });
        });
    });

    describe('Environment Detection', () => {
        it('should detect environment correctly', () => {
            expect(loader.getEnvironment()).toBe('development');
        });

        it('should use custom environment when provided', () => {
            const customLoader = createAuthConfigLoader({ environment: 'staging' });
            expect(customLoader.getEnvironment()).toBe('staging');
        });
    });

    describe('Error Handling', () => {
        it('should fallback to environment-only config when files fail', async () => {
            const failingLoader = createAuthConfigLoader({
                configDir: '/nonexistent/path',
                enableEnvOverrides: true
            });

            // Should not throw error, should fallback to environment config
            const config = await failingLoader.loadConfiguration();
            expect(config).toBeDefined();
        });
    });
});

describe('FileBasedAuthConfig', () => {
    let config: FileBasedAuthConfig;

    beforeEach(() => {
        config = new FileBasedAuthConfig({
            provider: 'jwt',
            defaultProvider: 'jwt',
            allowedProviders: ['jwt'],
            mfaRequired: false,
            tokenRefreshInterval: 540000
        });
    });

    describe('Configuration Access', () => {
        it('should get configuration values', () => {
            expect(config.get('provider')).toBe('jwt');
            expect(config.get('mfaRequired')).toBe(false);
            expect(config.get('tokenRefreshInterval')).toBe(540000);
        });

        it('should set configuration values', () => {
            config.set('mfaRequired', true);
            expect(config.get('mfaRequired')).toBe(true);
        });

        it('should get all configuration', () => {
            const allConfig = config.getAll();
            expect(allConfig.provider).toBe('jwt');
            expect(allConfig.mfaRequired).toBe(false);
        });
    });

    describe('Configuration Updates', () => {
        it('should update configuration and notify watchers', () => {
            const callback = jest.fn();
            config.watch('mfaRequired', callback);

            config.updateConfig({ mfaRequired: true });
            expect(callback).toHaveBeenCalledWith(true);
            expect(config.get('mfaRequired')).toBe(true);
        });
    });
});

describe('Factory Functions', () => {
    it('should create loader with default options', () => {
        const loader = createAuthConfigLoader();
        expect(loader.getEnvironment()).toBe('development');
    });

    it('should create loader with custom options', () => {
        const loader = createAuthConfigLoader({
            environment: 'production',
            enableEnvOverrides: false
        });
        expect(loader.getEnvironment()).toBe('production');
    });

    it('should load configuration with utility function', async () => {
        const config = await loadAuthConfiguration('staging');
        expect(config).toBeDefined();
        expect(config.get('defaultProvider')).toBe('oauth');
    });
});
