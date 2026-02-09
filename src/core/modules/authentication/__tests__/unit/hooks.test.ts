/**
 * Authentication Hooks Tests
 *
 * Tests for the authentication hooks including useEnterpriseAuth and useFeatureAuth
 * to ensure proper DI integration and Black Box pattern compliance.
 */

import { renderHook, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';

import { useEnterpriseAuth } from '../../hooks/useEnterpriseAuth';
import { useFeatureAuth } from '../../hooks/useFeatureAuth';

import type { AuthSession } from '../../types/auth.domain.types';

// Mock DI container
const mockContainer = {
    get: jest.fn(),
    register: jest.fn(),
    resolve: jest.fn(),
    has: jest.fn(),
    create: jest.fn(),
    dispose: jest.fn()
};

// Mock auth service
const mockAuthService = {
    authenticate: jest.fn(),
    validateSession: jest.fn(),
    refreshToken: jest.fn(),
    signout: jest.fn(),
    getCurrentSession: jest.fn(),
    globalSignout: jest.fn(),
    registerProvider: jest.fn(),
    registerPlugin: jest.fn(),
    getCapabilities: jest.fn(),
    initialize: jest.fn()
};

// Mock React context
const mockContext = {
    container: mockContainer,
    get: jest.fn(),
    register: jest.fn(),
    resolve: jest.fn(),
    has: jest.fn(),
    create: jest.fn(),
    dispose: jest.fn()
};

// Test wrapper component
const TestWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <div>
        { children }
        </div>
    );
};

