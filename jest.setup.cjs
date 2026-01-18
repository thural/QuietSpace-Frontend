// jest.setup.js
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

// Load shared test mocks (STOMP / SockJS) so they are available before tests import modules
try {
    const s = require('./test/setup/stompMocks.js');
    const fn = s && (typeof s === 'function' ? s : s.default);
    if (fn && typeof fn === 'function') fn();
} catch (e) {
    // If the file doesn't exist in some environments, ignore.
}