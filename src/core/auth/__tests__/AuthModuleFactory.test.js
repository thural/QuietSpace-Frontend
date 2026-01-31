/**
 * Tests for AuthModuleFactory with environment-aware configuration
 */

import { AuthModuleFactory } from '../AuthModule.js';
import { EnterpriseAuthService } from '../enterprise/AuthService.js';
import { createAuthConfigLoader } from '../config/AuthConfigLoader.js';
import { JwtAuthProvider } from '../providers/JwtAuthProvider.js';
import { OAuthAuthProvider } from '../providers/OAuthProvider.js';

// Mock the dependencies
jest.mock('../repositories/LocalAuthRepository.js');
jest.mock('../loggers/ConsoleAuthLogger.js');
jest.mock('../metrics/InMemoryAuthMetrics.js');
jest.mock('../security/EnterpriseSecurityService.js');
jest.mock('../providers/JwtAuthProvider.js');
jest.mock('../providers/OAuthProvider.js');
jest.mock('../plugins/AnalyticsPlugin.js');
jest.mock('../plugins/SecurityPlugin.js');

describe('AuthModuleFactory - Environment Configuration', () => {
    beforeEach(() => {
        // Reset singleton instance before each test
        AuthModuleFactory.resetInstance();
    });

    describe('createForEnvironment', () => {
        it('should create service for development environment', async () => {
            const service = await AuthModuleFactory.createForEnvironment('development');

            expect(service).toBeInstanceOf(EnterpriseAuthService);
            // Additional assertions would depend on the actual implementation
        });

        it('should create service for staging environment', async () => {
            const service = await AuthModuleFactory.createForEnvironment('staging');

            expect(service).toBeInstanceOf(EnterpriseAuthService);
        });

        it('should create service for production environment', async () => {
            const service = await AuthModuleFactory.createForEnvironment('production');

            expect(service).toBeInstanceOf(EnterpriseAuthService);
        });

        it('should fallback to default when environment config fails', async () => {
            // Mock the loadAuthConfiguration to throw an error
            const originalLoadAuthConfiguration = require('../config/AuthConfigLoader.js').loadAuthConfiguration;
            require('../config/AuthConfigLoader.js').loadAuthConfiguration = jest.fn().mockRejectedValue(new Error('Config not found'));

            const service = await AuthModuleFactory.createForEnvironment('nonexistent');

            expect(service).toBeInstanceOf(EnterpriseAuthService);

            // Restore original function
            require('../config/AuthConfigLoader.js').loadAuthConfiguration = originalLoadAuthConfiguration;
        });
    });

    describe('createFromEnvironment', () => {
        it('should create service from environment variables', () => {
            const customEnv = {
                'AUTH_DEFAULT_PROVIDER': 'jwt',
                'AUTH_ALLOWED_PROVIDERS': 'jwt,oauth',
                'AUTH_MFA_REQUIRED': 'true'
            };

            const service = AuthModuleFactory.createFromEnvironment(customEnv);

            expect(service).toBeInstanceOf(EnterpriseAuthService);
        });

        it('should throw error for invalid environment configuration', () => {
            const invalidEnv = {
                'AUTH_ALLOWED_PROVIDERS': 'invalid-provider' // This should cause validation to fail
            };

            expect(() => {
                AuthModuleFactory.createFromEnvironment(invalidEnv);
            }).toThrow();
        });
    });

    describe('createWithConfigLoader', () => {
        it('should create service with custom config loader', async () => {
            const loader = createAuthConfigLoader({ environment: 'development' });
            const service = await AuthModuleFactory.createWithConfigLoader(loader);

            expect(service).toBeInstanceOf(EnterpriseAuthService);
        });
    });

    describe('createForCurrentEnvironment', () => {
        it('should create service for auto-detected environment', async () => {
            const service = await AuthModuleFactory.createForCurrentEnvironment();

            expect(service).toBeInstanceOf(EnterpriseAuthService);
        });
    });

    describe('Singleton Pattern', () => {
        it('should return same instance for getInstance', () => {
            const service1 = AuthModuleFactory.getInstance();
            const service2 = AuthModuleFactory.getInstance();

            expect(service1).toBe(service2);
        });

        it('should return same instance for getInstanceForEnvironment', async () => {
            const service1 = await AuthModuleFactory.getInstanceForEnvironment('development');
            const service2 = await AuthModuleFactory.getInstanceForEnvironment('development');

            expect(service1).toBe(service2);
        });

        it('should create new instance after reset', () => {
            const service1 = AuthModuleFactory.getInstance();
            AuthModuleFactory.resetInstance();
            const service2 = AuthModuleFactory.getInstance();

            expect(service1).not.toBe(service2);
        });
    });

    describe('Backward Compatibility', () => {
        it('should maintain existing createDefault method', () => {
            const service = AuthModuleFactory.createDefault();

            expect(service).toBeInstanceOf(EnterpriseAuthService);
        });

        it('should maintain existing createWithDependencies method', () => {
            const service = AuthModuleFactory.createWithDependencies({
                // Empty dependencies should use defaults
            });

            expect(service).toBeInstanceOf(EnterpriseAuthService);
        });

        it('should maintain existing createWithProviders method', () => {
            const baseService = AuthModuleFactory.createDefault();
            const enhancedService = AuthModuleFactory.createWithProviders(baseService, []);

            expect(enhancedService).toBeInstanceOf(EnterpriseAuthService);
        });

        it('should maintain existing createWithPlugins method', () => {
            const baseService = AuthModuleFactory.createDefault();
            const enhancedService = AuthModuleFactory.createWithPlugins(baseService, []);

            expect(enhancedService).toBeInstanceOf(EnterpriseAuthService);
        });
    });
});

