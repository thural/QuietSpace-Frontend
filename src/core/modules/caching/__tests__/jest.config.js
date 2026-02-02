/**
 * Jest Configuration for Cache Module Tests
 * 
 * Extends the main Jest configuration with cache-specific settings.
 */

module.exports = {
    // Extend main Jest config
    ...require('../../../../jest.config.cjs'),
    
    // Test environment specific to cache module
    testEnvironment: 'node',
    
    // Test file patterns
    testMatch: [
        '**/__tests__/**/*.test.ts',
        '**/__tests__/**/*.test.tsx'
    ],
    
    // Module name mapping for cache module
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@core/(.*)$': '<rootDir>/src/core/$1',
        '^@caching/(.*)$': '<rootDir>/src/core/modules/caching/$1'
    },
    
    // Setup files
    setupFilesAfterEnv: [
        '<rootDir>/src/core/modules/caching/__tests__/setup.ts'
    ],
    
    // Coverage configuration
    collectCoverageFrom: [
        'src/core/modules/caching/**/*.ts',
        '!src/core/modules/caching/**/*.d.ts',
        '!src/core/modules/caching/**/__tests__/**',
        '!src/core/modules/caching/**/index.ts'
    ],
    
    // Coverage thresholds
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        },
        'src/core/modules/caching/': {
            branches: 85,
            functions: 85,
            lines: 85,
            statements: 85
        }
    },
    
    // Transform configuration
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            useESM: true,
            tsconfig: '<rootDir>/src/core/modules/caching/tsconfig.test.json'
        }]
    }
};
