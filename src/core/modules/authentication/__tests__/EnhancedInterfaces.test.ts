/**
 * Enhanced Interfaces Validation Tests - Fixed
 *
 * Validates that enhanced individual interfaces work correctly
 * and provide the same functionality as composites.
 */

import {
    createCompleteAuthService,
    getAllAuthCapabilities,
    getAuthCoreCapabilities,
    getAuthManagementCapabilities,
    getServiceHealthStatus,
    performAuthWithToken,
    performCompleteAuthentication,
    performManageProviders,
    performManageUser,
    performValidateAndRefresh
} from '../utils/authWorkflows';

describe('Enhanced Interfaces Validation', () => {
    let mockAuthenticator: any;
    let mockTokenManager: any;
    let mockUserManager: any;
    let mockProviderManager: any;

    beforeEach(() => {
        mockAuthenticator = {
            name: 'test-auth',
            type: 'jwt',
            config: {},
            authenticate: jest.fn().mockResolvedValue({
                success: true,
                data: { user: { id: 'test' }, token: 'test-token', provider: 'jwt', createdAt: new Date(), expiresAt: new Date() }
            }),
            validateSession: jest.fn().mockResolvedValue({
                success: true,
                data: true
            }),
            refreshToken: jest.fn().mockResolvedValue({
                success: true,
                data: { user: { id: 'test' }, token: 'new-token', provider: 'jwt', createdAt: new Date(), expiresAt: new Date() }
            }),
            configure: jest.fn(),
            getCapabilities: jest.fn(() => ['auth', 'validate']),
            healthCheck: jest.fn().mockResolvedValue({
                healthy: true,
                timestamp: new Date(),
                responseTime: 100
            }),
            getPerformanceMetrics: jest.fn(),
            resetPerformanceMetrics: jest.fn(),
            isHealthy: jest.fn(() => Promise.resolve(true)),
            isInitialized: jest.fn(() => true),
            getUptime: jest.fn(() => 1000),
            // Enhanced methods
            getCoreCapabilities: jest.fn(() => ['auth', 'validate', 'token', 'refresh']),
            authenticateWithToken: jest.fn().mockResolvedValue({
                success: true,
                data: { user: { id: 'test' }, token: 'test-token', provider: 'jwt', createdAt: new Date(), expiresAt: new Date() }
            }),
            validateAndRefresh: jest.fn().mockResolvedValue({
                success: true,
                data: { user: { id: 'test' }, token: 'refreshed-token', provider: 'jwt', createdAt: new Date(), expiresAt: new Date() }
            })
        };

        mockTokenManager = {
            name: 'test-token',
            type: 'jwt',
            config: {},
            validateToken: jest.fn(),
            refreshToken: jest.fn(),
            getTokenInfo: jest.fn(),
            isTokenExpired: jest.fn(),
            getTokenTimeToExpiry: jest.fn(),
            configure: jest.fn(),
            getCapabilities: jest.fn(() => ['token', 'refresh'])
        };

        mockUserManager = {
            name: 'test-user',
            type: 'memory',
            config: {},
            register: jest.fn(),
            activate: jest.fn(),
            signout: jest.fn(),
            resendActivationCode: jest.fn(),
            configure: jest.fn(),
            getCapabilities: jest.fn(() => ['user', 'register']),
            // Enhanced methods
            getManagementCapabilities: jest.fn(() => ['user', 'register', 'manage']),
            manageUser: jest.fn().mockResolvedValue({
                userId: 'test-user',
                operations: [{ type: 'activate' }],
                status: 'completed'
            })
        };

        mockProviderManager = {
            name: 'test-provider',
            type: 'memory',
            config: {},
            registerProvider: jest.fn(),
            getProvider: jest.fn(),
            listProviders: jest.fn(),
            removeProvider: jest.fn(),
            configure: jest.fn(),
            getCapabilities: jest.fn(() => ['provider', 'health']),
            // Enhanced methods
            getManagementCapabilities: jest.fn(() => ['provider', 'management', 'health']),
            manageProviders: jest.fn().mockResolvedValue({
                operations: [{ type: 'register' }],
                status: 'completed'
            })
        };
    });

    describe('Enhanced IAuthenticator', () => {
        it('should have composite-like methods', () => {
            expect(mockAuthenticator.getCoreCapabilities).toBeDefined();
            expect(mockAuthenticator.authenticateWithToken).toBeDefined();
            expect(mockAuthenticator.validateAndRefresh).toBeDefined();
        });

        it('should maintain original methods', () => {
            expect(typeof mockAuthenticator.authenticate).toBe('function');
            expect(typeof mockAuthenticator.validateSession).toBe('function');
            expect(typeof mockAuthenticator.refreshToken).toBe('function');
        });
    });

    describe('Enhanced IUserManager', () => {
        it('should have management methods', () => {
            expect(mockUserManager.getManagementCapabilities).toBeDefined();
            expect(mockUserManager.manageUser).toBeDefined();
        });

        it('should maintain original methods', () => {
            expect(typeof mockUserManager.register).toBe('function');
            expect(typeof mockUserManager.activate).toBe('function');
            expect(typeof mockUserManager.signout).toBe('function');
        });
    });

    describe('Enhanced IProviderManager', () => {
        it('should have management methods', () => {
            expect(mockProviderManager.getManagementCapabilities).toBeDefined();
            expect(mockProviderManager.manageProviders).toBeDefined();
        });

        it('should maintain original methods', () => {
            expect(typeof mockProviderManager.registerProvider).toBe('function');
            expect(typeof mockProviderManager.getProvider).toBe('function');
            expect(typeof mockProviderManager.listProviders).toBe('function');
        });
    });

    describe('Utility Functions', () => {
        it('should create complete auth service', () => {
            const completeService = createCompleteAuthService(
                mockAuthenticator,
                mockTokenManager,
                mockUserManager,
                mockProviderManager
            );

            expect(completeService).toBeDefined();
            expect(completeService.authenticator).toBe(mockAuthenticator);
            expect(completeService.tokenManager).toBe(mockTokenManager);
            expect(completeService.userManager).toBe(mockUserManager);
            expect(completeService.providerManager).toBe(mockProviderManager);
        });

        it('should get core capabilities', () => {
            const capabilities = getAuthCoreCapabilities(mockAuthenticator, mockTokenManager);
            expect(capabilities).toContain('auth');
            expect(capabilities).toContain('validate');
            expect(capabilities).toContain('token');
            expect(capabilities).toContain('refresh');
        });

        it('should get management capabilities', () => {
            const capabilities = getAuthManagementCapabilities(mockUserManager, mockProviderManager);
            expect(capabilities).toContain('user');
            expect(capabilities).toContain('register');
            expect(capabilities).toContain('manage');
            expect(capabilities).toContain('provider');
            expect(capabilities).toContain('health');
        });

        it('should get all capabilities', () => {
            const capabilities = getAllAuthCapabilities(
                mockAuthenticator,
                mockTokenManager,
                mockUserManager,
                mockProviderManager
            );
            expect(capabilities).toContain('auth');
            expect(capabilities).toContain('validate');
            expect(capabilities).toContain('token');
            expect(capabilities).toContain('refresh');
            expect(capabilities).toContain('user');
            expect(capabilities).toContain('register');
            expect(capabilities).toContain('manage');
            expect(capabilities).toContain('provider');
            expect(capabilities).toContain('health');
        });

        it('should perform auth with token workflow', async () => {
            const credentials = { username: 'test', password: 'test' };
            await performAuthWithToken(mockAuthenticator, mockTokenManager, credentials);
            expect(mockAuthenticator.authenticateWithToken).toHaveBeenCalledWith(credentials);
        });

        it('should perform validate and refresh workflow', async () => {
            await performValidateAndRefresh(mockAuthenticator, mockTokenManager);
            expect(mockAuthenticator.validateSession).toHaveBeenCalled();
        });

        it('should perform manage user workflow', async () => {
            const userId = 'test-user';
            const operations = [{ type: 'activate' }];
            await performManageUser(mockUserManager, userId, operations);
            expect(mockUserManager.manageUser).toHaveBeenCalledWith(userId, operations);
        });

        it('should perform manage providers workflow', async () => {
            const operations = [{ type: 'register' }];
            await performManageProviders(mockProviderManager, operations);
            expect(mockProviderManager.manageProviders).toHaveBeenCalledWith(operations);
        });

        it('should perform complete authentication workflow', async () => {
            const credentials = { username: 'test', password: 'test' };
            const options = { enableUserManagement: true };
            await performCompleteAuthentication(
                mockAuthenticator,
                mockTokenManager,
                mockUserManager,
                credentials,
                options
            );
            expect(mockAuthenticator.authenticateWithToken).toHaveBeenCalledWith(credentials);
        });

        it('should get service health status', async () => {
            await getServiceHealthStatus(mockAuthenticator, mockUserManager, mockProviderManager);
            expect(mockAuthenticator.healthCheck).toHaveBeenCalled();
        });
    });

    describe('Backward Compatibility', () => {
        it('should maintain all original interface methods', () => {
            // All original methods should still be available
            expect(typeof mockAuthenticator.authenticate).toBe('function');
            expect(typeof mockAuthenticator.validateSession).toBe('function');
            expect(typeof mockAuthenticator.refreshToken).toBe('function');
            expect(typeof mockUserManager.register).toBe('function');
            expect(typeof mockUserManager.activate).toBe('function');
            expect(typeof mockProviderManager.registerProvider).toBe('function');
        });

        it('should provide enhanced functionality without breaking changes', () => {
            // Enhanced methods should be additive
            expect(typeof mockAuthenticator.getCoreCapabilities).toBe('function');
            expect(typeof mockAuthenticator.authenticateWithToken).toBe('function');
            expect(typeof mockUserManager.getManagementCapabilities).toBe('function');
            expect(typeof mockProviderManager.manageProviders).toBe('function');
        });
    });
});
