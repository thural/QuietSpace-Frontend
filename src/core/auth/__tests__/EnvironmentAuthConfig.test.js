/**
 * Environment Auth Configuration Tests
 * 
 * Tests for environment-based authentication configuration including:
 * - Environment variable loading and parsing
 * - Configuration validation and defaults
 * - Environment detection
 * - Configuration watching and updates
 * - Type safety and runtime validation
 */

import { EnvironmentAuthConfig, AUTH_ENV_VARS, createEnvironmentAuthConfig, getCurrentEnvironment } from '../config/EnvironmentAuthConfig.js';
import { AuthProviderType } from '../types/auth.domain.types.js';

// Mock environment variables for testing
const mockEnv = {
    [AUTH_ENV_VARS.DEFAULT_PROVIDER]: 'oauth',
    [AUTH_ENV_VARS.ALLOWED_PROVIDERS]: 'oauth,saml,jwt',
    [AUTH_ENV_VARS.MFA_REQUIRED]: 'true',
    [AUTH_ENV_VARS.ENCRYPTION_ENABLED]: 'false',
    [AUTH_ENV_VARS.TOKEN_REFRESH_INTERVAL]: '300000',
    [AUTH_ENV_VARS.SESSION_TIMEOUT]: '900000',
    [AUTH_ENV_VARS.ENVIRONMENT]: 'test',
    [AUTH_ENV_VARS.API_BASE_URL]: 'https://api.test.com'
};

describe('EnvironmentAuthConfig', () => {
    let config;

    beforeEach(() => {
        config = createEnvironmentAuthConfig(mockEnv);
    });

    describe('Configuration Loading', () => {
        it('should load configuration from environment variables', () => {
            expect(config.get('defaultProvider')).toBe('oauth');
            expect(config.get('allowedProviders')).toEqual([
                AuthProviderType.OAUTH,
                AuthProviderType.SAML,
                AuthProviderType.JWT
            ]);
        });

        it('should parse boolean values correctly', () => {
            expect(config.get('mfaRequired')).toBe(true);
            expect(config.get('encryptionEnabled')).toBe(false);
        });

        it('should parse numeric values correctly', () => {
            expect(config.get('tokenRefreshInterval')).toBe(300000);
            expect(config.get('sessionTimeout')).toBe(900000);
        });

        it('should provide sensible defaults when environment variables are missing', () => {
            const defaultConfig = createEnvironmentAuthConfig({});

            expect(defaultConfig.get('defaultProvider')).toBe('jwt');
            expect(defaultConfig.get('mfaRequired')).toBe(false);
            expect(defaultConfig.get('encryptionEnabled')).toBe(true);
        });
    });

    describe('Provider Validation', () => {
        it('should validate provider is in allowed providers', () => {
            expect(config.validate().success).toBe(true);
        });

        it('should fail validation when provider is not in allowed providers', () => {
            const invalidConfig = createEnvironmentAuthConfig({
                [AUTH_ENV_VARS.DEFAULT_PROVIDER]: 'ldap',
                [AUTH_ENV_VARS.ALLOWED_PROVIDERS]: 'jwt,oauth'
            });

            const result = invalidConfig.validate();
            expect(result.success).toBe(false);
            expect(result.error?.message).toContain('not in allowed providers');
        });
    });

    describe('Configuration Watching', () => {
        it('should notify watchers of configuration changes', () => {
            const callback = jest.fn();
            const unsubscribe = config.watch('mfaRequired', callback);

            config.set('mfaRequired', false);
            expect(callback).toHaveBeenCalledWith(false);

            unsubscribe();
        });

        it('should allow unsubscribing from watchers', () => {
            const callback = jest.fn();
            const unsubscribe = config.watch('mfaRequired', callback);

            unsubscribe();
            config.set('mfaRequired', false);
            expect(callback).not.toHaveBeenCalled();
        });
    });

    describe('Configuration Reset', () => {
        it('should reset to environment defaults', () => {
            config.set('mfaRequired', false);
            expect(config.get('mfaRequired')).toBe(false);

            config.reset();
            expect(config.get('mfaRequired')).toBe(true); // Back to mock env value
        });
    });

    describe('Environment Detection', () => {
        it('should detect current environment correctly', () => {
            // This test would need to be adapted based on the actual environment
            const env = getCurrentEnvironment();
            expect(['development', 'test', 'staging', 'production']).toContain(env);
        });
    });
});

describe('AUTH_ENV_VARS', () => {
    it('should contain all required environment variable names', () => {
        expect(AUTH_ENV_VARS.DEFAULT_PROVIDER).toBe('AUTH_DEFAULT_PROVIDER');
        expect(AUTH_ENV_VARS.MFA_REQUIRED).toBe('AUTH_MFA_REQUIRED');
        expect(AUTH_ENV_VARS.TOKEN_REFRESH_INTERVAL).toBe('AUTH_TOKEN_REFRESH_INTERVAL');
    });
});

describe('createEnvironmentAuthConfig', () => {
    it('should create instance with custom environment', () => {
        const customEnv = {
            [AUTH_ENV_VARS.DEFAULT_PROVIDER]: 'saml'
        };

        const config = createEnvironmentAuthConfig(customEnv);
        expect(config.get('defaultProvider')).toBe('saml');
    });
});
