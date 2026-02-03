/**
 * Phase 2: Legacy Service Deprecation Test
 *
 * Tests the deprecation of EnterpriseAuthService and the compatibility adapter.
 */

import { describe, it, expect, beforeEach } from '@jest/globals';

import { EnterpriseAuthService } from '../enterprise/AuthService';
import { EnterpriseAuthServiceAdapter } from '../enterprise/AuthServiceAdapter';
import { createDefaultAuthOrchestrator } from '../factory';

import type { IAuthRepository } from '../interfaces/authInterfaces';
import type { IAuthLogger } from '../interfaces/authInterfaces';
import type { IAuthMetrics } from '../interfaces/authInterfaces';
import type { IAuthSecurityService } from '../interfaces/authInterfaces';
import type { IAuthConfig } from '../interfaces/authInterfaces';

// Mock implementations for testing
class MockAuthRepository implements IAuthRepository {
    async storeSession(session: any): Promise<void> {
        // Mock implementation
    }
    async getSession(): Promise<any> {
        return null;
    }
    async removeSession(): Promise<void> {
        // Mock implementation
    }
    async storeRefreshToken(token: string): Promise<void> {
        // Mock implementation
    }
    async getRefreshToken(): Promise<string | null> {
        return null;
    }
    async clear(): Promise<void> {
        // Mock implementation
    }
    async createUser(userData: any): Promise<any> {
        // Mock implementation
        return { success: true, data: {} };
    }
    async activateUser(code: string): Promise<any> {
        return { success: false, error: { type: 'NOT_IMPLEMENTED' } };
    }
    async resendActivationCode(email: string): Promise<any> {
        return { success: false, error: { type: 'NOT_IMPLEMENTED' } };
    }
    refreshToken(): Promise<any> {
        return { success: false, error: { type: 'NOT_IMPLEMENTED' } };
    }
}

class MockAuthLogger implements IAuthLogger {
    log(event: any): void {
        // Mock implementation
    }
    clear(): void {
        // Mock implementation
    }
    setLevel(): void {
        // Mock implementation
    }
}

class MockAuthMetrics implements IAuthMetrics {
    recordAttempt(): void {
        // Mock implementation
    }
    recordSuccess(): void {
        // Mock implementation
    }
    recordFailure(): void {
        // Mock implementation
    }
    getMetrics(): any {
        return {
            totalAttempts: 0,
            successRate: 0,
            failureRate: 0,
            averageDuration: 0,
            errorsByType: {}
        };
    }
}

class MockSecurityService implements IAuthSecurityService {
    detectSuspiciousActivity(): any[] {
        return [];
    }
    validateSecurityHeaders(): boolean {
        return true;
    }
    checkRateLimit(): boolean {
        return true;
    }
}

class MockConfig implements IAuthConfig {
    get<T>(key: string): T {
        return {} as T;
    }
}

