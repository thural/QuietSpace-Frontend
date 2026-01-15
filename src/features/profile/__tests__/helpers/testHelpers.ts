/**
 * Profile Test Helpers.
 * 
 * Helper functions and utilities for Profile feature testing.
 * Provides common test patterns and setup functions.
 */

import { act, renderHook, waitFor } from '@testing-library/react';
import { jest } from '@jest/globals';
import type { ResId } from '@/api/schemas/inferred/common';
import { MockDataFactory, MockProfileRepository } from '../utils/testUtils';
import { baseUserProfile, baseUserStats } from '../fixtures/profileFixtures';

/**
 * Sets up a mock profile repository with test data.
 */
export const setupMockRepository = (overrides: Record<string, any> = {}) => {
  const repository = new MockProfileRepository({
    'profile-test-user-123': baseUserProfile,
    'stats-test-user-123': baseUserStats,
    ...overrides
  });

  return repository;
};

/**
 * Creates a test hook with mocked dependencies.
 */
export const createTestHook = <T>(
  hookFactory: (repository: MockProfileRepository) => () => T,
  overrides: Record<string, any> = {}
) => {
  const repository = setupMockRepository(overrides);
  const hook = hookFactory(repository);

  return {
    hook,
    repository,
    result: renderHook(() => hook()).result
  };
};

/**
 * Waits for async operations to complete in tests.
 */
export const waitForAsync = async (ms = 0) => {
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, ms));
  });
};

/**
 * Simulates network delay in tests.
 */
export const simulateNetworkDelay = (ms = 100) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Creates a mock fetch response for API calls.
 */
export const createMockResponse = <T>(
  data: T,
  status = 200,
  ok = true
) => {
  return Promise.resolve({
    ok,
    status,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data))
  } as Response);
};

/**
 * Creates a mock error response.
 */
export const createMockErrorResponse = (
  message: string,
  status = 500
) => {
  return Promise.resolve({
    ok: false,
    status,
    json: () => Promise.resolve({ error: message }),
    text: () => Promise.resolve(JSON.stringify({ error: message }))
  } as Response);
};

/**
 * Mocks the global fetch function.
 */
export const mockFetch = (responses: Array<Response | Error>) => {
  let callCount = 0;
  
  global.fetch = jest.fn(() => {
    const response = responses[callCount] || responses[responses.length - 1];
    callCount++;
    
    if (response instanceof Error) {
      return Promise.reject(response);
    }
    
    return Promise.resolve(response);
  });
  
  return () => {
    (global.fetch as jest.Mock).mockClear();
  };
};

/**
 * Sets up test environment with common mocks.
 */
export const setupTestEnvironment = () => {
  // Mock ResizeObserver
  global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn()
  })) as any;

  // Mock IntersectionObserver
  global.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn()
  })) as any;

  // Mock localStorage
  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
    length: 0,
    key: jest.fn()
  };
  
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
  });

  // Mock sessionStorage
  const sessionStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
    length: 0,
    key: jest.fn()
  };
  
  Object.defineProperty(window, 'sessionStorage', {
    value: sessionStorageMock
  });

  return {
    localStorage: localStorageMock,
    sessionStorage: sessionStorageMock
  };
};

/**
 * Cleans up test environment.
 */
export const cleanupTestEnvironment = () => {
  jest.clearAllMocks();
  
  // Restore localStorage
  Object.defineProperty(window, 'localStorage', {
    value: localStorage
  });
  
  // Restore sessionStorage
  Object.defineProperty(window, 'sessionStorage', {
    value: sessionStorage
  });
};

/**
 * Creates a test user ID.
 */
export const createTestUserId = (suffix = '123'): ResId => {
  return `test-user-${suffix}` as ResId;
};

/**
 * Creates test user data.
 */
export const createTestData = (overrides: any = {}) => {
  return {
    user: MockDataFactory.createUserProfile(overrides.user),
    stats: MockDataFactory.createUserStats(overrides.stats),
    connections: {
      followers: [MockDataFactory.createUserConnection(overrides.follower)],
      followings: [MockDataFactory.createUserConnection(overrides.following)]
    }
  };
};

/**
 * Asserts that a hook has the expected initial state.
 */
export const assertInitialState = (
  result: any,
  expectedState: Record<string, any>
) => {
  Object.entries(expectedState).forEach(([key, value]) => {
    expect(result.current[key]).toEqual(value);
  });
};

/**
 * Asserts that a hook is in loading state.
 */
export const assertLoadingState = (result: any) => {
  expect(result.current.isLoading).toBe(true);
  expect(result.current.error).toBeNull();
};

/**
 * Asserts that a hook has an error state.
 */
export const assertErrorState = (
  result: any,
  expectedError: Error | string
) => {
  expect(result.current.isLoading).toBe(false);
  expect(result.current.error).toBeTruthy();
  
  if (typeof expectedError === 'string') {
    expect(result.current.error?.message).toContain(expectedError);
  } else {
    expect(result.current.error).toEqual(expectedError);
  }
};

/**
 * Asserts that a hook has loaded data successfully.
 */
export const assertSuccessState = (
  result: any,
  expectedData: Record<string, any>
) => {
  expect(result.current.isLoading).toBe(false);
  expect(result.current.error).toBeNull();
  
  Object.entries(expectedData).forEach(([key, value]) => {
    expect(result.current[key]).toEqual(value);
  });
};

/**
 * Triggers a user interaction in tests.
 */
export const triggerUserAction = async (
  action: () => void | Promise<void>
) => {
  await act(async () => {
    await action();
  });
};

/**
 * Waits for a condition to be true.
 */
export const waitForCondition = async (
  condition: () => boolean,
  timeout = 5000,
  interval = 50
) => {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    if (condition()) {
      return;
    }
    
    await new Promise(resolve => setTimeout(resolve, interval));
  }
  
  throw new Error(`Condition not met within ${timeout}ms`);
};

/**
 * Creates a test context with common setup.
 */
export const createTestContext = (options: {
  userId?: ResId;
  mockData?: Record<string, any>;
  setupMocks?: boolean;
} = {}) => {
  const {
    userId = createTestUserId(),
    mockData = {},
    setupMocks = true
  } = options;

  let cleanup: (() => void) | undefined;

  if (setupMocks) {
    const mocks = setupTestEnvironment();
    cleanup = () => cleanupTestEnvironment();
  }

  const repository = setupMockRepository(mockData);

  return {
    userId,
    repository,
    cleanup,
    testData: createTestData(mockData)
  };
};

/**
 * Performance test helper.
 */
export const measurePerformance = async (
  fn: () => void | Promise<void>,
  iterations = 100
) => {
  const times: number[] = [];
  
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    await fn();
    const end = performance.now();
    times.push(end - start);
  }
  
  const average = times.reduce((sum, time) => sum + time, 0) / times.length;
  const min = Math.min(...times);
  const max = Math.max(...times);
  
  return {
    average,
    min,
    max,
    times
  };
};

/**
 * Integration test helper for end-to-end scenarios.
 */
export const runIntegrationTest = async (
  setup: () => Promise<any>,
  action: (context: any) => Promise<void>,
  assertion: (context: any) => void
) => {
  const context = await setup();
  
  await act(async () => {
    await action(context);
  });
  
  assertion(context);
};
