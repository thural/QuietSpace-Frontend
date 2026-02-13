/**
 * Jest Configuration for Logging Module Tests
 */

module.exports = {
  // Test environment
  testEnvironment: 'jsdom',
  
  // Test setup
  setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
  
  // Test file patterns
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/__tests__/**/*.test.tsx'
  ],
  
  // Module name mapping
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@core/(.*)$': '<rootDir>/src/core/$1',
    '^@features/(.*)$': '<rootDir>/src/features/$1'
  },
  
  // Transform configuration
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  
  // Module file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  
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
    }
  },
  
  // Coverage patterns
  collectCoverageFrom: [
    'src/core/modules/logging/**/*.{ts,tsx}',
    '!src/core/modules/logging/**/*.d.ts',
    '!src/core/modules/logging/**/index.ts',
    '!src/core/modules/logging/**/__tests__/**',
    '!src/core/modules/logging/**/examples/**'
  ],
  
  // Ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/build/',
    '/coverage/'
  ],
  
  // Verbose output
  verbose: true,
  
  // Test timeout
  testTimeout: 10000,
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Restore mocks after each test
  restoreMocks: true,
  
  // Error handling
  errorOnDeprecated: true,
  
  // Global variables
  globals: {
    'ts-jest': {
      tsconfig: {
        tsConfig: '<rootDir>/tsconfig.json'
      }
    }
  }
};
