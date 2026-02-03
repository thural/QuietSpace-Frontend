/**
 * Jest Configuration for Authentication Module Tests
 * 
 * Configuration for running unit, integration, and e2e tests
 * with coverage reporting and test environment setup.
 */

module.exports = {
    // Test environment
    testEnvironment: 'node',

    // Test file patterns
    testMatch: [
        '**/__tests__/**/*.test.ts',
        '**/__tests__/**/*.test.tsx'
    ],

    // Coverage configuration
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        },
        './src/core/modules/authentication/**/*.{ts,tsx}': {
            branches: 90,
            functions: 90,
            lines: 90,
            statements: 90
        }
    },

    // Coverage collection patterns
    collectCoverageFrom: [
        'src/core/modules/authentication/**/*.{ts,tsx}',
        '!src/core/modules/authentication/**/*.d.ts',
        '!src/core/modules/authentication/**/index.ts',
        '!src/core/modules/authentication/**/types/**'
    ],

    // Module path mapping
    moduleNameMapping: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@authentication/(.*)$': '<rootDir>/src/core/modules/authentication/$1'
    },

    // Setup files
    setupFilesAfterEnv: [
        '<rootDir>/src/core/modules/authentication/__tests__/jest.setup.cjs'
    ],

    // Transform configuration
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
            tsconfig: '<rootDir>/tsconfig.json',
            useESM: false
        }]
    },

    // Module file extensions
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

    // Test timeout
    testTimeout: 15000, // Increased timeout for complex tests

    // Verbose output
    verbose: true,

    // Test path ignore patterns
    testPathIgnorePatterns: [
        '/node_modules/',
        '/dist/',
        '/build/',
        '/coverage/'
    ],

    // Global variables
    globals: {
        'ts-jest': {
            tsconfig: '<rootDir>/tsconfig.json'
        }
    },

    // Projects configuration for different test types
    projects: [
        {
            displayName: 'Unit Tests',
            testMatch: ['<rootDir>/src/core/modules/authentication/__tests__/unit/**/*.test.ts'],
            setupFilesAfterEnv: ['<rootDir>/src/core/modules/authentication/__tests__/jest.setup.cjs'],
            testTimeout: 10000
        },
        {
            displayName: 'Integration Tests',
            testMatch: ['<rootDir>/src/core/modules/authentication/__tests__/integration/**/*.test.ts'],
            setupFilesAfterEnv: ['<rootDir>/src/core/modules/authentication/__tests__/jest.setup.cjs'],
            testTimeout: 15000
        },
        {
            displayName: 'E2E Tests',
            testMatch: ['<rootDir>/src/core/modules/authentication/__tests__/e2e/**/*.test.ts'],
            setupFilesAfterEnv: ['<rootDir>/src/core/modules/authentication/__tests__/jest.setup.cjs'],
            testTimeout: 20000
        }
    ]
};
