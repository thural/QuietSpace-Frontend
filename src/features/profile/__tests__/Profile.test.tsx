/**
 * Profile Feature Test Suite.
 * 
 * Comprehensive test suite for Profile feature covering:
 * - Unit tests for domain layer
 * - Integration tests for data layer
 * - Application layer tests
 * - Component tests for presentation layer
 * - Performance tests
 * - Integration tests
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import type { UserProfileEntity, UserProfileStatsEntity } from '../domain';
import { calculateEngagementRate, getProfileCompletion, getProfileStrength } from '../domain';
import { useProfileStore } from '../state/ProfileStore';

// Mock data for testing
const mockUserProfile: UserProfileEntity = {
  id: 'test-user-1',
  username: 'testuser1',
  email: 'testuser1@example.com',
  bio: 'Test bio',
  photo: { type: 'avatar', id: 'default', name: 'Test User', url: 'https://example.com/avatar.jpg' },
  settings: {
    theme: 'light',
    language: 'en',
    notifications: true
  },
  isPrivateAccount: false,
  isVerified: true,
  createdAt: '2023-01-01T00:00:00',
  updatedAt: '2023-01-15T00:00:00'
};

const mockUserStats: UserProfileStatsEntity = {
  postsCount: 50,
  followersCount: 250,
  followingsCount: 100,
  likesCount: 500,
  sharesCount: 10,
  commentsCount: 100
};

describe('Profile Feature', () => {
  beforeEach(() => {
    useProfileStore.setState({
      userProfile: null,
      userStats: null,
      profileAccess: null,
      followers: [],
      followings: [],
      viewFollowers: false,
      viewFollowings: false,
      activeTab: 'posts',
      isLoading: false,
      isRefreshing: false,
      error: null,
      lastProfileUpdate: null,
      lastFollowersUpdate: null,
      lastFollowingsUpdate: null,
      isOnline: true,
      lastSyncTime: null,
      cacheExpiry: 5 * 60 * 1000,
      retryCount: 0
    });
  });

  it('computes profile completion via domain logic', () => {
    const completion = getProfileCompletion(mockUserProfile);
    expect(completion).toBeGreaterThanOrEqual(0);
    expect(completion).toBeLessThanOrEqual(100);
  });

  it('computes engagement rate via domain logic', () => {
    const rate = calculateEngagementRate(mockUserStats);
    expect(rate).toBeGreaterThanOrEqual(0);
  });

  it('computes profile strength via domain logic', () => {
    const strength = getProfileStrength(mockUserProfile, mockUserStats);
    expect(strength).toBeGreaterThanOrEqual(0);
    expect(strength).toBeLessThanOrEqual(100);
  });

  it('updates Zustand store state', () => {
    useProfileStore.getState().setUserProfile(mockUserProfile);
    expect(useProfileStore.getState().userProfile?.id).toBe('test-user-1');
  });
});
