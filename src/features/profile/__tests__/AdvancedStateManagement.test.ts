/**
 * Advanced State Management Tests.
 * 
 * Tests for optimistic updates, background sync, real-time features,
 * and performance optimizations in the Profile state management.
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, act } from '@testing-library/react';
import { useAdvancedProfileState } from '../state/useAdvancedProfileState';
import { useProfileStore } from '../state/ProfileStore';
import type { ResId } from '@/api/schemas/inferred/common';

// Mock the application hook
jest.mock('../application/useProfile', () => ({
  useProfile: jest.fn(() => ({
    userProfile: {
      id: '123',
      username: 'testuser',
      email: 'test@example.com',
      bio: 'Test bio',
      photo: undefined,
      settings: undefined,
      isPrivateAccount: false,
      isVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    userStats: {
      postsCount: 10,
      followersCount: 100,
      followingsCount: 50,
      likesCount: 200,
      sharesCount: 50,
      commentsCount: 150
    },
    profileAccess: {
      canViewProfile: true,
      canFollowUser: true,
      canMessageUser: true,
      isOwnProfile: false
    },
    completeProfile: null,
    userConnections: {
      followers: [],
      followings: []
    },
    isLoading: false,
    error: null,
    viewFollowers: false,
    viewFollowings: false,
    refreshProfile: jest.fn(),
    followUser: jest.fn(),
    unfollowUser: jest.fn(),
    toggleFollowers: jest.fn(),
    toggleFollowings: jest.fn()
  }))
}));

describe('Advanced State Management', () => {
  const testUserId: ResId = '123';

  beforeEach(() => {
    // Reset store state before each test
    const store = useProfileStore.getState();
    store.resetAllState();
    
    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('Optimistic Updates', () => {
    it('should handle optimistic follow updates', async () => {
      const { result } = renderHook(() => 
        useAdvancedProfileState(testUserId, {
          enableOptimisticUpdates: true
        })
      );

      // Initially no optimistic follows
      expect(result.current.optimisticFollows.has(testUserId)).toBe(false);
      expect(result.current.computed.isFollowingOptimistically).toBe(false);

      // Perform optimistic follow
      act(() => {
        result.current.actions.optimisticFollow(testUserId);
      });

      // Should have optimistic follow state
      expect(result.current.optimisticFollows.has(testUserId)).toBe(true);
      expect(result.current.optimisticFollows.get(testUserId)).toBe('follow');
      expect(result.current.computed.isFollowingOptimistically).toBe(true);
      expect(result.current.computed.hasPendingUpdates).toBe(true);
    });

    it('should handle optimistic unfollow updates', async () => {
      const { result } = renderHook(() => 
        useAdvancedProfileState(testUserId, {
          enableOptimisticUpdates: true
        })
      );

      // Perform optimistic unfollow
      act(() => {
        result.current.actions.optimisticUnfollow(testUserId);
      });

      // Should have optimistic unfollow state
      expect(result.current.optimisticFollows.has(testUserId)).toBe(true);
      expect(result.current.optimisticFollows.get(testUserId)).toBe('unfollow');
      expect(result.current.computed.isFollowingOptimistically).toBe(true);
      expect(result.current.computed.hasPendingUpdates).toBe(true);
    });

    it('should not perform optimistic updates when disabled', async () => {
      const { result } = renderHook(() => 
        useAdvancedProfileState(testUserId, {
          enableOptimisticUpdates: false
        })
      );

      // Attempt optimistic follow
      act(() => {
        result.current.actions.optimisticFollow(testUserId);
      });

      // Should not have optimistic follow state
      expect(result.current.optimisticFollows.has(testUserId)).toBe(false);
      expect(result.current.computed.isFollowingOptimistically).toBe(false);
      expect(result.current.computed.hasPendingUpdates).toBe(false);
    });
  });

  describe('Background Sync', () => {
    it('should add items to sync queue', async () => {
      const { result } = renderHook(() => 
        useAdvancedProfileState(testUserId, {
          enableBackgroundSync: true
        })
      );

      // Initially empty sync queue
      expect(result.current.syncQueue).toHaveLength(0);
      expect(result.current.computed.needsSync).toBe(false);

      // Perform optimistic follow (which adds to sync queue)
      act(() => {
        result.current.actions.optimisticFollow(testUserId);
      });

      // Should have item in sync queue
      expect(result.current.syncQueue).toHaveLength(1);
      expect(result.current.syncQueue[0].type).toBe('follow');
      expect(result.current.syncQueue[0].data.userId).toBe(testUserId);
      expect(result.current.computed.needsSync).toBe(true);
    });

    it('should process sync queue when syncNow is called', async () => {
      const mockFollowUser = jest.fn().mockResolvedValue(undefined);
      
      // Mock the useProfile hook to return our mock function
      jest.doMock('../application/useProfile', () => ({
        useProfile: jest.fn(() => ({
          userProfile: {
            id: '123',
            username: 'testuser',
            email: 'test@example.com',
            bio: 'Test bio',
            photo: undefined,
            settings: undefined,
            isPrivateAccount: false,
            isVerified: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          userStats: {
            postsCount: 10,
            followersCount: 100,
            followingsCount: 50,
            likesCount: 200,
            sharesCount: 50,
            commentsCount: 150
          },
          profileAccess: {
            canViewProfile: true,
            canFollowUser: true,
            canMessageUser: true,
            isOwnProfile: false
          },
          completeProfile: null,
          userConnections: {
            followers: [],
            followings: []
          },
          isLoading: false,
          error: null,
          viewFollowers: false,
          viewFollowings: false,
          refreshProfile: jest.fn(),
          followUser: mockFollowUser,
          unfollowUser: jest.fn(),
          toggleFollowers: jest.fn(),
          toggleFollowings: jest.fn()
        }))
      }));

      const { result } = renderHook(() => 
        useAdvancedProfileState(testUserId, {
          enableBackgroundSync: true
        })
      );

      // Add item to sync queue
      act(() => {
        result.current.actions.optimisticFollow(testUserId);
      });

      expect(result.current.syncQueue).toHaveLength(1);

      // Process sync queue
      act(async () => {
        await result.current.actions.syncNow();
      });

      // Should have called followUser and cleared queue
      expect(mockFollowUser).toHaveBeenCalled();
      expect(result.current.syncQueue).toHaveLength(0);
      expect(result.current.optimisticFollows.has(testUserId)).toBe(false);
    });

    it('should not sync when disabled', async () => {
      const { result } = renderHook(() => 
        useAdvancedProfileState(testUserId, {
          enableBackgroundSync: false
        })
      );

      // Add item to sync queue
      act(() => {
        result.current.actions.optimisticFollow(testUserId);
      });

      expect(result.current.syncQueue).toHaveLength(1);

      // Attempt to sync
      act(async () => {
        await result.current.actions.syncNow();
      });

      // Queue should remain unchanged
      expect(result.current.syncQueue).toHaveLength(1);
    });
  });

  describe('Real-time Features', () => {
    it('should enable real-time updates', async () => {
      const { result } = renderHook(() => 
        useAdvancedProfileState(testUserId, {
          enableRealTime: true
        })
      );

      // Initially real-time is disabled
      expect(result.current.realTimeEnabled).toBe(false);

      // Enable real-time
      act(() => {
        result.current.actions.enableRealTime();
      });

      // Should enable real-time
      expect(result.current.realTimeEnabled).toBe(true);
    });

    it('should disable real-time updates', async () => {
      const { result } = renderHook(() => 
        useAdvancedProfileState(testUserId, {
          enableRealTime: true
        })
      );

      // Enable real-time first
      act(() => {
        result.current.actions.enableRealTime();
      });
      expect(result.current.realTimeEnabled).toBe(true);

      // Disable real-time
      act(() => {
        result.current.actions.disableRealTime();
      });

      // Should disable real-time
      expect(result.current.realTimeEnabled).toBe(false);
    });

    it('should not enable real-time when disabled in config', async () => {
      const { result } = renderHook(() => 
        useAdvancedProfileState(testUserId, {
          enableRealTime: false
        })
      );

      // Attempt to enable real-time
      act(() => {
        result.current.actions.enableRealTime();
      });

      // Should remain disabled
      expect(result.current.realTimeEnabled).toBe(false);
    });
  });

  describe('Performance Optimizations', () => {
    it('should compute cache age correctly', async () => {
      const { result } = renderHook(() => 
        useAdvancedProfileState(testUserId)
      );

      // Initially no cache age
      expect(result.current.computed.cacheAge).toBe(0);

      // Set profile data (which updates lastProfileUpdate)
      const store = useProfileStore.getState();
      act(() => {
        store.setUserProfile({
          id: '123',
          username: 'testuser',
          email: 'test@example.com',
          bio: 'Test bio',
          photo: undefined,
          settings: undefined,
          isPrivateAccount: false,
          isVerified: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      });

      // Should have cache age
      expect(result.current.computed.cacheAge).toBeGreaterThan(0);
    });

    it('should clear cache properly', async () => {
      const { result } = renderHook(() => 
        useAdvancedProfileState(testUserId)
      );

      // Set some state
      const store = useProfileStore.getState();
      act(() => {
        store.setUserProfile({
          id: '123',
          username: 'testuser',
          email: 'test@example.com',
          bio: 'Test bio',
          photo: undefined,
          settings: undefined,
          isPrivateAccount: false,
          isVerified: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        store.setActiveTab('followers');
      });

      // Verify state is set
      expect(result.current.userProfile).toBeTruthy();
      expect(result.current.activeTab).toBe('followers');

      // Clear cache
      act(() => {
        result.current.actions.clearCache();
      });

      // Should reset state
      expect(result.current.userProfile).toBeNull();
      expect(result.current.activeTab).toBe('posts');
    });

    it('should reset state properly', async () => {
      const { result } = renderHook(() => 
        useAdvancedProfileState(testUserId)
      );

      // Set some state
      const store = useProfileStore.getState();
      act(() => {
        store.setUserProfile({
          id: '123',
          username: 'testuser',
          email: 'test@example.com',
          bio: 'Test bio',
          photo: undefined,
          settings: undefined,
          isPrivateAccount: false,
          isVerified: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        store.setOptimisticFollow(testUserId, 'follow');
      });

      // Verify state is set
      expect(result.current.userProfile).toBeTruthy();
      expect(result.current.optimisticFollows.has(testUserId)).toBe(true);

      // Reset state
      act(() => {
        result.current.actions.resetState();
      });

      // Should reset all state
      expect(result.current.userProfile).toBeNull();
      expect(result.current.optimisticFollows.has(testUserId)).toBe(false);
      expect(result.current.syncQueue).toHaveLength(0);
      expect(result.current.pendingUpdates.size).toBe(0);
    });
  });

  describe('Online/Offline Detection', () => {
    it('should detect online status changes', async () => {
      const { result } = renderHook(() => 
        useAdvancedProfileState(testUserId)
      );

      // Initially online
      expect(result.current.isOnline).toBe(true);

      // Simulate offline
      act(() => {
        Object.defineProperty(navigator, 'onLine', {
          writable: true,
          value: false
        });
        window.dispatchEvent(new Event('offline'));
      });

      // Should detect offline
      expect(result.current.isOnline).toBe(false);

      // Simulate online
      act(() => {
        Object.defineProperty(navigator, 'onLine', {
          writable: true,
          value: true
        });
        window.dispatchEvent(new Event('online'));
      });

      // Should detect online
      expect(result.current.isOnline).toBe(true);
    });
  });

  describe('Retry Logic', () => {
    it('should handle retry logic correctly', async () => {
      const { result } = renderHook(() => 
        useAdvancedProfileState(testUserId, {
          maxRetries: 3
        })
      );

      // Initially can retry
      expect(result.current.computed.canRetry).toBe(true);

      // Increment retry count
      const store = useProfileStore.getState();
      act(() => {
        store.incrementRetryCount();
      });

      // Should still be able to retry
      expect(result.current.computed.canRetry).toBe(true);

      // Max out retries
      act(() => {
        store.incrementRetryCount();
        store.incrementRetryCount();
        store.incrementRetryCount();
      });

      // Should not be able to retry
      expect(result.current.computed.canRetry).toBe(false);

      // Reset retry count
      act(() => {
        store.resetRetryCount();
      });

      // Should be able to retry again
      expect(result.current.computed.canRetry).toBe(true);
    });
  });
});
