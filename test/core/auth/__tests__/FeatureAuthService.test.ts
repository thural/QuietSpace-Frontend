/**
 * FeatureAuthService Tests
 * 
 * Tests for the DI-based feature authentication service
 */

import { FeatureAuthService } from '../../../../src/core/auth/services/FeatureAuthService';
import { createContainer } from '../../../../src/core/di/factory';

// Mock the TokenProvider
jest.mock('../../../../src/core/network/providers/TokenProvider', () => ({
    TokenProvider: jest.fn().mockImplementation(() => ({
        getToken: jest.fn(),
        setToken: jest.fn(),
        clearToken: jest.fn(),
        isAuthenticated: jest.fn(),
        refreshToken: jest.fn()
    }))
}));

describe('FeatureAuthService', () => {
    let featureAuthService: FeatureAuthService;
    let container: any;
    let mockTokenProvider: any;

    beforeEach(() => {
        container = createContainer();
        featureAuthService = new FeatureAuthService(container);
        
        // Get the mock TokenProvider instance
        const { TokenProvider } = require('../../../../src/core/network/providers/TokenProvider');
        mockTokenProvider = TokenProvider.mock.instances[0];
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Token Management', () => {
        it('should get current token', () => {
            const mockToken = 'test-token';
            mockTokenProvider.getToken.mockReturnValue(mockToken);
            
            const token = featureAuthService.getToken();
            expect(token).toBe(mockToken);
            expect(mockTokenProvider.getToken).toHaveBeenCalled();
        });

        it('should return null when no token', () => {
            mockTokenProvider.getToken.mockReturnValue(null);
            
            const token = featureAuthService.getToken();
            expect(token).toBeNull();
        });

        it('should set token', () => {
            const newToken = 'new-token';
            
            featureAuthService.setToken(newToken);
            expect(mockTokenProvider.setToken).toHaveBeenCalledWith(newToken);
        });

        it('should clear token', () => {
            featureAuthService.clearAuth();
            expect(mockTokenProvider.clearToken).toHaveBeenCalled();
        });

        it('should check authentication status', () => {
            mockTokenProvider.isAuthenticated.mockReturnValue(true);
            
            const isAuthenticated = featureAuthService.isAuthenticated();
            expect(isAuthenticated).toBe(true);
            expect(mockTokenProvider.isAuthenticated).toHaveBeenCalled();
        });

        it('should refresh token', async () => {
            const newToken = 'refreshed-token';
            mockTokenProvider.refreshToken.mockResolvedValue(newToken);
            
            const token = await featureAuthService.refreshToken();
            expect(token).toBe(newToken);
            expect(mockTokenProvider.refreshToken).toHaveBeenCalled();
        });
    });

    describe('Auth Data Management', () => {
        it('should get auth data with token', () => {
            const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
            mockTokenProvider.getToken.mockReturnValue(mockToken);
            
            const authData = featureAuthService.getAuthData();
            expect(authData).toEqual({
                accessToken: mockToken,
                user: {
                    id: '1234567890',
                    email: 'john@example.com'
                }
            });
        });

        it('should return null auth data when no token', () => {
            mockTokenProvider.getToken.mockReturnValue(null);
            
            const authData = featureAuthService.getAuthData();
            expect(authData).toBeNull();
        });

        it('should get user ID', () => {
            const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLWlkLTEyMyIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSJ9.signature';
            mockTokenProvider.getToken.mockReturnValue(mockToken);
            
            const userId = featureAuthService.getUserId();
            expect(userId).toBe('user-id-123');
        });

        it('should get user email', () => {
            const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLWlkLTEyMyIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSJ9.signature';
            mockTokenProvider.getToken.mockReturnValue(mockToken);
            
            const userEmail = featureAuthService.getUserEmail();
            expect(userEmail).toBe('test@example.com');
        });
    });

    describe('Authorization Headers', () => {
        it('should get auth header when token exists', () => {
            const mockToken = 'test-token';
            mockTokenProvider.getToken.mockReturnValue(mockToken);
            
            const authHeader = featureAuthService.getAuthHeader();
            expect(authHeader).toEqual({
                Authorization: `Bearer ${mockToken}`
            });
        });

        it('should return null auth header when no token', () => {
            mockTokenProvider.getToken.mockReturnValue(null);
            
            const authHeader = featureAuthService.getAuthHeader();
            expect(authHeader).toBeNull();
        });
    });

    describe('Permission System', () => {
        it('should check permissions', () => {
            mockTokenProvider.isAuthenticated.mockReturnValue(true);
            
            const hasPermission = featureAuthService.hasPermission('read:admin');
            expect(hasPermission).toBe(true);
        });

        it('should deny permissions when not authenticated', () => {
            mockTokenProvider.isAuthenticated.mockReturnValue(false);
            
            const hasPermission = featureAuthService.hasPermission('read:admin');
            expect(hasPermission).toBe(false);
        });

        it('should check roles', () => {
            mockTokenProvider.isAuthenticated.mockReturnValue(true);
            
            const hasAnyRole = featureAuthService.hasAnyRole(['admin', 'user']);
            expect(hasAnyRole).toBe(true);
        });

        it('should deny roles when not authenticated', () => {
            mockTokenProvider.isAuthenticated.mockReturnValue(false);
            
            const hasAnyRole = featureAuthService.hasAnyRole(['admin', 'user']);
            expect(hasAnyRole).toBe(false);
        });
    });

    describe('Error Handling', () => {
        it('should handle invalid JWT tokens gracefully', () => {
            mockTokenProvider.getToken.mockReturnValue('invalid-token');
            
            const authData = featureAuthService.getAuthData();
            expect(authData).toEqual({
                accessToken: 'invalid-token'
            });
        });

        it('should handle token provider errors', () => {
            mockTokenProvider.getToken.mockImplementation(() => {
                throw new Error('Token provider error');
            });
            
            expect(() => {
                featureAuthService.getToken();
            }).not.toThrow();
        });

        it('should handle refresh token errors', async () => {
            mockTokenProvider.refreshToken.mockRejectedValue(new Error('Refresh failed'));
            
            const token = await featureAuthService.refreshToken();
            expect(token).toBeNull();
        });
    });

    describe('DI Integration', () => {
        it('should work with DI container', () => {
            expect(featureAuthService).toBeInstanceOf(FeatureAuthService);
        });

        it('should be injectable through DI', () => {
            container.registerInstance(FeatureAuthService, featureAuthService);
            const injectedService = container.get(FeatureAuthService);
            expect(injectedService).toBe(featureAuthService);
        });
    });

    describe('Performance', () => {
        it('should get token efficiently', () => {
            mockTokenProvider.getToken.mockReturnValue('test-token');
            
            const start = performance.now();
            for (let i = 0; i < 1000; i++) {
                featureAuthService.getToken();
            }
            const end = performance.now();
            
            // Should get token 1000 times in under 10ms
            expect(end - start).toBeLessThan(10);
        });

        it('should check auth efficiently', () => {
            mockTokenProvider.isAuthenticated.mockReturnValue(true);
            
            const start = performance.now();
            for (let i = 0; i < 1000; i++) {
                featureAuthService.isAuthenticated();
            }
            const end = performance.now();
            
            // Should check auth 1000 times in under 10ms
            expect(end - start).toBeLessThan(10);
        });
    });
});
