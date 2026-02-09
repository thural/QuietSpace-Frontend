// jest.setup.cjs
// Jest globals are already available in setup files
require('@testing-library/jest-dom');

// Mock fetch for Node.js test environment
try {
    const { fetch, Headers, Request, Response } = require('node-fetch');
    global.fetch = fetch;
    global.Headers = Headers;
    global.Request = Request;
    global.Response = Response;
} catch (e) {
    // Fallback to basic mock if node-fetch is not available
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve({}),
            text: () => Promise.resolve(''),
            headers: new Map(),
        })
    );
}

// Mock alert function
global.alert = jest.fn();

// Set default timeout
jest.setTimeout(10000);

// Mock browser APIs if needed
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

// Polyfill MessageChannel for libraries that expect it in browser
if (typeof globalThis.MessageChannel === 'undefined') {
    globalThis.MessageChannel = class {
        constructor() {
            this.port1 = {};
            this.port2 = {};
        }
    };
}

// Polyfill TextEncoder/TextDecoder in Node test environment if missing
if (typeof globalThis.TextEncoder === 'undefined') {
    try {
        const { TextEncoder, TextDecoder } = require('util');
        globalThis.TextEncoder = TextEncoder;
        globalThis.TextDecoder = TextDecoder;
    } catch (e) {
        // ignore
    }
}

// Mock localStorage for tests that need it
global.localStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
};

// Mock sessionStorage for tests that need it
global.sessionStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
};

// Mock BroadcastChannel for cross-tab communication tests
global.BroadcastChannel = jest.fn().mockImplementation(() => ({
    postMessage: jest.fn(),
    close: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
}));

// Mock Web Crypto API for authentication tests
Object.defineProperty(global, 'crypto', {
    value: {
        subtle: {
            digest: jest.fn().mockImplementation((algorithm, data) => {
                return Promise.resolve(new Uint8Array(32).fill(0));
            }),
            generateKey: jest.fn().mockResolvedValue({}),
            sign: jest.fn().mockResolvedValue(new Uint8Array(64)),
            verify: jest.fn().mockResolvedValue(true),
            encrypt: jest.fn().mockResolvedValue(new Uint8Array(128)),
            decrypt: jest.fn().mockResolvedValue(new Uint8Array(128)),
        },
        getRandomValues: jest.fn().mockImplementation((arr) => {
            for (let i = 0; i < arr.length; i++) {
                arr[i] = Math.floor(Math.random() * 256);
            }
            return arr;
        }),
        randomUUID: jest.fn().mockReturnValue('test-uuid-1234-5678-9abcdef'),
    },
});

// Mock import.meta for Vite environment variables in Jest
Object.defineProperty(global, 'import', {
    value: {
        meta: {
            env: {
                MODE: 'test',
                DEV: false,
                PROD: false,
                SSR: false,
                BASE_URL: '/',
                PROTOCOL: 'http:',
                HOST: 'localhost',
                PORT: '3000',
            },
        },
    },
    writable: true,
});

// Load shared test mocks (STOMP / SockJS) so they are available before tests import modules
try {
    const s = require('./test/setup/stompMocks.js');
    const fn = s && (typeof s === 'function' ? s : s.default);
    if (fn && typeof fn === 'function') fn();
} catch (e) {
    // If the file doesn't exist in some environments, ignore.
}