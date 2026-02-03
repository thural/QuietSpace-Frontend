/**
 * Jest Setup File for Cache Module Tests
 * 
 * Global test configuration and mocks for cache module testing.
 */

import { jest } from '@jest/globals';

// Mock performance API for Node.js environment
if (typeof performance === 'undefined') {
    (global as any).performance = {
        now: jest.fn(() => Date.now())
    };
}

// Mock console methods to reduce noise in tests
const originalConsole = { ...console };

beforeEach(() => {
    // Restore console methods before each test
    Object.assign(console, originalConsole);

    // Clear all mocks
    jest.clearAllMocks();
});

afterEach(() => {
    // Restore console methods after each test
    Object.assign(console, originalConsole);
});

// Global test utilities
(global as any).createMockCacheEntry = <T>(data: T, ttl = 300000, timestamp?: number) => ({
    data,
    timestamp: timestamp || Date.now(),
    ttl,
    accessCount: 0,
    lastAccessed: Date.now()
});

(global as any).createMockCacheConfig = (overrides = {}) => ({
    defaultTTL: 300000,
    maxSize: 1000,
    cleanupInterval: 60000,
    enableStats: true,
    enableLRU: true,
    ...overrides
});

// Mock timers for consistent testing
jest.useFakeTimers();

// Increase timeout for async operations
jest.setTimeout(10000);

// Add a dummy test to make this file valid for Jest
describe('Cache Module Setup', () => {
    test('setup file is loaded', () => {
        expect(typeof performance.now).toBe('function');
    });
});
