// jest.config.cjs
module.exports = {

    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    roots: ['<rootDir>/src', '<rootDir>/test'],  // Include the test directory

    // Use ESM for module resolution
    extensionsToTreatAsEsm: ['.ts', '.tsx'],

    globals: {
        'ts-jest': {
            useESM: true,
        },
    },

    // Module name mapping for path aliases
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@components/(.*)$': '<rootDir>/src/components/$1',
        '^@shared/(.*)$': '<rootDir>/src/shared/$1',
        '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
        '^@utils/(.*)$': '<rootDir>/src/utils/$1',
        '^@services/(.*)$': '<rootDir>/src/services/$1',
        '^@api/(.*)$': '<rootDir>/src/api/$1',
        '^@features/(.*)$': '<rootDir>/src/features/$1',
        '^@chat/(.*)$': '<rootDir>/src/features/chat/$1',
        '^stompjs$': '<rootDir>/src/__mocks__/stompjs.ts',
        '^sockjs-client$': '<rootDir>/test/mocks/sockjs-client.js',
        // Handle CSS and other asset imports
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },

    // Transform configurations
    transform: {
        '^.+\\.tsx?$': 'ts-jest', // Ensure this is included
    },

    // Test file patterns
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',

    // File extensions to use
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

    // Coverage configuration
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov'],

    // Setup files
    setupFiles: ['<rootDir>/jest.setup.js'],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Correct path to setup file

    // Ignore specific paths
    testPathIgnorePatterns: ['/node_modules/', '/dist/', '/build/'],

    // Clear mocks between tests
    clearMocks: true,

    // Verbose output
    verbose: true
};