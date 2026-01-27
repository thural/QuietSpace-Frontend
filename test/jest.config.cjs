/**
 * Jest Configuration for Test Directory
 * 
 * Configuration for running tests in the test/ directory
 * with proper module path mapping and setup
 */

module.exports = {
    // Test environment
    testEnvironment: 'jsdom',

    // Setup files
    setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],

    // Module file extensions
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

    // Transform configuration
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest'
    },

    // Module name mapping for absolute imports
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/../src/$1',
        '^@core/(.*)$': '<rootDir>/../src/core/$1',
        '^@shared/(.*)$': '<rootDir>/../src/shared/$1',
        '^@features/(.*)$': '<rootDir>/../src/features/$1'
    },

    // Test match patterns
    testMatch: [
        '<rootDir>/**/__tests__/**/*.(ts|tsx|js)',
        '<rootDir>/**/*.(test|spec).(ts|tsx|js)'
    ],

    // Coverage configuration
    collectCoverage: true,
    coverageDirectory: '<rootDir>/coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    collectCoverageFrom: [
        '../src/core/**/*.(ts|tsx)',
        '../src/shared/**/*.(ts|tsx)',
        '!../src/**/*.d.ts',
        '!../src/**/*.stories.*',
        '!../src/**/index.ts'
    ],
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70
        }
    },

    // Ignore patterns
    testPathIgnorePatterns: [
        '<rootDir>/node_modules/',
        '<rootDir>/build/',
        '<rootDir>/dist/',
        '../node_modules/',
        '../build/',
        '../dist/'
    ],

    // Clear mocks between tests
    clearMocks: true,

    // Restore mocks after each test
    restoreMocks: true,

    // Verbose output
    verbose: true
};
