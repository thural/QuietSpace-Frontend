/**
 * TokenProvider Tests
 * 
 * Tests for the DI-based token provider implementation
 */

import { TokenProvider } from '../../../../src/core/network/providers/TokenProvider';
import { createContainer } from '../../../../src/core/di/factory';

// Mock the auth store
jest.mock('../../../../src/core/store/zustand', () => ({
    useAuthStore: {
        getState: jest.fn(() => ({
            token: 'mock-token',
            refreshToken: 'mock-refresh-token',
            isAuthenticated: true,
            setAuthData: jest.fn(),
            logout: jest.fn()
        }))
    }
}));

describe('TokenProvider', () => {
    let tokenProvider: TokenProvider;
    let container: any;

    beforeEach(() => {
        container = createContainer();
        tokenProvider = new TokenProvider(container);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Token Management', () => {
        it('should get current token', () => {
            const token = tokenProvider.getToken();
            expect(token).toBe('mock-token');
        });

        it('should check if authenticated', () => {
            const isAuthenticated = tokenProvider.isAuthenticated();
            expect(isAuthenticated).toBe(true);
        });

        it('should set token', () => {
            tokenProvider.setToken('new-token');
            const token = tokenProvider.getToken();
            expect(token).toBe('new-token');
        });

        it('should clear token', () => {
            tokenProvider.clearToken();
            const token = tokenProvider.getToken();
            expect(token).toBeNull();
        });

        it('should get auth header', () => {
            const token = tokenProvider.getToken();
            const authHeader = token ? { Authorization: `Bearer ${token}` } : null;
            expect(authHeader).toEqual({
                Authorization: 'Bearer mock-token'
            });
        });

        it('should return null auth header when no token', () => {
            tokenProvider.clearToken();
            const token = tokenProvider.getToken();
            const authHeader = token ? { Authorization: `Bearer ${token}` } : null;
            expect(authHeader).toBeNull();
        });
    });

    describe('Token Refresh', () => {
        it('should refresh token successfully', async () => {
            const newToken = await tokenProvider.refreshToken();
            expect(newToken).toBeDefined();
        });

        it('should handle refresh failure', async () => {
            // Mock refresh failure
            jest.spyOn(tokenProvider as any, 'performRefresh').mockRejectedValue(new Error('Refresh failed'));

            await expect(tokenProvider.refreshToken()).rejects.toThrow('Refresh failed');
        });
    });

    describe('DI Integration', () => {
        it('should work with DI container', () => {
            expect(tokenProvider).toBeInstanceOf(TokenProvider);
        });

        it('should be injectable through DI', () => {
            container.registerInstance(TokenProvider, tokenProvider);
            const injectedProvider = container.get(TokenProvider);
            expect(injectedProvider).toBe(tokenProvider);
        });
    });

    describe('Error Handling', () => {
        it('should handle invalid token format', () => {
            expect(() => {
                tokenProvider.setToken('invalid-token-format');
            }).not.toThrow();
        });

        it('should handle missing auth store gracefully', () => {
            // Mock missing store
            jest.doMock('../../../../src/core/store/zustand', () => ({
                useAuthStore: null
            }));

            expect(() => {
                new TokenProvider(container);
            }).not.toThrow();
        });
    });

    describe('Performance', () => {
        it('should get token efficiently', () => {
            const start = performance.now();
            for (let i = 0; i < 1000; i++) {
                tokenProvider.getToken();
            }
            const end = performance.now();

            // Should get token 1000 times in under 10ms
            expect(end - start).toBeLessThan(10);
        });

        it('should check authentication efficiently', () => {
            const start = performance.now();
            for (let i = 0; i < 1000; i++) {
                tokenProvider.isAuthenticated();
            }
            const end = performance.now();

            // Should check auth 1000 times in under 10ms
            expect(end - start).toBeLessThan(10);
        });
    });
});
