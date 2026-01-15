/**
 * Testing Infrastructure Tests.
 * 
 * Tests for the Profile feature testing infrastructure itself.
 * Ensures that utilities, fixtures, and helpers work correctly.
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import {
  MockDataFactory,
  PerformanceUtils,
  StateUtils,
  ProfileAssertions,
  setupMockRepository,
  createTestContext,
  baseUserProfile,
  completeProfile
} from '../utils';

describe('Testing Infrastructure', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('MockDataFactory', () => {
    it('should create valid user profile', () => {
      const profile = MockDataFactory.createUserProfile();
      
      ProfileAssertions.assertValidProfile(profile);
      expect(profile.id).toBeDefined();
      expect(profile.username).toBeDefined();
      expect(profile.email).toBeDefined();
    });

    it('should create user profile with overrides', () => {
      const profile = MockDataFactory.createUserProfile({
        username: 'customuser',
        isVerified: true
      });
      
      expect(profile.username).toBe('customuser');
      expect(profile.isVerified).toBe(true);
    });

    it('should create valid user stats', () => {
      const stats = MockDataFactory.createUserStats();
      
      ProfileAssertions.assertValidStats(stats);
      expect(typeof stats.postsCount).toBe('number');
      expect(typeof stats.followersCount).toBe('number');
    });

    it('should create valid user connection', () => {
      const connection = MockDataFactory.createUserConnection();
      
      ProfileAssertions.assertValidConnection(connection);
      expect(connection.id).toBeDefined();
      expect(connection.username).toBeDefined();
    });

    it('should create complete profile', () => {
      const complete = MockDataFactory.createCompleteProfile();
      
      expect(complete.profile).toBeDefined();
      expect(complete.stats).toBeDefined();
      expect(complete.access).toBeDefined();
      expect(complete.state).toBeDefined();
      expect(complete.followers).toBeDefined();
      expect(complete.followings).toBeDefined();
    });
  });

  describe('PerformanceUtils', () => {
    it('should measure execution time', async () => {
      const { result, averageTime, totalTime } = await PerformanceUtils.measureTime(
        () => Math.random() * 100,
        10
      );
      
      expect(typeof result).toBe('number');
      expect(typeof averageTime).toBe('number');
      expect(typeof totalTime).toBe('number');
      expect(averageTime).toBeLessThanOrEqual(totalTime);
    });

    it('should assert execution time within limit', async () => {
      const result = await PerformanceUtils.expectExecutionTime(
        () => 'fast result',
        100 // 100ms limit
      );
      
      expect(result).toBe('fast result');
    });

    it('should throw when execution exceeds limit', async () => {
      await expect(
        PerformanceUtils.expectExecutionTime(
          () => new Promise(resolve => setTimeout(resolve, 200)),
          100 // 100ms limit
        )
      ).rejects.toThrow('took');
    });
  });

  describe('StateUtils', () => {
    it('should create mock store state', () => {
      const mockState = StateUtils.createMockStoreState({
        userProfile: baseUserProfile
      });
      
      expect(mockState.userProfile).toEqual(baseUserProfile);
      expect(mockState.isLoading).toBe(false);
      expect(mockState.error).toBeNull();
    });

    it('should wait for state update', async () => {
      let state = { value: 0 };
      const getState = () => state;
      
      // Update state after delay
      setTimeout(() => {
        state.value = 1;
      }, 100);
      
      await StateUtils.waitForStateUpdate(
        getState,
        (s) => s.value === 1
      );
      
      expect(state.value).toBe(1);
    });
  });

  describe('ProfileAssertions', () => {
    it('should assert valid profile', () => {
      expect(() => {
        ProfileAssertions.assertValidProfile(baseUserProfile);
      }).not.toThrow();
    });

    it('should throw for invalid profile', () => {
      const invalidProfile = { ...baseUserProfile, id: undefined };
      
      expect(() => {
        ProfileAssertions.assertValidProfile(invalidProfile as any);
      }).toThrow();
    });

    it('should assert valid stats', () => {
      const stats = MockDataFactory.createUserStats();
      
      expect(() => {
        ProfileAssertions.assertValidStats(stats);
      }).not.toThrow();
    });

    it('should assert valid connection', () => {
      const connection = MockDataFactory.createUserConnection();
      
      expect(() => {
        ProfileAssertions.assertValidConnection(connection);
      }).not.toThrow();
    });
  });

  describe('Test Helpers', () => {
    it('should setup mock repository', () => {
      const repository = setupMockRepository({
        'profile-test-user': baseUserProfile
      });
      
      expect(repository).toBeDefined();
      expect(repository.isLoading()).toBe(false);
    });

    it('should create test context', () => {
      const context = createTestContext({
        userId: 'test-user-123',
        setupMocks: true
      });
      
      expect(context.userId).toBe('test-user-123');
      expect(context.repository).toBeDefined();
      expect(context.cleanup).toBeDefined();
      expect(context.testData).toBeDefined();
    });

    it('should cleanup test context', () => {
      const context = createTestContext({
        setupMocks: true
      });
      
      expect(() => {
        context.cleanup?.();
      }).not.toThrow();
    });
  });

  describe('Fixtures', () => {
    it('should provide valid base user profile', () => {
      expect(baseUserProfile.id).toBeDefined();
      expect(baseUserProfile.username).toBe('johndoe');
      expect(baseUserProfile.email).toBe('john.doe@example.com');
    });

    it('should provide valid complete profile', () => {
      expect(completeProfile.profile).toBeDefined();
      expect(completeProfile.stats).toBeDefined();
      expect(completeProfile.access).toBeDefined();
      expect(completeProfile.state).toBeDefined();
      expect(completeProfile.followers).toBeDefined();
      expect(completeProfile.followings).toBeDefined();
    });
  });

  describe('Integration Test Example', () => {
    it('should demonstrate integration testing pattern', async () => {
      // Setup
      const context = createTestContext({
        userId: 'test-user-123'
      });

      // Act
      const profile = await context.repository.getProfile('test-user-123');

      // Assert
      expect(profile).toBeDefined();
      expect(profile.id).toBe('user-123');

      // Cleanup
      context.cleanup?.();
    });
  });

  describe('Error Handling', () => {
    it('should handle repository errors', async () => {
      const repository = setupMockRepository();
      repository.setError(new Error('Test error'));

      await expect(repository.getProfile('test-user')).rejects.toThrow('Test error');
    });

    it('should handle loading states', () => {
      const repository = setupMockRepository();
      repository.setLoading(true);

      expect(repository.isLoading()).toBe(true);
    });
  });

  describe('Performance Benchmarks', () => {
    it('should benchmark mock data creation', async () => {
      const { averageTime } = await PerformanceUtils.measureTime(
        () => {
          for (let i = 0; i < 100; i++) {
            MockDataFactory.createUserProfile();
          }
        },
        10
      );

      // Should create 100 profiles in less than 50ms on average
      expect(averageTime).toBeLessThan(50);
    });

    it('should benchmark assertion functions', async () => {
      const profiles = Array.from({ length: 100 }, () => 
        MockDataFactory.createUserProfile()
      );

      const { averageTime } = await PerformanceUtils.measureTime(
        () => {
          profiles.forEach(profile => {
            ProfileAssertions.assertValidProfile(profile);
          });
        },
        10
      );

      // Should validate 100 profiles in less than 100ms on average
      expect(averageTime).toBeLessThan(100);
    });
  });
});
