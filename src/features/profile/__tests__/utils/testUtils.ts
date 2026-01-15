/**
 * Profile Test Utilities.
 * 
 * Common utilities and helper functions for Profile feature testing.
 * Provides reusable test setup, mocking, and assertion utilities.
 */

import { renderHook, RenderHookOptions } from '@testing-library/react';
import React, { ReactElement, ReactNode } from 'react';
import type { ResId } from '@/api/schemas/inferred/common';
import type {
  UserProfileEntity,
  UserProfileStatsEntity,
  UserConnectionEntity,
  ProfileAccessEntity,
  CompleteProfileEntity
} from '../../domain';

/**
 * Mock data factory for creating test entities.
 */
export class MockDataFactory {
  /**
   * Creates a mock user profile entity.
   */
  static createUserProfile(overrides: Partial<UserProfileEntity> = {}): UserProfileEntity {
    return {
      id: 'test-user-123',
      username: 'testuser',
      email: 'test@example.com',
      bio: 'Test user bio',
      photo: undefined,
      settings: {
        theme: 'light',
        language: 'en',
        notifications: true
      },
      isPrivateAccount: false,
      isVerified: false,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      ...overrides
    };
  }

  /**
   * Creates a mock user profile stats entity.
   */
  static createUserStats(overrides: Partial<UserProfileStatsEntity> = {}): UserProfileStatsEntity {
    return {
      postsCount: 10,
      followersCount: 100,
      followingsCount: 50,
      likesCount: 200,
      sharesCount: 50,
      commentsCount: 150,
      ...overrides
    };
  }

  /**
   * Creates a mock user connection entity.
   */
  static createUserConnection(overrides: Partial<UserConnectionEntity> = {}): UserConnectionEntity {
    return {
      id: 'connection-123',
      username: 'connecteduser',
      bio: 'Connected user bio',
      photo: undefined,
      isFollowing: true,
      isMutual: true,
      connectedAt: '2024-01-01T00:00:00Z',
      ...overrides
    };
  }

  /**
   * Creates a mock profile access entity.
   */
  static createProfileAccess(overrides: Partial<ProfileAccessEntity> = {}): ProfileAccessEntity {
    return {
      hasAccess: true,
      isOwner: false,
      isFollowing: false,
      isPrivate: false,
      reason: 'allowed',
      ...overrides
    };
  }

  /**
   * Creates a mock complete profile entity.
   */
  static createCompleteProfile(overrides: Partial<CompleteProfileEntity> = {}): CompleteProfileEntity {
    const profile = this.createUserProfile(overrides.profile);
    const stats = this.createUserStats(overrides.stats);
    const access = this.createProfileAccess(overrides.access);
    const state = overrides.state || {
      isLoading: false,
      isError: false,
      lastUpdated: null,
      viewFollowers: false,
      viewFollowings: false,
      activeTab: 'posts'
    };
    const followers = overrides.followers || [this.createUserConnection()];
    const followings = overrides.followings || [this.createUserConnection()];

    return {
      profile,
      stats,
      access,
      state,
      followers,
      followings,
      ...overrides
    };
  }
}

/**
 * Test wrapper component for providing context and providers.
 */
export interface TestWrapperProps {
  children: React.ReactNode;
  userId?: ResId;
  enableRepositoryPattern?: boolean;
  enableRealTime?: boolean;
  enablePersistence?: boolean;
}

/**
 * Custom render hook function with test providers.
 */
export const renderHookWithProviders = <T,>(
  hook: () => T,
  options: RenderHookOptions<T> & {
    userId?: ResId;
    enableRepositoryPattern?: boolean;
    enableRealTime?: boolean;
    enablePersistence?: boolean;
  } = {}
) => {
  const {
    userId = 'test-user-123' as ResId,
    enableRepositoryPattern = true,
    enableRealTime = false,
    enablePersistence = true,
    ...renderOptions
  } = options;

  return renderHook(hook, {
    ...renderOptions,
    wrapper: ({ children }) => {
      // Mock providers would go here
      return React.createElement(React.Fragment, null, children);
    }
  });
};

/**
 * Mock repository for testing.
 */
export class MockProfileRepository {
  private data: Map<string, any> = new Map();
  private loading = false;
  private error: Error | null = null;

