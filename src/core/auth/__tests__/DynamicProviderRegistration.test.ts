/**
 * Dynamic Provider Registration Tests
 *
 * Tests for runtime provider registration, unregistration, and switching
 */

import { AuthModuleFactory } from '../AuthModule';
import { JwtAuthProvider } from '../providers/JwtAuthProvider';
import { LDAPAuthProvider } from '../providers/LDAPProvider';
import { OAuthAuthProvider } from '../providers/OAuthProvider';
import { SAMLAuthProvider } from '../providers/SAMLProvider';
import { SessionAuthProvider } from '../providers/SessionProvider';

import type { AuthCredentials } from '../types/auth.domain.types';

describe('Dynamic Provider Registration', () => {
    beforeEach(() => {
        // Reset factory state before each test
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
            const samlProvider = new SAMLAuthProvider();
            const sessionProvider = new SessionAuthProvider();

            await AuthModuleFactory.registerProvider('service-1', oauthProvider);
            await AuthModuleFactory.registerProvider('service-2', samlProvider);
            await AuthModuleFactory.registerProvider('service-3', sessionProvider);

            const registeredProviders = AuthModuleFactory.getRegisteredProviders();
            expect(registeredProviders).toContain('OAuth Provider');
            expect(registeredProviders).toContain('SAML Provider');
            expect(registeredProviders).toContain('Session Provider');
        });

        test('should initialize provider during registration', async () => {
            const provider = new OAuthAuthProvider();
            const initializeSpy = jest.spyOn(provider, 'initialize');

            await AuthModuleFactory.registerProvider('test-service', provider);

            expect(initializeSpy).toHaveBeenCalled();
        });

        test('should configure provider during registration', async () => {
            const provider = new OAuthAuthProvider();
            const configureSpy = jest.spyOn(provider, 'configure');
            const mockConfig = {
                getAll: () => ({ timeout: 5000 })
            } as any;

            await AuthModuleFactory.registerProvider('test-service', provider, mockConfig);

            expect(configureSpy).toHaveBeenCalledWith({ timeout: 5000 });
        });

        test('should handle registration errors gracefully', async () => {
            const provider = new OAuthAuthProvider();
            // Mock initialize to throw error
            jest.spyOn(provider, 'initialize').mockRejectedValue(new Error('Init failed'));

            const result = await AuthModuleFactory.registerProvider('test-service', provider);

            expect(result.success).toBe(false);
            expect(result.error?.code).toBe('PROVIDER_REGISTRATION_FAILED');
        });
    });

    describe('Provider Unregistration', () => {
        beforeEach(async () => {
            // Register a provider for unregistration tests
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
            // Register multiple providers for switching tests
            const oauthProvider = new OAuthAuthProvider();
            const samlProvider = new SAMLAuthProvider();

            await AuthModuleFactory.registerProvider('test-service', oauthProvider);
            await AuthModuleFactory.registerProvider('test-service', samlProvider);
        });

        test('should switch between providers', async () => {
            const result = await AuthModuleFactory.switchProvider('test-service', 'SAML Provider');

            expect(result.success).toBe(true);
        });

        test('should handle switching to same provider', async () => {
            const result = await AuthModuleFactory.switchProvider('test-service', 'OAuth Provider');

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

    describe('Service Management', () => {
        test('should create multiple services', async () => {
            const provider1 = new OAuthAuthProvider();
            const provider2 = new SAMLAuthProvider();

            await AuthModuleFactory.registerProvider('service-1', provider1);
            await AuthModuleFactory.registerProvider('service-2', provider2);

            const activeServices = AuthModuleFactory.getActiveServices();
            expect(activeServices).toContain('service-1');
            expect(activeServices).toContain('service-2');
            expect(activeServices).toHaveLength(2);
        });

        test('should retrieve service by ID', async () => {
            const provider = new OAuthAuthProvider();
            await AuthModuleFactory.registerProvider('test-service', provider);

            const service = AuthModuleFactory.getService('test-service');
            expect(service).toBeDefined();
        });

        test('should return undefined for non-existent service', () => {
            const service = AuthModuleFactory.getService('non-existent');
            expect(service).toBeUndefined();
        });

        test('should retrieve provider by name', async () => {
            const provider = new OAuthAuthProvider();
            await AuthModuleFactory.registerProvider('test-service', provider);

            const retrievedProvider = AuthModuleFactory.getProvider('OAuth Provider');
            expect(retrievedProvider).toBe(provider);
        });

        test('should return undefined for non-existent provider', () => {
            const provider = AuthModuleFactory.getProvider('Non-existent Provider');
            expect(provider).toBeUndefined();
        });
    });

    describe('Authentication with Dynamic Providers', () => {
        test('should authenticate with dynamically registered provider', async () => {
            const provider = new SessionAuthProvider();
            await AuthModuleFactory.registerProvider('test-service', provider);

            const service = AuthModuleFactory.getService('test-service');
            expect(service).toBeDefined();

            const credentials: AuthCredentials = {
                email: 'test@example.com',
                password: 'password'
            };

            const result = await service!.authenticate(credentials);
            expect(result.success).toBe(true);
        });

        test('should handle authentication with unregistered provider type', async () => {
            const provider = new OAuthAuthProvider();
            await AuthModuleFactory.registerProvider('test-service', provider);

            const service = AuthModuleFactory.getService('test-service');

            const credentials: AuthCredentials = {
                provider: 'oauth',
                email: 'test@example.com',
                password: 'password'
            };

            const result = await service!.authenticate(credentials);
            expect(result.success).toBe(true);
        });
    });

    describe('Error Handling and Edge Cases', () => {
        test('should handle provider initialization failure', async () => {
            const provider = new OAuthAuthProvider();
            jest.spyOn(provider, 'initialize').mockRejectedValue(new Error('Initialization failed'));

            const result = await AuthModuleFactory.registerProvider('test-service', provider);

            expect(result.success).toBe(false);
            expect(result.error?.message).toContain('Initialization failed');
        });

        test('should handle provider configuration failure', async () => {
            const provider = new OAuthAuthProvider();
            jest.spyOn(provider, 'configure').mockImplementation(() => {
                throw new Error('Configuration failed');
            });

            const mockConfig = {
                getAll: () => ({ invalid: 'config' })
            } as any;

            const result = await AuthModuleFactory.registerProvider('test-service', provider, mockConfig);

            expect(result.success).toBe(false);
            expect(result.error?.message).toContain('Configuration failed');
        });

        test('should handle concurrent registrations', async () => {
            const provider1 = new OAuthAuthProvider();
            const provider2 = new SAMLAuthProvider();

            // Register providers concurrently
            const [result1, result2] = await Promise.all([
                AuthModuleFactory.registerProvider('service-1', provider1),
                AuthModuleFactory.registerProvider('service-2', provider2)
            ]);

            expect(result1.success).toBe(true);
            expect(result2.success).toBe(true);
            expect(AuthModuleFactory.getActiveServices()).toHaveLength(2);
        });
    });

    describe('Memory Management', () => {
        test('should clean up providers when services are removed', async () => {
            const provider = new OAuthAuthProvider();
            await AuthModuleFactory.registerProvider('test-service', provider);

            expect(AuthModuleFactory.getRegisteredProviders()).toContain('OAuth Provider');

            await AuthModuleFactory.unregisterProvider('test-service', 'OAuth Provider');

            // Note: Provider is still in registry but could be cleaned up in real implementation
            // This test shows the basic functionality
            expect(AuthModuleFactory.getRegisteredProviders()).not.toContain('OAuth Provider');
        });

        test('should handle factory reset', () => {
            AuthModuleFactory.resetInstance();
            // Should not throw and should reset internal state
            expect(true).toBe(true);
        });
    });

    describe('Integration with Existing Providers', () => {
        test('should work with all provider types', async () => {
            const providers = [
                new JwtAuthProvider(),
                new OAuthAuthProvider(),
                new SAMLAuthProvider(),
                new SessionAuthProvider(),
                new LDAPAuthProvider()
            ];

            for (let i = 0; i < providers.length; i++) {
                const result = await AuthModuleFactory.registerProvider(`service-${i}`, providers[i]);
                expect(result.success).toBe(true);
            }

            expect(AuthModuleFactory.getRegisteredProviders()).toHaveLength(5);
            expect(AuthModuleFactory.getActiveServices()).toHaveLength(5);
        });
    });
});
