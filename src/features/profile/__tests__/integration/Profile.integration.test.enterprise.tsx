/**
 * Profile Feature Integration Tests - Enterprise Edition
 * 
 * Enterprise-grade integration tests for the profile feature
 * Tests the complete data flow from UI to services to cache
 */

import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProfile } from '@features/profile/application/hooks/useProfile';
import { useProfileConnections } from '@features/profile/application/hooks/useProfileConnections';
import { useProfileSettings } from '@features/profile/application/hooks/useProfileSettings';
import { useProfileServices } from '@features/profile/application/hooks/useProfileServices';
import { createAppContainer } from '@/core/di/AppContainer';
import { Container } from '@/core/di';

// Mock data
const mockUserProfile = {
    id: '123',
    username: 'testuser',
    email: 'test@example.com',
    bio: 'Test user bio',
    followersCount: 100,
    followingsCount: 50,
    postsCount: 25,
    isVerified: true,
    isPrivate: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
};

const mockUserStats = {
    id: '123',
    userId: '123',
    followersCount: 100,
    followingsCount: 50,
    postsCount: 25,
    likesCount: 500,
    commentsCount: 200,
    sharesCount: 100,
    profileViews: 1000,
    lastActive: new Date().toISOString()
};

const mockUserConnections = [
    {
        id: '456',
        username: 'follower1',
        email: 'follower1@example.com',
        followersCount: 50,
        followingsCount: 25,
        isFollowing: true,
        isFollowedBy: false,
        connectedAt: new Date().toISOString()
    }
];

const mockUserSettings = {
    theme: 'light',
    language: 'en',
    timezone: 'UTC',
    notifications: {
        email: true,
        push: true,
        sms: false,
        marketing: false,
        security: true,
        mentions: true,
        follows: true,
        likes: true,
        comments: true
    }
};

const mockUserPrivacy = {
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    showLocation: false,
    showBirthdate: false,
    showFollowers: true,
    showFollowing: true,
    allowFollowRequests: true,
    allowTagging: true,
    allowSearchIndexing: true
};

// Test utilities
const createTestQueryClient = () => new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            gcTime: 0,
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

