/**
 * Jest Setup for Logging Module Tests
 */

// Mock console methods to avoid noise in test output
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  trace: jest.fn()
};

// Mock performance.now for consistent timing
const mockTime = 1000;
global.performance = {
  now: jest.fn(() => mockTime),
  mark: jest.fn(),
  measure: jest.fn(),
  getEntriesByName: jest.fn(),
  getEntriesByType: jest.fn()
};

// Mock Date.now for consistent timestamps
global.Date = class MockDate extends Date {
  constructor(date?: string | number | Date) {
    if (date) {
      return new Date(date);
    }
    return new Date('2023-01-01T00:00:00.000Z');
  }
  
  static now() {
    return mockTime;
  }
};

// Mock fetch for remote appender tests
global.fetch = jest.fn();

// Mock localStorage for compliance tests
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
});

// Mock navigator for user agent tests
Object.defineProperty(window, 'navigator', {
  value: {
    userAgent: 'Mozilla/5.0 (Test Browser)'
  },
  writable: true
});

// Mock location for route tests
Object.defineProperty(window, 'location', {
  value: {
    hostname: 'localhost',
    pathname: '/test',
    href: 'http://localhost/test'
  },
  writable: true
});

// Mock process for environment detection
const originalProcess = global.process;
global.process = {
  ...originalProcess,
  env: {
    ...originalProcess?.env,
    NODE_ENV: 'test'
  }
};

// Add custom matchers for better assertions
expect.extend({
  toBeValidLogLevel(received) {
    const validLevels = ['TRACE', 'DEBUG', 'INFO', 'AUDIT', 'WARN', 'METRICS', 'ERROR', 'SECURITY', 'FATAL'];
    const pass = validLevels.includes(received);
    
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid log level`,
        pass: true
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid log level`,
        pass: false
      };
    }
  },
  
  toBeValidLogEntry(received) {
    const pass = received &&
      typeof received.id === 'string' &&
      received.timestamp instanceof Date &&
      typeof received.level === 'string' &&
      typeof received.category === 'string' &&
      typeof received.message === 'string';
    
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid log entry`,
        pass: true
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid log entry`,
        pass: false
      };
    }
  },
  
  toBeSanitized(received) {
    const pass = typeof received === 'string' && 
      (received.includes('***') || received.includes('[REDACTED]'));
    
    if (pass) {
      return {
        message: () => `expected ${received} not to be sanitized`,
        pass: true
      };
    } else {
      return {
        message: () => `expected ${received} to be sanitized`,
        pass: false
      };
    }
  },
  
  toBeWithinRange(received, min, max) {
    const pass = received >= min && received <= max;
    
    if (pass) {
      return {
        message: () => `expected ${received} not to be within range ${min}-${max}`,
        pass: true
      };
    } else {
      return {
        message: () => `expected ${received} to be within range ${min}-${max}`,
        pass: false
      };
    }
  }
});

// Global test utilities
global.createMockLogEntry = (overrides = {}) => {
  return {
    id: 'test-id',
    timestamp: new Date(),
    level: 'INFO',
    category: 'test',
    message: 'Test message',
    ...overrides
  };
};

global.createMockLogger = (category = 'test') => {
  return {
    category,
    level: 'INFO',
    isEnabled: jest.fn(() => true),
    trace: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    audit: jest.fn(),
    warn: jest.fn(),
    metrics: jest.fn(),
    error: jest.fn(),
    security: jest.fn(),
    fatal: jest.fn(),
    log: jest.fn(),
    setLevel: jest.fn(),
    addAppender: jest.fn(),
    removeAppender: jest.fn(),
    getAppenders: jest.fn(() => [])
  };
};

global.createMockAppender = (name = 'test-appender') => {
  return {
    name,
    layout: { name: 'mock', format: jest.fn(() => 'formatted'), configure: jest.fn(), getContentType: jest.fn(() => 'text/plain') },
    active: true,
    append: jest.fn(),
    start: jest.fn(() => Promise.resolve()),
    stop: jest.fn(() => Promise.resolve()),
    configure: jest.fn(),
    isReady: jest.fn(() => true)
  };
};

global.createMockLayout = (name = 'test-layout') => {
  return {
    name,
    format: jest.fn(() => 'formatted'),
    configure: jest.fn(),
    getContentType: jest.fn(() => 'text/plain')
  };
};

// Cleanup after each test
afterEach(() => {
  jest.clearAllMocks();
  
  // Reset mock time
  mockTime = 1000;
  
  // Reset localStorage
  Object.keys(localStorageMock.store).forEach(key => {
    delete localStorageMock.store[key];
  });
  
  // Reset fetch mock
  (global.fetch as jest.Mock).mockClear();
});