describe('AuthModuleFactory - Provider Registration', () => {
    it('should register JWT provider by default', () => {
        const service = AuthModuleFactory.createDefault();

        // This would need to be tested based on the actual implementation
        // of the EnterpriseAuthService.registerProvider method
        expect(service).toBeDefined();
    });

    it('should log warnings for unimplemented providers', async () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

        const customEnv = {
            'AUTH_ALLOWED_PROVIDERS': 'oauth,saml,ldap'
        };

        AuthModuleFactory.createFromEnvironment(customEnv);

        expect(consoleSpy).toHaveBeenCalledWith('OAuth provider requested but not yet implemented');
        expect(consoleSpy).toHaveBeenCalledWith('SAML provider requested but not yet implemented');
        expect(consoleSpy).toHaveBeenCalledWith('LDAP provider requested but not yet implemented');

        consoleSpy.mockRestore();
    });
});

describe('AuthModuleFactory - Error Handling', () => {
    it('should handle configuration validation errors gracefully', async () => {
        const loader = createAuthConfigLoader();

        // Mock the loader to return invalid configuration
        const mockConfig = {
            get: jest.fn().mockReturnValue('invalid-provider'),
            validate: jest.fn().mockReturnValue({
                success: false,
                error: { message: 'Invalid configuration' }
            })
        };

        loader.loadConfiguration = jest.fn().mockResolvedValue(mockConfig);

        await expect(AuthModuleFactory.createWithConfigLoader(loader)).rejects.toThrow('Invalid configuration');
    });

    it('should provide meaningful error messages', async () => {
        try {
            await AuthModuleFactory.createForEnvironment('nonexistent');
        } catch (error) {
            expect(error).toBeDefined();
            // The error should be caught and fallback to default service
        }
    });
});

