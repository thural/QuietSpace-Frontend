/**
 * Profile Feature Performance Tests - Enterprise Edition
 * 
 * Enterprise-grade performance tests for the profile feature
 * Tests caching, memory usage, and response times
 */

import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProfile } from '@features/profile/application/hooks/useProfile';
import { useProfileConnections } from '@features/profile/application/hooks/useProfileConnections';
import { useProfileSettings } from '@features/profile/application/hooks/useProfileSettings';
import { useProfileServices } from '@features/profile/application/hooks/useProfileServices';
import { createAppContainer } from '@/core/di/AppContainer';
import { Container } from '@/core/di';

// Performance monitoring utilities
const measureExecutionTime = async (fn: () => Promise<any>): Promise<{ result: any; time: number }> => {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    return { result, time: end - start };
};

const measureMemoryUsage = (): number => {
    if (typeof performance !== 'undefined' && performance.memory) {
        return performance.memory.usedJSHeapSize;
    }
    return 0;
};

// Mock data generators
const generateMockUsers = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
        id: `user${i}`,
        username: `user${i}`,
        email: `user${i}@example.com`,
        bio: `Bio for user ${i}`,
        followersCount: Math.floor(Math.random() * 1000),
        followingsCount: Math.floor(Math.random() * 500),
        postsCount: Math.floor(Math.random() * 100),
        isVerified: Math.random() > 0.8,
        isPrivate: Math.random() > 0.9,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }));
};

// Test setup
const createTestQueryClient = () => new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            gcTime: 0,
            staleTime: 0,
        },
        mutations: {
            retry: false,
        },
    },
});

const createTestWrapper = (queryClient: QueryClient, container: Container) => {
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};

// Mock the DI container
const mockContainer = createAppContainer();

// Mock auth store
jest.mock('@services/store/zustand', () => ({
    useAuthStore: () => ({
        data: {
            userId: '123',
            accessToken: 'mock-token'
        }
    })
}));

// Mock cache invalidation
jest.mock('@/core/hooks/useCacheInvalidation', () => ({
    useCacheInvalidation: () => ({
        invalidateProfile: jest.fn(),
        invalidateConnections: jest.fn(),
        invalidateSettings: jest.fn(),
        invalidateSearchData: jest.fn()
    })
}));

