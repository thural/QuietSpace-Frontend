/**
 * Jest configuration for navbar feature tests.
 * 
 * This file configures Jest for testing the navbar feature
 * with proper mocking and environment setup.
 */

module.exports = {
  // Test environment
  testEnvironment: 'jsdom',
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/src/features/navbar/__tests__/setup.ts'],
  
  // Module path mapping
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1'
  },
  
  // Coverage configuration
  collectCoverageFrom: [
    'src/features/navbar/**/*.{ts,tsx}',
    '!src/features/navbar/**/*.d.ts',
    '!src/features/navbar/**/*.test.ts',
    '!src/features/navbar/**/*.test.tsx'
  ],
  coverageDirectory: 'coverage/navbar',
  coverageReporters: ['text', 'lcov', 'html'],
  
  // Test match patterns
  testMatch: [
    '<rootDir>/src/features/navbar/**/*.test.ts',
    '<rootDir>/src/features/navbar/**/*.test.tsx'
  ],
  
  // Ignore patterns
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/coverage/'
  ],
  
  // Transform configuration
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  
  // Mock configuration
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  
  // Performance settings
  maxWorkers: '50%',
  testTimeout: 10000,
  
  // Verbose output
  verbose: true
};
