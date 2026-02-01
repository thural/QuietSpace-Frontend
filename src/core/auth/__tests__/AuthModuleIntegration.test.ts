/**
 * Integration test for AuthModuleFactory with DI container
 */

import { EnterpriseAuthAdapter } from '../adapters/EnterpriseAuthAdapter';
import { AuthModuleFactory } from '../AuthModule';
import { EnterpriseAuthService } from '../enterprise/AuthService';

describe('AuthModule Integration', () => {
    test('AuthModuleFactory should create enterprise auth service', () => {
        const authService = AuthModuleFactory.createDefault();

        expect(authService).toBeInstanceOf(EnterpriseAuthService);
        expect(authService).toBeDefined();
    });

    test('EnterpriseAuthAdapter should wrap enterprise auth service', () => {
        const authService = AuthModuleFactory.createDefault();
        const adapter = new EnterpriseAuthAdapter(authService);

        expect(adapter).toBeInstanceOf(EnterpriseAuthAdapter);
        expect(adapter).toBeDefined();
    });

    test('AuthModuleFactory should create service with custom dependencies', () => {
        const authService = AuthModuleFactory.createWithDependencies({
            // Test with minimal dependencies
        });

        expect(authService).toBeInstanceOf(EnterpriseAuthService);
    });

    test('AuthModuleFactory singleton pattern', () => {
        const instance1 = AuthModuleFactory.getInstance();
        const instance2 = AuthModuleFactory.getInstance();

        expect(instance1).toBe(instance2);

        AuthModuleFactory.resetInstance();
        const instance3 = AuthModuleFactory.getInstance();

        expect(instance1).not.toBe(instance3);
    });
});
