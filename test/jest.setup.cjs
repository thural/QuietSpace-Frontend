/**
 * Jest Setup File
 * 
 * Global setup for all tests in the test directory
 */

// Mock console methods to reduce noise in tests
global.console = {
    ...console,
    // Uncomment to ignore specific console methods
    // log: jest.fn(),
    // warn: jest.fn(),
    // error: jest.fn(),
};

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

// Mock localStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;

// Mock fetch
global.fetch = jest.fn();

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'mocked-url');
global.URL.revokeObjectURL = jest.fn();

// Mock Web Crypto API
global.crypto = {
    subtle: {
        encrypt: jest.fn(),
        decrypt: jest.fn(),
        sign: jest.fn(),
        verify: jest.fn(),
        digest: jest.fn(),
        generateKey: jest.fn(),
        deriveKey: jest.fn(),
        importKey: jest.fn(),
        exportKey: jest.fn(),
    },
    getRandomValues: jest.fn(() => new Uint32Array(1)),
};

// Mock BroadcastChannel
global.BroadcastChannel = jest.fn().mockImplementation(() => ({
    postMessage: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    close: jest.fn(),
}));

// Setup global test utilities
global.testUtils = {
    // Helper to create mock promises
    createMockPromise: (value, shouldReject = false) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (shouldReject) {
                    reject(new Error('Mock promise rejection'));
                } else {
                    resolve(value);
                }
            }, 0);
        });
    },
    
    // Helper to create mock async functions
    createMockAsync: (returnValue, shouldReject = false) => {
        return jest.fn().mockImplementation(async () => {
            if (shouldReject) {
                throw new Error('Mock async function rejection');
            }
            return returnValue;
        });
    },
    
    // Helper to wait for async operations
    waitFor: (ms = 0) => new Promise(resolve => setTimeout(resolve, ms)),
    
    // Helper to create mock event
    createMockEvent: (type, detail = {}) => ({
        type,
        detail,
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
    })
};

// Global test cleanup
afterEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Reset localStorage
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.clear.mockClear();
    
    // Reset sessionStorage
    sessionStorageMock.getItem.mockClear();
    sessionStorageMock.setItem.mockClear();
    sessionStorageMock.removeItem.mockClear();
    sessionStorageMock.clear.mockClear();
    
    // Reset fetch
    if (global.fetch.mockClear) {
        global.fetch.mockClear();
    }
});