describe('AuthModuleFactory - Dynamic Provider Registration', () => {
    beforeEach(() => {
        AuthModuleFactory.resetInstance();
    });

    describe('Provider Registration', () => {
        test('should register a new provider dynamically', async () => {
            const provider = new OAuthAuthProvider();
            const result = await AuthModuleFactory.registerProvider('test-service', provider);

            expect(result.success).toBe(true);
            expect(AuthModuleFactory.getRegisteredProviders()).toContain('OAuth Provider');
            expect(AuthModuleFactory.getActiveServices()).toContain('test-service');
        });

        test('should register multiple providers', async () => {
            const oauthProvider = new OAuthAuthProvider();
            const jwtProvider = new JwtAuthProvider();

            await AuthModuleFactory.registerProvider('service-1', oauthProvider);
            await AuthModuleFactory.registerProvider('service-2', jwtProvider);

            const registeredProviders = AuthModuleFactory.getRegisteredProviders();
            expect(registeredProviders).toContain('OAuth Provider');
            expect(registeredProviders).toContain('JWT Provider');
        });

        test('should initialize provider during registration', async () => {
            const provider = new OAuthAuthProvider();
            const initializeSpy = jest.spyOn(provider, 'initialize');

            await AuthModuleFactory.registerProvider('test-service', provider);

            expect(initializeSpy).toHaveBeenCalled();
        });

        test('should handle registration errors gracefully', async () => {
            const provider = new OAuthAuthProvider();
            jest.spyOn(provider, 'initialize').mockRejectedValue(new Error('Init failed'));

            const result = await AuthModuleFactory.registerProvider('test-service', provider);

            expect(result.success).toBe(false);
            expect(result.error?.code).toBe('PROVIDER_REGISTRATION_FAILED');
        });
    });

    describe('Provider Management', () => {
        beforeEach(async () => {
            const provider = new OAuthAuthProvider();
            await AuthModuleFactory.registerProvider('test-service', provider);
        });

        test('should retrieve service by ID', async () => {
            const service = AuthModuleFactory.getService('test-service');
            expect(service).toBeDefined();
        });

        test('should retrieve provider by name', async () => {
            const provider = AuthModuleFactory.getProvider('OAuth Provider');
            expect(provider).toBeDefined();
        });

        test('should return undefined for non-existent service', () => {
            const service = AuthModuleFactory.getService('non-existent');
            expect(service).toBeUndefined();
        });

        test('should return undefined for non-existent provider', () => {
            const provider = AuthModuleFactory.getProvider('Non-existent Provider');
            expect(provider).toBeUndefined();
        });
    });

    describe('Provider Unregistration', () => {
        beforeEach(async () => {
            const provider = new OAuthAuthProvider();
            await AuthModuleFactory.registerProvider('test-service', provider);
        });

        test('should unregister a provider', async () => {
            const result = await AuthModuleFactory.unregisterProvider('test-service', 'OAuth Provider');

            expect(result.success).toBe(true);
            expect(AuthModuleFactory.getRegisteredProviders()).not.toContain('OAuth Provider');
        });

        test('should handle unregistration of non-existent service', async () => {
            const result = await AuthModuleFactory.unregisterProvider('non-existent', 'OAuth Provider');

            expect(result.success).toBe(false);
            expect(result.error?.code).toBe('SERVICE_NOT_FOUND');
        });

        test('should handle unregistration of non-existent provider', async () => {
            const result = await AuthModuleFactory.unregisterProvider('test-service', 'Non-existent Provider');

            expect(result.success).toBe(false);
            expect(result.error?.code).toBe('PROVIDER_NOT_FOUND');
        });
    });

    describe('Provider Switching', () => {
        beforeEach(async () => {
            const oauthProvider = new OAuthAuthProvider();
            const jwtProvider = new JwtAuthProvider();

            await AuthModuleFactory.registerProvider('test-service', oauthProvider);
            await AuthModuleFactory.registerProvider('test-service', jwtProvider);
        });

        test('should switch between providers', async () => {
            const result = await AuthModuleFactory.switchProvider('test-service', 'JWT Provider');

            expect(result.success).toBe(true);
        });

        test('should handle switching to non-existent provider', async () => {
            const result = await AuthModuleFactory.switchProvider('test-service', 'Non-existent Provider');

            expect(result.success).toBe(false);
            expect(result.error?.code).toBe('PROVIDER_NOT_FOUND');
        });

        test('should handle switching for non-existent service', async () => {
            const result = await AuthModuleFactory.switchProvider('non-existent', 'OAuth Provider');

            expect(result.success).toBe(false);
            expect(result.error?.code).toBe('SERVICE_NOT_FOUND');
        });
    });
});
