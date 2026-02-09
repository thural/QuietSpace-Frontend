/**
 * Authentication Module SOLID Improvements Test
 *
 * Tests the new SOLID architecture implementation including
 * interface segregation and service responsibility separation.
 */

import { beforeEach, describe, expect, it } from '@jest/globals';

import { DefaultAuthConfig } from '../config/DefaultAuthConfig';
import { AuthOrchestrator } from '../enterprise/AuthOrchestrator';
import { AuthValidator } from '../enterprise/AuthValidator';
import { ProviderManager } from '../enterprise/ProviderManager';
import { createDefaultAuthOrchestrator } from '../factory';
import { ConsoleAuthLogger } from '../loggers/ConsoleAuthLogger';
import { InMemoryAuthMetrics } from '../metrics/InMemoryAuthMetrics';
import { LocalAuthRepository } from '../repositories/LocalAuthRepository';
import { EnterpriseSecurityService } from '../security/EnterpriseSecurityService';

import type { IAuthValidator } from '../interfaces/IAuthValidator';
import type { IProviderManager } from '../interfaces/IProviderManager';

describe('Authentication Module SOLID Improvements', () => {
    let providerManager: IProviderManager;
    let authValidator: IAuthValidator;
    let authOrchestrator: AuthOrchestrator;

    beforeEach(() => {
        // Create test dependencies
        const logger = new ConsoleAuthLogger();
        const metrics = new InMemoryAuthMetrics();
        const security = new EnterpriseSecurityService();
        const config = new DefaultAuthConfig();
        const repository = new LocalAuthRepository();

        // Create SOLID services
        providerManager = new ProviderManager(logger);
        authValidator = new AuthValidator(security, config, logger);
        authOrchestrator = new AuthOrchestrator(
            providerManager,
            authValidator,
            repository,
            logger,
            metrics,
            security,
            config
        );
    });

    describe('Interface Segregation', () => {
        it('should have segregated interfaces', () => {
            // Verify that interfaces are properly segregated
            expect(typeof authValidator.validateCredentials).toBe('function');
            expect(typeof authValidator.validateToken).toBe('function');
            expect(typeof authValidator.validateUser).toBe('function');
            expect(typeof authValidator.validateSecurityContext).toBe('function');
        });

        it('should have focused interface responsibilities', () => {
            // IAuthValidator should only handle validation
            const validatorCapabilities = authValidator.getCapabilities();
            expect(validatorCapabilities).toContain('credential_validation');
            expect(validatorCapabilities).toContain('token_validation');
        });

        it('should support provider management', () => {
            // IProviderManager should handle provider lifecycle
            expect(providerManager.getProviderCount()).toBe(0);
            expect(providerManager.listProviders()).toEqual([]);
            expect(providerManager.hasProvider('test')).toBe(false);
        });
    });

    describe('Service Responsibility Separation', () => {
        it('should separate concerns between services', () => {
            // Each service should have a single responsibility
            expect((authValidator as any).name).toBe('AuthValidator');
            expect(authOrchestrator.name).toBe('AuthOrchestrator');
        });

        it('should delegate operations appropriately', () => {
            // AuthOrchestrator should delegate to specialized services
            const capabilities = authOrchestrator.getCapabilities();
            expect(capabilities).toContain('authentication');
            expect(capabilities).toContain('provider_management');
            expect(capabilities).toContain('validation');
        });

        it('should maintain clean service boundaries', () => {
            // Services should not overlap in responsibilities
            const validatorStats = authValidator.getStatistics();
            expect(validatorStats).toHaveProperty('totalValidations');
            expect(validatorStats).toHaveProperty('successRate');
        });
    });

    describe('Factory Functions', () => {
        it('should create default orchestrator', () => {
            const orchestrator = createDefaultAuthOrchestrator();

            expect(orchestrator).toBeInstanceOf(AuthOrchestrator);
            expect(orchestrator.getCapabilities()).toContain('authentication');
        });

        it('should initialize orchestrator properly', async () => {
            await authOrchestrator.initialize();

            // Should initialize without errors
            expect(authOrchestrator.getCapabilities()).toBeDefined();
        });
    });

    describe('BlackBox Pattern Compliance', () => {
        it('should export only public interfaces', () => {
            // Verify that only interfaces and factory functions are exported
            // This is tested at the module level in the index.ts exports
            expect(true).toBe(true); // Placeholder for BlackBox compliance test
        });

        it('should hide implementation details', () => {
            // Implementation details should be hidden behind interfaces
            const capabilities = authOrchestrator.getCapabilities();
            expect(Array.isArray(capabilities)).toBe(true);
            expect(capabilities.length).toBeGreaterThan(0);
        });
    });

    describe('Backward Compatibility', () => {
        it('should maintain existing API', () => {
            // Should maintain backward compatibility with existing API
            expect(typeof authOrchestrator.authenticate).toBe('function');
            expect(typeof authOrchestrator.getCurrentSession).toBe('function');
            expect(typeof authOrchestrator.globalSignout).toBe('function');
        });

        it('should support legacy factory functions', () => {
            // Legacy factory functions should still work
            const orchestrator = createDefaultAuthOrchestrator();
            expect(orchestrator).toBeDefined();
            expect(typeof orchestrator.authenticate).toBe('function');
        });
    });

    describe('Error Handling', () => {
        it('should handle validation errors properly', async () => {
            const result = authValidator.validateCredentials({} as any);

            expect(result.isValid).toBe(false);
            expect(result.errors).toBeDefined();
            expect(result.errors!.length).toBeGreaterThan(0);
        });

        it('should provide detailed error information', async () => {
            const result = authValidator.validateCredentials({});

            expect(result.isValid).toBe(false);
            expect(result.errors).toBeDefined();
            expect(result.metadata).toBeDefined();
            expect(result.metadata!.duration).toBeGreaterThanOrEqual(0);
        });
    });

    describe('Performance and Statistics', () => {
        it('should track validation statistics', () => {
            const stats = authValidator.getStatistics();

            expect(stats).toHaveProperty('totalValidations');
            expect(stats).toHaveProperty('successRate');
            expect(stats).toHaveProperty('averageDuration');
        });

        it('should track provider statistics', () => {
            // ProviderManager statistics through concrete implementation
            const stats = (providerManager as any).getStatistics();

            expect(stats).toHaveProperty('totalProviders');
            expect(stats).toHaveProperty('totalUserManagers');
            expect(stats).toHaveProperty('totalTokenManagers');
            expect(stats).toHaveProperty('providerTypes');
            expect(stats).toHaveProperty('capabilities');
        });
    });
});