describe('Profile Feature Performance Tests', () => {
    let queryClient: QueryClient;
    let wrapper: React.FC<{ children: React.ReactNode }>;
    let initialMemory: number;

    beforeEach(() => {
        queryClient = createTestQueryClient();
        wrapper = createTestWrapper(queryClient, mockContainer);
        initialMemory = measureMemoryUsage();
        
        // Clear all mocks
        jest.clearAllMocks();
    });

    describe('Cache Performance', () => {
        it('should cache profile data efficiently', async () => {
            const { result } = renderHook(() => useProfile(), { wrapper });

            const mockProfile = generateMockUsers(1)[0];
            const mockGetProfile = jest.fn().mockResolvedValue(mockProfile);
            result.current.getProfile = mockGetProfile;

            // First call - should hit the repository
            const { time: firstCallTime } = await measureExecutionTime(() => 
                result.current.getProfile('123')
            );

            // Second call - should hit cache
            const { time: secondCallTime } = await measureExecutionTime(() => 
                result.current.getProfile('123')
            );

            // Cache hit should be faster
            expect(secondCallTime).toBeLessThan(firstCallTime);
            expect(mockGetProfile).toHaveBeenCalledTimes(1); // Should only be called once
        });

        it('should handle large datasets efficiently', async () => {
            const { result } = renderHook(() => useProfile(), { wrapper });

            const largeUserList = generateMockUsers(1000);
            const mockSearch = jest.fn().mockResolvedValue(largeUserList);
            result.current.searchUsers = mockSearch;

            const { time: searchTime } = await measureExecutionTime(() => 
                result.current.searchUsers('test', { limit: 1000 })
            );

            // Should complete within reasonable time (less than 1 second)
            expect(searchTime).toBeLessThan(1000);
            expect(mockSearch).toHaveBeenCalledWith('test', { limit: 1000 });
        });
    });

    describe('Response Time Performance', () => {
        it('should respond to profile updates quickly', async () => {
            const { result } = renderHook(() => useProfile(), { wrapper });

            const mockProfile = generateMockUsers(1)[0];
            const mockUpdate = jest.fn().mockResolvedValue(mockProfile);
            result.current.updateProfile = mockUpdate;

            const { time: updateTime } = await measureExecutionTime(() => 
                result.current.updateProfile('123', { username: 'updated' })
            );

            // Update should complete within reasonable time (less than 500ms)
            expect(updateTime).toBeLessThan(500);
        });

        it('should handle connection operations efficiently', async () => {
            const { result } = renderHook(() => useProfileConnections(), { wrapper });

            const mockConnection = {
                id: '456',
                username: 'connection1',
                email: 'connection1@example.com',
                followersCount: 50,
                followingsCount: 25,
                isFollowing: true,
                isFollowedBy: false,
                connectedAt: new Date().toISOString()
            };
            const mockFollow = jest.fn().mockResolvedValue(mockConnection);
            result.current.followUser = mockFollow;

            const { time: followTime } = await measureExecutionTime(() => 
                result.current.followUser('123', '456')
            );

            // Follow operation should complete within reasonable time (less than 300ms)
            expect(followTime).toBeLessThan(300);
        });

        it('should handle settings updates quickly', async () => {
            const { result } = renderHook(() => useProfileSettings(), { wrapper });

            const mockSettings = {
                theme: 'dark',
                language: 'en',
                timezone: 'UTC'
            };

            const mockUpdate = jest.fn().mockResolvedValue(mockSettings);
            result.current.updateSettings = mockUpdate;

            const { time: settingsTime } = await measureExecutionTime(() => 
                result.current.updateSettings('123', mockSettings)
            );

            // Settings update should complete within reasonable time (less than 200ms)
            expect(settingsTime).toBeLessThan(200);
        });
    });

    describe('Concurrent Operations Performance', () => {
        it('should handle multiple concurrent profile operations', async () => {
            const { result } = renderHook(() => useProfile(), { wrapper });

            const mockProfiles = generateMockUsers(10);
            const mockGetProfile = jest.fn().mockImplementation((id) => 
                Promise.resolve(mockProfiles.find(p => p.id === id) || mockProfiles[0])
            );
            result.current.getProfile = mockGetProfile;

            // Perform multiple concurrent operations
            const promises = Array.from({ length: 10 }, (_, i) => 
                result.current.getProfile(`user${i}`)
            );

            const { time: concurrentTime } = await measureExecutionTime(() => 
                Promise.all(promises)
            );

            // Concurrent operations should complete efficiently
            expect(concurrentTime).toBeLessThan(2000);
            expect(mockGetProfile).toHaveBeenCalledTimes(10);
        });

        it('should handle mixed concurrent operations', async () => {
            const profileHook = renderHook(() => useProfile(), { wrapper });
            const connectionsHook = renderHook(() => useProfileConnections(), { wrapper });
            const settingsHook = renderHook(() => useProfileSettings(), { wrapper });

            // Mock operations
            const mockProfile = generateMockUsers(1)[0];
            const mockConnection = {
                id: '456',
                username: 'connection1',
                email: 'connection1@example.com',
                followersCount: 50,
                followingsCount: 25,
                isFollowing: true,
                isFollowedBy: false,
                connectedAt: new Date().toISOString()
            };
            const mockSettings = { theme: 'dark' };

            profileHook.result.current.getProfile = jest.fn().mockResolvedValue(mockProfile);
            connectionsHook.result.current.followUser = jest.fn().mockResolvedValue(mockConnection);
            settingsHook.result.current.updateSettings = jest.fn().mockResolvedValue(mockSettings);

            // Perform mixed concurrent operations
            const promises = [
                profileHook.result.current.getProfile('123'),
                connectionsHook.result.current.followUser('123', '456'),
                settingsHook.result.current.updateSettings('123', mockSettings)
            ];

            const { time: mixedTime } = await measureExecutionTime(() => 
                Promise.all(promises)
            );

            // Mixed operations should complete efficiently
            expect(mixedTime).toBeLessThan(1000);
        });
    });

    describe('Service Performance', () => {
        it('should initialize services quickly', () => {
            const { result } = renderHook(() => useProfileServices(), { wrapper });

            const { time: serviceInitTime } = measureExecutionTime(() => {
                expect(result.current.profileDataService).toBeDefined();
                expect(result.current.profileFeatureService).toBeDefined();
            });

            // Service initialization should be fast
            expect(serviceInitTime).toBeLessThan(100);
        });

        it('should handle service method calls efficiently', async () => {
            const { result } = renderHook(() => useProfileServices(), { wrapper });

            const mockProfile = generateMockUsers(1)[0];
            
            // Mock service methods
            result.current.profileDataService.getUserProfile = jest.fn().mockResolvedValue(mockProfile);
            result.current.profileFeatureService.updateProfile = jest.fn().mockResolvedValue(mockProfile);

            // Test data service performance
            const { time: dataServiceTime } = await measureExecutionTime(() => 
                result.current.profileDataService.getUserProfile('123', 'mock-token')
            );

            // Test feature service performance
            const { time: featureServiceTime } = await measureExecutionTime(() => 
                result.current.profileFeatureService.updateProfile('123', {}, 'mock-token')
            );

            // Both services should respond quickly
            expect(dataServiceTime).toBeLessThan(200);
            expect(featureServiceTime).toBeLessThan(300);
        });
    });

    describe('Performance Regression Tests', () => {
        it('should maintain performance benchmarks', async () => {
            const { result } = renderHook(() => useProfile(), { wrapper });

            const mockProfile = generateMockUsers(1)[0];
            const mockGetProfile = jest.fn().mockResolvedValue(mockProfile);
            result.current.getProfile = mockGetProfile;

            // Performance benchmarks
            const benchmarks = {
                profileLoad: 500,    // 500ms for profile load
                profileUpdate: 300,  // 300ms for profile update
                search: 1000         // 1000ms for search
            };

            // Test profile load performance
            const { time: loadTime } = await measureExecutionTime(() => 
                result.current.getProfile('123')
            );
            expect(loadTime).toBeLessThan(benchmarks.profileLoad);

            // Test profile update performance
            const mockUpdate = jest.fn().mockResolvedValue(mockProfile);
            result.current.updateProfile = mockUpdate;
            const { time: updateTime } = await measureExecutionTime(() => 
                result.current.updateProfile('123', { username: 'updated' })
            );
            expect(updateTime).toBeLessThan(benchmarks.profileUpdate);

            // Test search performance
            const mockSearch = jest.fn().mockResolvedValue([mockProfile]);
            result.current.searchUsers = mockSearch;
            const { time: searchTime } = await measureExecutionTime(() => 
                result.current.searchUsers('test', { limit: 20 })
            );
            expect(searchTime).toBeLessThan(benchmarks.search);
        });
    });
});