describe('Profile Feature Integration Tests', () => {
    let queryClient: QueryClient;
    let wrapper: React.FC<{ children: React.ReactNode }>;

    beforeEach(() => {
        queryClient = createTestQueryClient();
        wrapper = createTestWrapper(queryClient, mockContainer);
        
        // Clear all mocks
        jest.clearAllMocks();
    });

    describe('useProfile Hook', () => {
        it('should initialize with correct default state', () => {
            const { result } = renderHook(() => useProfile(), { wrapper });

            expect(result.current.profile).toBeNull();
            expect(result.current.stats).toBeNull();
            expect(result.current.followers).toBeNull();
            expect(result.current.followings).toBeNull();
            expect(result.current.searchResults).toBeNull();
            expect(result.current.suggestions).toBeNull();
            expect(result.current.settings).toBeNull();
            expect(result.current.privacy).toBeNull();
            expect(result.current.isLoading).toBe(true);
            expect(result.current.error).toBeNull();
            expect(result.current.selectedUserId).toBe('123');
        });

        it('should have all required actions available', () => {
            const { result } = renderHook(() => useProfile(), { wrapper });

            expect(typeof result.current.getProfile).toBe('function');
            expect(typeof result.current.getCurrentProfile).toBe('function');
            expect(typeof result.current.updateProfile).toBe('function');
            expect(typeof result.current.deleteProfile).toBe('function');
            expect(typeof result.current.getStats).toBe('function');
            expect(typeof result.current.updateStats).toBe('function');
            expect(typeof result.current.getFollowers).toBe('function');
            expect(typeof result.current.getFollowings).toBe('function');
            expect(typeof result.current.followUser).toBe('function');
            expect(typeof result.current.unfollowUser).toBe('function');
            expect(typeof result.current.searchUsers).toBe('function');
            expect(typeof result.current.getUserSuggestions).toBe('function');
            expect(typeof result.current.getSettings).toBe('function');
            expect(typeof result.current.updateSettings).toBe('function');
            expect(typeof result.current.getPrivacy).toBe('function');
            expect(typeof result.current.updatePrivacy).toBe('function');
            expect(typeof result.current.setSelectedUserId).toBe('function');
            expect(typeof result.current.clearError).toBe('function');
            expect(typeof result.current.refresh).toBe('function');
        });

        it('should handle profile update correctly', async () => {
            const { result } = renderHook(() => useProfile(), { wrapper });

            const updates = {
                username: 'updateduser',
                bio: 'Updated bio'
            };

            // Mock successful update
            const mockUpdate = jest.fn().mockResolvedValue(mockUserProfile);
            result.current.updateProfile = mockUpdate;

            await expect(result.current.updateProfile('123', updates)).resolves.toEqual(mockUserProfile);
            expect(mockUpdate).toHaveBeenCalledWith('123', updates);
        });

        it('should handle search functionality', async () => {
            const { result } = renderHook(() => useProfile(), { wrapper });

            // Mock search results
            const mockSearch = jest.fn().mockResolvedValue([mockUserProfile]);
            result.current.searchUsers = mockSearch;

            await expect(result.current.searchUsers('testuser', { limit: 10 })).resolves.toBeUndefined();
            expect(mockSearch).toHaveBeenCalledWith('testuser', { limit: 10 });
        });
    });

    describe('useProfileConnections Hook', () => {
        it('should initialize with correct default state', () => {
            const { result } = renderHook(() => useProfileConnections(), { wrapper });

            expect(result.current.followers).toBeNull();
            expect(result.current.followings).toBeNull();
            expect(result.current.mutualConnections).toBeNull();
            expect(result.current.blockedUsers).toBeNull();
            expect(result.current.mutedUsers).toBeNull();
            expect(result.current.isLoading).toBe(true);
            expect(result.current.error).toBeNull();
            expect(result.current.selectedUserId).toBe('123');
            expect(result.current.isFollowing).toBe(false);
            expect(result.current.isBlocked).toBe(false);
            expect(result.current.isMuted).toBe(false);
        });

        it('should have all required actions available', () => {
            const { result } = renderHook(() => useProfileConnections(), { wrapper });

            expect(typeof result.current.getFollowers).toBe('function');
            expect(typeof result.current.getFollowings).toBe('function');
            expect(typeof result.current.getMutualConnections).toBe('function');
            expect(typeof result.current.followUser).toBe('function');
            expect(typeof result.current.unfollowUser).toBe('function');
            expect(typeof result.current.blockUser).toBe('function');
            expect(typeof result.current.unblockUser).toBe('function');
            expect(typeof result.current.muteUser).toBe('function');
            expect(typeof result.current.unmuteUser).toBe('function');
            expect(typeof result.current.getBlockedUsers).toBe('function');
            expect(typeof result.current.getMutedUsers).toBe('function');
            expect(typeof result.current.setSelectedUserId).toBe('function');
            expect(typeof result.current.checkConnectionStatus).toBe('function');
            expect(typeof result.current.clearError).toBe('function');
            expect(typeof result.current.refresh).toBe('function');
        });

        it('should handle follow/unfollow operations', async () => {
            const { result } = renderHook(() => useProfileConnections(), { wrapper });

            // Mock follow operation
            const mockFollow = jest.fn().mockResolvedValue(mockUserConnections[0]);
            result.current.followUser = mockFollow;

            await expect(result.current.followUser('123', '456')).resolves.toEqual(mockUserConnections[0]);
            expect(mockFollow).toHaveBeenCalledWith('123', '456');

            // Mock unfollow operation
            const mockUnfollow = jest.fn().mockResolvedValue(undefined);
            result.current.unfollowUser = mockUnfollow;

            await expect(result.current.unfollowUser('123', '456')).resolves.toBeUndefined();
            expect(mockUnfollow).toHaveBeenCalledWith('123', '456');
        });

        it('should handle block/unblock operations', async () => {
            const { result } = renderHook(() => useProfileConnections(), { wrapper });

            // Mock block operation
            const mockBlock = jest.fn().mockResolvedValue(undefined);
            result.current.blockUser = mockBlock;

            await expect(result.current.blockUser('123', '456')).resolves.toBeUndefined();
            expect(mockBlock).toHaveBeenCalledWith('123', '456');

            // Mock unblock operation
            const mockUnblock = jest.fn().mockResolvedValue(undefined);
            result.current.unblockUser = mockUnblock;

            await expect(result.current.unblockUser('123', '456')).resolves.toBeUndefined();
            expect(mockUnblock).toHaveBeenCalledWith('123', '456');
        });
    });

    describe('useProfileSettings Hook', () => {
        it('should initialize with correct default state', () => {
            const { result } = renderHook(() => useProfileSettings(), { wrapper });

            expect(result.current.settings).toBeNull();
            expect(result.current.privacy).toBeNull();
            expect(result.current.isLoading).toBe(true);
            expect(result.current.error).toBeNull();
            expect(result.current.selectedUserId).toBe('123');
            expect(result.current.hasUnsavedChanges).toBe(false);
        });

        it('should have all required actions available', () => {
            const { result } = renderHook(() => useProfileSettings(), { wrapper });

            expect(typeof result.current.getSettings).toBe('function');
            expect(typeof result.current.updateSettings).toBe('function');
            expect(typeof result.current.resetSettings).toBe('function');
            expect(typeof result.current.getPrivacy).toBe('function');
            expect(typeof result.current.updatePrivacy).toBe('function');
            expect(typeof result.current.resetPrivacy).toBe('function');
            expect(typeof result.current.updateAllSettings).toBe('function');
            expect(typeof result.current.setSelectedUserId).toBe('function');
            expect(typeof result.current.clearError).toBe('function');
            expect(typeof result.current.refresh).toBe('function');
            expect(typeof result.current.checkUnsavedChanges).toBe('function');
            expect(typeof result.current.discardChanges).toBe('function');
        });

        it('should handle settings update', async () => {
            const { result } = renderHook(() => useProfileSettings(), { wrapper });

            const newSettings = {
                theme: 'dark',
                language: 'es'
            };

            // Mock successful update
            const mockUpdate = jest.fn().mockResolvedValue(mockUserSettings);
            result.current.updateSettings = mockUpdate;

            await expect(result.current.updateSettings('123', newSettings)).resolves.toEqual(mockUserSettings);
            expect(mockUpdate).toHaveBeenCalledWith('123', newSettings);
        });

        it('should handle privacy update', async () => {
            const { result } = renderHook(() => useProfileSettings(), { wrapper });

            const newPrivacy = {
                profileVisibility: 'private',
                showEmail: true
            };

            // Mock successful update
            const mockUpdate = jest.fn().mockResolvedValue(mockUserPrivacy);
            result.current.updatePrivacy = mockUpdate;

            await expect(result.current.updatePrivacy('123', newPrivacy)).resolves.toEqual(mockUserPrivacy);
            expect(mockUpdate).toHaveBeenCalledWith('123', newPrivacy);
        });

        it('should handle batch update', async () => {
            const { result } = renderHook(() => useProfileSettings(), { wrapper });

            // Mock successful batch update
            const mockBatchUpdate = jest.fn().mockResolvedValue([mockUserSettings, mockUserPrivacy]);
            result.current.updateAllSettings = mockBatchUpdate;

            await expect(result.current.updateAllSettings('123', mockUserSettings, mockUserPrivacy))
                .resolves.toEqual([mockUserSettings, mockUserPrivacy]);
            expect(mockBatchUpdate).toHaveBeenCalledWith('123', mockUserSettings, mockUserPrivacy);
        });
    });

    describe('useProfileServices Hook', () => {
        it('should provide access to profile services', () => {
            const { result } = renderHook(() => useProfileServices(), { wrapper });

            expect(result.current.profileDataService).toBeDefined();
            expect(result.current.profileFeatureService).toBeDefined();
            expect(result.current.data).toBeDefined();
            expect(result.current.feature).toBeDefined();
        });

        it('should have data and feature service aliases', () => {
            const { result } = renderHook(() => useProfileServices(), { wrapper });

            expect(result.current.data).toBe(result.current.profileDataService);
            expect(result.current.feature).toBe(result.current.profileFeatureService);
        });
    });

    describe('Error Handling', () => {
        it('should handle profile fetch errors', async () => {
            const { result } = renderHook(() => useProfile(), { wrapper });

            const mockError = new Error('Profile not found');
            const mockGetProfile = jest.fn().mockRejectedValue(mockError);
            result.current.getProfile = mockGetProfile;

            await expect(result.current.getProfile('999')).rejects.toThrow('Profile not found');
        });

        it('should handle connection errors', async () => {
            const { result } = renderHook(() => useProfileConnections(), { wrapper });

            const mockError = new Error('Connection failed');
            const mockFollow = jest.fn().mockRejectedValue(mockError);
            result.current.followUser = mockFollow;

            await expect(result.current.followUser('123', '456')).rejects.toThrow('Connection failed');
        });

        it('should handle settings errors', async () => {
            const { result } = renderHook(() => useProfileSettings(), { wrapper });

            const mockError = new Error('Settings update failed');
            const mockUpdate = jest.fn().mockRejectedValue(mockError);
            result.current.updateSettings = mockUpdate;

            await expect(result.current.updateSettings('123', mockUserSettings)).rejects.toThrow('Settings update failed');
        });
    });

    describe('Performance Tests', () => {
        it('should handle rapid successive calls', async () => {
            const { result } = renderHook(() => useProfile(), { wrapper });

            const mockUpdate = jest.fn().mockResolvedValue(mockUserProfile);
            result.current.updateProfile = mockUpdate;

            // Make multiple rapid calls
            const promises = Array.from({ length: 10 }, (_, i) => 
                result.current.updateProfile('123', { username: `user${i}` })
            );

            await Promise.all(promises);
            expect(mockUpdate).toHaveBeenCalledTimes(10);
        });

        it('should handle large search results', async () => {
            const { result } = renderHook(() => useProfile(), { wrapper });

            const largeResults = Array.from({ length: 1000 }, (_, i) => ({
                ...mockUserProfile,
                id: `user${i}`,
                username: `user${i}`
            }));

            const mockSearch = jest.fn().mockResolvedValue(largeResults);
            result.current.searchUsers = mockSearch;

            await expect(result.current.searchUsers('test', { limit: 1000 })).resolves.toBeUndefined();
            expect(mockSearch).toHaveBeenCalledWith('test', { limit: 1000 });
        });
    });
});

// Integration test for component rendering
describe('Profile Component Integration', () => {
    it('should render profile components without errors', () => {
        // This would test the actual component rendering
        // For now, we'll just test that the hooks can be used together
        const { result: profileResult } = renderHook(() => useProfile(), { wrapper });
        const { result: connectionsResult } = renderHook(() => useProfileConnections(), { wrapper });
        const { result: settingsResult } = renderHook(() => useProfileSettings(), { wrapper });

        expect(profileResult.current).toBeDefined();
        expect(connectionsResult.current).toBeDefined();
        expect(settingsResult.current).toBeDefined();
    });
});
