/**
 * Profile Test Utilities Barrel Export.
 * 
 * Provides a single entry point for all test utilities
 * to simplify imports in test files.
 */

export {
  MockDataFactory,
  MockProfileRepository,
  PerformanceUtils,
  StateUtils,
  ProfileAssertions,
  EventMockUtils,
  renderHookWithProviders
} from './testUtils';

export {
  setupMockRepository,
  createTestHook,
  waitForAsync,
  simulateNetworkDelay,
  createMockResponse,
  createMockErrorResponse,
  mockFetch,
  setupTestEnvironment,
  cleanupTestEnvironment,
  createTestUserId,
  createTestData,
  assertInitialState,
  assertLoadingState,
  assertErrorState,
  assertSuccessState,
  triggerUserAction,
  waitForCondition,
  createTestContext,
  measurePerformance,
  runIntegrationTest
} from '../helpers/testHelpers';

export {
  baseUserProfile,
  privateUserProfile,
  unverifiedUserProfile,
  baseUserStats,
  highEngagementStats,
  newUserStats,
  baseUserConnection,
  oneWayConnection,
  mutualConnection,
  publicProfileAccess,
  privateFollowingAccess,
  privateBlockedAccess,
  ownProfileAccess,
  completeProfile,
  privateCompleteProfile,
  ownCompleteProfile,
  allUserProfiles,
  allUserStats,
  allUserConnections,
  allProfileAccess,
  allCompleteProfiles
} from '../fixtures/profileFixtures';

// Re-export commonly used testing libraries
export { renderHook, act, waitFor, screen, fireEvent } from '@testing-library/react';
export { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
