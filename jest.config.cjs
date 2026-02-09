// jest.config.cjs
module.exports = {

    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'jsdom',
    roots: ['<rootDir>/src', '<rootDir>/test'],  // Include the test directory

    // Use ESM for module resolution
    extensionsToTreatAsEsm: ['.ts', '.tsx'],

    // Transform configurations - modern ts-jest syntax
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            useESM: true,
            tsconfig: 'tsconfig.test.json', // Use test-specific TypeScript config
        }],
    },

    // Module name mapping for path aliases
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@services/(.*)$': '<rootDir>/src/features/$1',
        '^@/services/(.*)$': '<rootDir>/src/features/$1',
        '^@core/(.*)$': '<rootDir>/src/core/$1',
        '^@features/(.*)$': '<rootDir>/src/features/$1',
        '^@chat/(.*)$': '<rootDir>/src/features/chat/$1',
        '^@notification/(.*)$': '<rootDir>/src/features/notification/$1',
        '^@auth/(.*)$': '<rootDir>/src/features/auth/$1',
        '^@feed/(.*)$': '<rootDir>/src/features/feed/$1',
        '^@profile/(.*)$': '<rootDir>/src/features/profile/$1',
        '^@search/(.*)$': '<rootDir>/src/features/search/$1',
        '^@settings/(.*)$': '<rootDir>/src/features/settings/$1',
        '^@navbar/(.*)$': '<rootDir>/src/features/navbar/$1',
        '^@components/(.*)$': '<rootDir>/src/shared/$1',
        '^@shared/(.*)$': '<rootDir>/src/shared/$1',
        '^@hooks/(.*)$': '<rootDir>/src/shared/$1',
        '^@utils/(.*)$': '<rootDir>/src/shared/$1',
        '^@api/(.*)$': '<rootDir>/src/core/$1',
        '^stompjs$': '<rootDir>/src/__mocks__/stompjs.ts',
        '^sockjs-client$': '<rootDir>/test/mocks/sockjs-client.js',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/test/__mocks__/fileMock.js',
        // Mock AuthConfigLoader to avoid import.meta issues
        '^.*/config/AuthConfigLoader$': '<rootDir>/src/core/modules/authentication/__mocks__/AuthConfigLoader.ts',
        '^.*/config/EnvironmentAuthConfig$': '<rootDir>/src/core/modules/authentication/__mocks__/EnvironmentAuthConfig.ts',
        // Mock AuthModuleFactory specifically
        '^.*/AuthModule$': '<rootDir>/src/core/modules/authentication/__mocks__/AuthConfigLoader.ts',
    },

    // Test file patterns
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',

    // File extensions to use
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

    // Coverage configuration
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov'],
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.d.ts',
        '!src/**/__tests__/**',
        '!src/**/*.test.{ts,tsx}',
        '!src/**/*.spec.{ts,tsx}',
    ],

    // Setup files
    setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],

    // Global setup for Jest globals
    globals: {
        'ts-jest': {
            useESM: true,
            tsconfig: 'tsconfig.test.json',
        },
    },

    // Ignore specific paths
    testPathIgnorePatterns: ['/node_modules/', '/dist/', '/build/'],

    // Clear mocks between tests
    clearMocks: true,

    // Verbose output
    verbose: true,

    // Add global test environment setup
    testEnvironmentOptions: {
        url: 'http://localhost:3000',
    },

    // For ESM support
    extensionsToTreatAsEsm: ['.ts', '.tsx'],

    // Transform ignore patterns for ESM
    transformIgnorePatterns: [
        'node_modules/(?!(.*\\.mjs$))',
    ],
};