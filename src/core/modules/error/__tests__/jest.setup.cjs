/**
 * Jest Setup for Error Module Tests
 */

// Mock console methods to avoid noise in test output
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

// Mock Date.now for consistent timestamps
const mockDate = new Date('2023-01-01T00:00:00.000Z');
global.Date.now = jest.fn(() => mockDate.getTime());

// Mock Date constructor
global.Date = class MockDate {
  constructor(date?: string | number | Date) {
    if (date) {
      return new Date(date);
    }
    return mockDate;
  }

  static now() {
      return mockDate.getTime();
  }
};

// Add custom matchers for error testing
expect.extend({
  toBeErrorWithCode: (code) => {
    return (received) => {
      if (!received || typeof received !== 'object') {
        return false;
      }
      return received.code === code;
    };
  },
  
  toBeErrorWithCategory: (category) => {
    return (received) => {
      if (!received || typeof received !== 'object') {
        return false;
      }
      return received.category === category;
    };
  },
  
  toBeErrorWithSeverity: (severity) => {
    return (received) => {
      if (!received || typeof received !== 'object') {
        return false;
      }
      return received.severity === severity;
    };
  }
});

// Setup global test utilities
global.createMockError = (message: string, code: string = 'MOCK_ERROR') => {
  const error = new Error(message);
  (error as any).code = code;
  return error;
};

global.createMockIError = (overrides: any = {}) => {
  const defaultError = {
    id: 'mock-error-id',
    message: 'Mock error',
    code: 'MOCK_ERROR',
    category: 'unknown',
    severity: 'medium',
    recoverable: true,
    recoveryStrategy: 'manual',
    userMessage: 'Mock error message',
    suggestedActions: ['Try again'],
    timestamp: new Date(),
    metadata: {},
    toJSON: () => ({ ...defaultError }),
    copy: () => ({ ...defaultError })
  };
  
  return { ...defaultError, ...overrides };
};