  constructor(initialData: Record<string, any> = {}) {
    Object.entries(initialData).forEach(([key, value]) => {
      this.data.set(key, value);
    });
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  setError(error: Error | null) {
    this.error = error;
  }

  isLoading() {
    return this.loading;
  }

  getError() {
    return this.error;
  }

  clearError() {
    this.error = null;
  }

  // Mock repository methods
  async getProfile(userId: string) {
    if (this.loading) await new Promise(resolve => setTimeout(resolve, 100));
    if (this.error) throw this.error;
    return this.data.get(`profile-${userId}`) || MockDataFactory.createUserProfile({ id: userId });
  }

  async getProfileStats(userId: string) {
    if (this.loading) await new Promise(resolve => setTimeout(resolve, 100));
    if (this.error) throw this.error;
    return this.data.get(`stats-${userId}`) || MockDataFactory.createUserStats();
  }

  async getFollowers(userId: string) {
    if (this.loading) await new Promise(resolve => setTimeout(resolve, 100));
    if (this.error) throw this.error;
    return this.data.get(`followers-${userId}`) || [MockDataFactory.createUserConnection()];
  }

  async getFollowings(userId: string) {
    if (this.loading) await new Promise(resolve => setTimeout(resolve, 100));
    if (this.error) throw this.error;
    return this.data.get(`followings-${userId}`) || [MockDataFactory.createUserConnection()];
  }

  async followUser(userId: string) {
    if (this.loading) await new Promise(resolve => setTimeout(resolve, 100));
    if (this.error) throw this.error;
    return { success: true };
  }

  async unfollowUser(userId: string) {
    if (this.loading) await new Promise(resolve => setTimeout(resolve, 100));
    if (this.error) throw this.error;
    return { success: true };
  }

  supportsFollowMutations = true;
}

/**
 * Performance testing utilities.
 */
export class PerformanceUtils {
  /**
   * Measures execution time of a function.
   */
  static async measureTime<T>(
    fn: () => T | Promise<T>,
    iterations = 1
  ): Promise<{ result: T; averageTime: number; totalTime: number }> {
    const times: number[] = [];
    let result: T;

    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      result = await fn();
      const end = performance.now();
      times.push(end - start);
    }

    const totalTime = times.reduce((sum, time) => sum + time, 0);
    const averageTime = totalTime / iterations;

    return { result: result!, averageTime, totalTime };
  }

  /**
   * Asserts that a function executes within time limit.
   */
  static async expectExecutionTime<T>(
    fn: () => T | Promise<T>,
    maxTimeMs: number
  ): Promise<T> {
    const { result, averageTime } = await this.measureTime(fn);
    
    if (averageTime > maxTimeMs) {
      throw new Error(`Function took ${averageTime}ms, expected less than ${maxTimeMs}ms`);
    }

    return result;
  }
}

/**
 * State testing utilities.
 */
export class StateUtils {
  /**
   * Creates a mock store state.
   */
  static createMockStoreState(overrides: any = {}) {
    return {
      userProfile: MockDataFactory.createUserProfile(),
      userStats: MockDataFactory.createUserStats(),
      profileAccess: MockDataFactory.createProfileAccess(),
      followers: [MockDataFactory.createUserConnection()],
      followings: [MockDataFactory.createUserConnection()],
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
      retryCount: 0,
      optimisticFollows: new Map(),
      pendingUpdates: new Set(),
      syncInProgress: false,
      syncQueue: [],
      lastBackgroundSync: null,
      subscriptions: new Map(),
      realTimeEnabled: false,
      ...overrides
    };
  }

  /**
   * Waits for state to update.
   */
  static async waitForStateUpdate(
    getState: () => any,
    condition: (state: any) => boolean,
    timeout = 5000
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      
      const checkState = () => {
        const state = getState();
        
        if (condition(state)) {
          resolve();
        } else if (Date.now() - startTime > timeout) {
          reject(new Error(`State condition not met within ${timeout}ms`));
        } else {
          setTimeout(checkState, 50);
        }
      };
      
      checkState();
    });
  }
}

/**
 * Assertion utilities for Profile testing.
 */
export class ProfileAssertions {
  /**
   * Asserts that a profile entity is valid.
   */
  static assertValidProfile(profile: UserProfileEntity) {
    expect(profile).toBeDefined();
    expect(profile.id).toBeDefined();
    expect(profile.username).toBeDefined();
    expect(profile.email).toBeDefined();
    expect(typeof profile.isPrivateAccount).toBe('boolean');
    expect(typeof profile.isVerified).toBe('boolean');
    expect(profile.createdAt).toBeDefined();
    expect(profile.updatedAt).toBeDefined();
  }

  /**
   * Asserts that profile stats are valid.
   */
  static assertValidStats(stats: UserProfileStatsEntity) {
    expect(stats).toBeDefined();
    expect(typeof stats.postsCount).toBe('number');
    expect(typeof stats.followersCount).toBe('number');
    expect(typeof stats.followingsCount).toBe('number');
    expect(typeof stats.likesCount).toBe('number');
    expect(typeof stats.sharesCount).toBe('number');
    expect(typeof stats.commentsCount).toBe('number');
  }

  /**
   * Asserts that a user connection is valid.
   */
  static assertValidConnection(connection: UserConnectionEntity) {
    expect(connection).toBeDefined();
    expect(connection.id).toBeDefined();
    expect(connection.username).toBeDefined();
    expect(typeof connection.isFollowing).toBe('boolean');
    expect(typeof connection.isMutual).toBe('boolean');
    expect(connection.connectedAt).toBeDefined();
  }
}

/**
 * Mock event utilities for testing real-time features.
 */
export class EventMockUtils {
  private static listeners: Map<string, Function[]> = new Map();

  /**
   * Mocks addEventListener.
   */
  static mockAddEventListener(target: EventTarget, event: string, handler: Function) {
    const listeners = this.listeners.get(event) || [];
    listeners.push(handler);
    this.listeners.set(event, listeners);
    
    target.addEventListener(event, handler as EventListener);
  }

  /**
   * Triggers a mock event.
   */
  static triggerEvent(event: string, data?: any) {
    const listeners = this.listeners.get(event) || [];
    listeners.forEach(listener => listener(data));
  }

  /**
   * Clears all mock listeners.
   */
  static clearListeners() {
    this.listeners.clear();
  }
}
