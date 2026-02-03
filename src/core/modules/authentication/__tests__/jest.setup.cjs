/**
 * Jest Setup Configuration for Authentication Module Tests
 * 
 * Global test setup including mocks, environment configuration,
 * and test utilities for authentication module testing.
 */

// Mock console methods to avoid noise in test output
global.console = {
    ...console,
    // Uncomment to suppress console.log during tests
    // log: jest.fn(),
    // warn: jest.fn(),
    // error: jest.fn(),
};

// Mock fetch for API calls
global.fetch = jest.fn();

// Setup global test utilities
global.testUtils = {
    createMockDate: (offset = 0) => new Date(Date.now() + offset),
    createMockUUID: () => 'test-uuid-' + Math.random().toString(36).substr(2, 9),
    createMockAuthEvent: (type: string) => ({
        type,
        timestamp: new Date(),
        details: { test: true }
    })
};

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.API_BASE_URL = 'http://localhost:3000';

// Extend Jest matchers
expect.extend({
    toBeValidAuthResult(received) {
        const pass = received && 
                   typeof received === 'object' && 
                   typeof received.success === 'boolean';
        
        if (pass) {
            return {
                message: () => `expected ${received} to be a valid AuthResult`,
                pass: true,
            };
        } else {
            return {
                message: () => `expected ${received} to be a valid AuthResult`,
                pass: false,
            };
        }
    },
    
    toBeValidSession(received) {
        const pass = received && 
                   typeof received === 'object' && 
                   received.user && 
                   received.token && 
                   received.provider;
        
        if (pass) {
            return {
                message: () => `expected ${received} to be a valid AuthSession`,
                pass: true,
            };
        } else {
            return {
                message: () => `expected ${received} to be a valid AuthSession`,
                pass: false,
            };
        }
    },
    
    toBeHealthy(received) {
        const pass = received && 
                   typeof received === 'object' && 
                   typeof received.healthy === 'boolean';
        
        if (pass) {
            return {
                message: () => `expected ${received} to be a valid HealthCheckResult`,
                pass: true,
            };
        } else {
            return {
                message: () => `expected ${received} to be a valid HealthCheckResult`,
                pass: false,
            };
        }
    }
});

// Global test cleanup
afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
});

// Error handling for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
