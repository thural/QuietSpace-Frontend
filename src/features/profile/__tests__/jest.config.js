/**
 * Jest Configuration for Profile Tests.
 * 
 * Configuration for running profile feature tests with proper
 * setup and mocking for consistent test environment.
 */

module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  testMatchIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/.git/',
    '<rootDir>/coverage/',
    '<rootDir>/.nyc_output',
    '<rootDir>/.vscode/',
    '<rootDir>/.idea'
  ],
  moduleNameMapping: {
    '^@/(react|react-dom|next|next)/(.*)$': '<rootDir>/node_modules/$1'
  },
  transform: {
    '^.+\\.(css|less|scss|sass|less)$': 'babel-jest'
  },
  collectCoverageFrom: 'all',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageDirectory: '<rootDir>/coverage',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    },
    './src/features/profile/**/*.{js,jsx,ts,tsx}': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