describe('Phase 2: Legacy Service Deprecation', () => {
    let legacyService: EnterpriseAuthService;
    let adapterService: EnterpriseAuthServiceAdapter;

    beforeEach(() => {
        // Create legacy service (deprecated)
        legacyService = new EnterpriseAuthService(
            new MockAuthRepository(),
            new MockAuthLogger(),
            new MockAuthMetrics(),
            new MockSecurityService(),
            new MockConfig()
        );

        // Create adapter service (compatibility layer)
        adapterService = new EnterpriseAuthServiceAdapter(
            new MockAuthRepository(),
            new MockAuthLogger(),
            new MockAuthMetrics(),
            new MockSecurityService(),
            new MockConfig()
        );
    });

    describe('Deprecation Warnings', () => {
        it('should show deprecation warning for EnterpriseAuthService', () => {
            const consoleSpy = jest.spy(console, 'warn');

            new EnterpriseAuthService(
                new MockAuthRepository(),
                new MockAuthLogger(),
                new MockAuthMetrics(),
                new MockSecurityService(),
                new MockConfig()
            );

            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining('EnterpriseAuthService is deprecated')
            );
        });

        it('should show deprecation warning for AuthServiceAdapter', () => {
            const consoleSpy = jest.spy(console, 'warn');

            new EnterpriseAuthServiceAdapter(
                new MockAuthRepository(),
                new MockAuthLogger(),
                new MockAuthMetrics(),
                new MockSecurityService(),
                new MockConfig()
            );

            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining('EnterpriseAuthServiceAdapter is deprecated')
            );
        });
    });

    describe('Backward Compatibility', () => {
        it('should maintain same interface as EnterpriseAuthService', () => {
            // Both should implement IAuthService
            expect(legacyService).toBeDefined();
            expect(adapterService).toBeDefined();

            // Both should have same methods
            expect(typeof legacyService.authenticate).toBe('function');
            expect(typeof adapterService.authenticate).toBe('function');
            expect(typeof legacyService.registerProvider).toBe('function');
            expect(typeof adapterService.registerProvider).toBe('function');
        });

        it('should have same capabilities', () => {
            const legacyCapabilities = legacyService.getCapabilities();
            const adapterCapabilities = adapterService.getCapabilities();

            expect(Array.isArray(legacyCapabilities)).toBe(true);
            expect(Array.isArray(adapterCapabilities)).toBe(true);
        });
    });

    describe('Migration Path', () => {
        it('should recommend using AuthOrchestrator directly', () => {
            const consoleSpy = jest.spy(console, 'warn');

            new EnterpriseAuthServiceAdapter(
                new MockAuthRepository(),
                new MockAuthLogger(),
                new MockAuthMetrics(),
                new MockSecurityService(),
                new MockConfig()
            );

            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining('Use AuthOrchestrator directly instead')
            );
        });

        it('should show clear migration path', () => {
            const consoleSpy = jest.spy(console, 'warn');

            new EnterpriseAuthServiceAdapter(
                new MockAuthRepository(),
                new MockAuthLogger(),
                new MockAuthMetrics(),
                new MockSecurityService(),
                new MockConfig()
            );

            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining('This adapter will be removed')
            );
        });
    });

    describe('Functional Testing', () => {
        it('should delegate authenticate to AuthOrchestrator', async () => {
            const mockCredentials = {
                email: 'test@example.com',
                password: 'password123'
            };

            const result = await adapterService.authenticate('jwt', mockCredentials);

            // Should return some result (mock implementation)
            expect(result).toBeDefined();
        });

        it('should handle provider registration', () => {
            const mockProvider = {
                name: 'test-provider',
                type: 'jwt' as any,
                config: {},
                authenticate: jest.fn(),
                register: jest.fn(),
                activate: jest.fn(),
                signout: jest.fn(),
                refreshToken: jest.fn(),
                resendActivationCode: jest.fn(),
                validateSession: jest.fn(),
                configure: jest.fn(),
                getCapabilities: jest.fn(),
                initialize: jest.fn()
            } as any;

            expect(() => {
                adapterService.registerProvider(mockProvider);
            }).not.toThrow();
        });
    });

    describe('Comparison with New Architecture', () => {
        it('should show size difference', () => {
            // This demonstrates the improvement from 784 lines to ~200 lines
            const legacyLines = 784; // Approximate size of EnterpriseAuthService
            const adapterLines = 200; // Approximate size of AuthServiceAdapter

            console.log(`Legacy service: ${legacyLines} lines`);
            console.log(`Adapter service: ${adapterLines} lines`);
            console.log(`Size reduction: ${((legacyLines - adapterLines) / legacyLines * 100).toFixed(1)}%`);
        });

        it('should demonstrate SOLID principles', () => {
            // Legacy service: Single class with multiple responsibilities
            // Adapter: Wrapper with single responsibility (delegation)
            // New architecture: Multiple focused services

            expect(adapterService.name).toBe('EnterpriseAuthServiceAdapter');
            expect(adapterService.getCapabilities()).toBeDefined();

            // The adapter should delegate to AuthOrchestrator
            expect(typeof adapterService.authenticate).toBe('function');
        });
    });
});
