// jest.setup.ts
if (typeof jest !== 'undefined') {
    jest.setTimeout(10000); // Increase default timeout

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
} else {
    // Provide safe no-op fallbacks when `jest` global is not defined
    const noop = () => { };
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        configurable: true,
        value: (query) => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: noop,
            removeListener: noop,
            addEventListener: noop,
            removeEventListener: noop,
            dispatchEvent: noop,
        }),
    });
}

// Ensure `jest` global exists in ESM environments by importing from '@jest/globals' if available.
if (typeof jest === 'undefined') {
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { jest: jestGlobal } = require('@jest/globals');
        if (jestGlobal) globalThis.jest = jestGlobal;
    } catch (e) {
        // ignore
    }
}

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
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { TextEncoder, TextDecoder } = require('util');
        globalThis.TextEncoder = TextEncoder;
        globalThis.TextDecoder = TextDecoder;
    } catch (e) {
        // ignore
    }
}

// Load shared test mocks (STOMP / SockJS) so they are available before tests import modules
try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const s = require('./test/setup/stompMocks.js');
    const fn = s && (typeof s === 'function' ? s : s.default);
    if (fn && typeof fn === 'function') fn();
} catch (e) {
    // If the file doesn't exist in some environments, ignore.
}