describe('Authentication Hooks', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        // Setup default mock implementations
        mockContainer.get.mockReturnValue(mockAuthService);
        mockAuthService.getCurrentSession.mockResolvedValue(null);
        mockAuthService.validateSession.mockResolvedValue({ success: true, data: true });
        mockAuthService.refreshToken.mockResolvedValue({ success: true, data: { id: 'session123' } });
        mockAuthService.signout.mockResolvedValue({ success: true });
        mockAuthService.authenticate.mockResolvedValue({ success: true, data: { id: 'session123' } });
    });

    describe('useEnterpriseAuth', () => {
        it('should initialize with loading state', () => {
            const { result } = renderHook(() => useEnterpriseAuth(), {
                wrapper: TestWrapper
            });

            expect(result.current.loading).toBe(true);
            expect(result.current.session).toBeNull();
            expect(result.current.error).toBeNull();
        });

        it('should load session on mount', async () => {
            const mockSession: AuthSession = {
                id: 'session123',
                userId: 'user123',
                token: 'mock-token',
                expiresAt: new Date(Date.now() + 3600000),
                provider: 'enterprise',
                createdAt: new Date()
            };

            mockAuthService.getCurrentSession.mockResolvedValue(mockSession);

            const { result } = renderHook(() => useEnterpriseAuth(), {
                wrapper: TestWrapper
            });

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
                expect(result.current.session).toBe(mockSession);
            });

            expect(mockAuthService.getCurrentSession).toHaveBeenCalled();
        });

        it('should handle authentication', async () => {
            const { result } = renderHook(() => useEnterpriseAuth(), {
                wrapper: TestWrapper
            });

            // Wait for initial load
            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            // Authenticate
            await result.current.authenticate('testuser', 'password');

            expect(mockAuthService.authenticate).toHaveBeenCalledWith('testuser', 'password');
        });

        it('should handle sign out', async () => {
            const { result } = renderHook(() => useEnterpriseAuth(), {
                wrapper: TestWrapper
            });

            // Wait for initial load
            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            // Sign out
            await result.current.signout();

            expect(mockAuthService.signout).toHaveBeenCalled();
        });

        it('should handle session refresh', async () => {
            const { result } = renderHook(() => useEnterpriseAuth(), {
                wrapper: TestWrapper
            });

            // Wait for initial load
            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            // Refresh token
            await result.current.refreshToken();

            expect(mockAuthService.refreshToken).toHaveBeenCalled();
        });

        it('should handle session validation', async () => {
            const { result } = renderHook(() => useEnterpriseAuth(), {
                wrapper: TestWrapper
            });

            // Wait for initial load
            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            // Validate session
            const isValid = await result.current.validateSession();

            expect(isValid).toBe(true);
            expect(mockAuthService.validateSession).toHaveBeenCalled();
        });

        it('should handle authentication errors', async () => {
            mockAuthService.authenticate.mockRejectedValue(new Error('Authentication failed'));

            const { result } = renderHook(() => useEnterpriseAuth(), {
                wrapper: TestWrapper
            });

            // Wait for initial load
            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            // Attempt authentication
            await result.current.authenticate('testuser', 'wrongpassword');

            expect(result.current.error).toBeTruthy();
            expect(result.current.error?.message).toContain('Authentication failed');
        });

        it('should provide capabilities', async () => {
            mockAuthService.getCapabilities.mockReturnValue(['authenticate', 'validate', 'refresh']);

            const { result } = renderHook(() => useEnterpriseAuth(), {
                wrapper: TestWrapper
            });

            // Wait for initial load
            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            const capabilities = result.current.getCapabilities();

            expect(capabilities).toContain('authenticate');
            expect(capabilities).toContain('validate');
            expect(capabilities).toContain('refresh');
        });

        it('should handle session expiration', async () => {
            // Mock expired session
            const expiredSession: AuthSession = {
                id: 'expired-session',
                userId: 'user123',
                token: 'expired-token',
                expiresAt: new Date(Date.now() - 1000), // Expired
                provider: 'enterprise',
                createdAt: new Date()
            };

            mockAuthService.getCurrentSession.mockResolvedValue(expiredSession);
            mockAuthService.validateSession.mockResolvedValue({ success: false, error: { type: 'SESSION_EXPIRED' } });

            const { result } = renderHook(() => useEnterpriseAuth(), {
                wrapper: TestWrapper
            });

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            // Session should be null after validation failure
            expect(result.current.session).toBeNull();
        });
    });

    describe('useFeatureAuth', () => {
        it('should initialize with loading state', () => {
            const { result } = renderHook(() => useFeatureAuth('test-feature'), {
                wrapper: TestWrapper
            });

            expect(result.current.loading).toBe(true);
            expect(result.current.authenticated).toBe(false);
        });

        it('should create feature-specific auth service', async () => {
            const { result } = renderHook(() => useFeatureAuth('test-feature'), {
                wrapper: TestWrapper
            });

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(mockContainer.get).toHaveBeenCalledWith('IAuthService');
        });

        it('should handle feature-specific authentication', async () => {
            const { result } = renderHook(() => useFeatureAuth('test-feature'), {
                wrapper: TestWrapper
            });

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            await result.current.authenticate('testuser', 'password');

            expect(mockAuthService.authenticate).toHaveBeenCalledWith('testuser', 'password');
        });

        it('should provide feature-specific session management', async () => {
            const mockSession: AuthSession = {
                id: 'feature-session',
                userId: 'user123',
                token: 'feature-token',
                expiresAt: new Date(Date.now() + 3600000),
                provider: 'feature',
                createdAt: new Date()
            };

            mockAuthService.getCurrentSession.mockResolvedValue(mockSession);

            const { result } = renderHook(() => useFeatureAuth('test-feature'), {
                wrapper: TestWrapper
            });

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(result.current.authenticated).toBe(true);
        });

        it('should handle feature isolation', async () => {
            // Render multiple feature hooks
            const { result: result1 } = renderHook(() => useFeatureAuth('feature1'), {
                wrapper: TestWrapper
            });

            const { result: result2 } = renderHook(() => useFeatureAuth('feature2'), {
                wrapper: TestWrapper
            });

            await waitFor(() => {
                expect(result1.current.loading).toBe(false);
                expect(result2.current.loading).toBe(false);
            });

            // Each feature should have its own auth state
            expect(result1.current.featureName).toBe('feature1');
            expect(result2.current.featureName).toBe('feature2');
        });

        it('should handle cleanup on unmount', async () => {
            const { unmount } = renderHook(() => useFeatureAuth('test-feature'), {
                wrapper: TestWrapper
            });

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            // Unmount should trigger cleanup
            expect(() => unmount()).not.toThrow();
        });
    });

    describe('Hook Integration', () => {
        it('should work together with enterprise and feature auth', async () => {
            const { result: enterpriseResult } = renderHook(() => useEnterpriseAuth(), {
                wrapper: TestWrapper
            });

            const { result: featureResult } = renderHook(() => useFeatureAuth('test-feature'), {
                wrapper: TestWrapper
            });

            await waitFor(() => {
                expect(enterpriseResult.current.loading).toBe(false);
                expect(featureResult.current.loading).toBe(false);
            });

            // Both hooks should be functional
            expect(enterpriseResult.current.authenticate).toBeDefined();
            expect(featureResult.current.authenticate).toBeDefined();
        });

        it('should share underlying auth service', async () => {
            const { result: enterpriseResult } = renderHook(() => useEnterpriseAuth(), {
                wrapper: TestWrapper
            });

            const { result: featureResult } = renderHook(() => useFeatureAuth('test-feature'), {
                wrapper: TestWrapper
            });

            await waitFor(() => {
                expect(enterpriseResult.current.loading).toBe(false);
                expect(featureResult.current.loading).toBe(false);
            });

            // Both should use the same underlying service
            expect(mockContainer.get).toHaveBeenCalledTimes(2);
        });
    });

    describe('Error Handling', () => {
        it('should handle DI container errors gracefully', async () => {
            mockContainer.get.mockImplementation(() => {
                throw new Error('Service not found');
            });

            const { result } = renderHook(() => useEnterpriseAuth(), {
                wrapper: TestWrapper
            });

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(result.current.error).toBeTruthy();
            expect(result.current.error?.message).toContain('Service not found');
        });

        it('should handle service initialization errors', async () => {
            mockAuthService.initialize.mockRejectedValue(new Error('Initialization failed'));

            const { result } = renderHook(() => useEnterpriseAuth(), {
                wrapper: TestWrapper
            });

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(result.current.error).toBeTruthy();
        });

        it('should recover from temporary errors', async () => {
            // First call fails
            mockAuthService.getCurrentSession.mockRejectedValueOnce(new Error('Temporary error'));
            // Second call succeeds
            const mockSession: AuthSession = {
                id: 'session123',
                userId: 'user123',
                token: 'mock-token',
                expiresAt: new Date(Date.now() + 3600000),
                provider: 'enterprise',
                createdAt: new Date()
            };
            mockAuthService.getCurrentSession.mockResolvedValue(mockSession);

            const { result } = renderHook(() => useEnterpriseAuth(), {
                wrapper: TestWrapper
            });

            // Should handle the error gracefully
            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            // Retry should succeed
            await result.current.retry();
        });
    });

    describe('Performance', () => {
        it('should not cause unnecessary re-renders', async () => {
            const { result, rerender } = renderHook(() => useEnterpriseAuth(), {
                wrapper: TestWrapper
            });

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            // Track render count
            let renderCount = 0;
            const originalRender = result.current;

            rerender();

            // Should not cause additional renders without state changes
            expect(result.current).toBe(originalRender);
        });

        it('should handle rapid state changes efficiently', async () => {
            const { result } = renderHook(() => useEnterpriseAuth(), {
                wrapper: TestWrapper
            });

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            // Rapid authentication attempts
            const promises = [];
            for (let i = 0; i < 10; i++) {
                promises.push(result.current.authenticate(`user${i}`, 'password'));
            }

            await Promise.all(promises);

            // Should handle all attempts without errors
            expect(mockAuthService.authenticate).toHaveBeenCalledTimes(10);
        });
    });
});
