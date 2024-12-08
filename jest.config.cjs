// jest.config.cjs
module.exports = {

    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    roots: ['<rootDir>/src', '<rootDir>/test'],  // Include the test directory

    // Use ESM for module resolution
    extensionsToTreatAsEsm: ['.ts', '.tsx'],

    // Module name mapping for path aliases
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
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
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Correct path to setup file

    // Ignore specific paths
    testPathIgnorePatterns: ['/node_modules/', '/dist/', '/build/'],

    // Clear mocks between tests
    clearMocks: true,

    // Verbose output
    verbose: true
};