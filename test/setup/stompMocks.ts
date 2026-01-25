// Shared STOMP and SockJS mock registration for tests
declare global {
    var __TEST_MOCKS__: {
        _stompClient?: any;
        createStompClient?: any;
    } | undefined;
}

function registerStompMocks(): void {
    // Minimal factory for default mock client shape
    const mockClientFactory = () => ({
        connected: true,
        connect: typeof jest !== 'undefined' ? jest.fn() : () => { },
        disconnect: typeof jest !== 'undefined' ? jest.fn() : () => { },
        send: typeof jest !== 'undefined' ? jest.fn() : () => { },
        subscribe: typeof jest !== 'undefined' ? jest.fn() : () => { },
        unsubscribe: typeof jest !== 'undefined' ? jest.fn() : () => { },
        reconnect_delay: undefined,
    });

    // Create a shared stomp client instance that tests can mutate
    globalThis.__TEST_MOCKS__ = globalThis.__TEST_MOCKS__ || {};
    globalThis.__TEST_MOCKS__!._stompClient = mockClientFactory();

    // Wire the mapped stompjs mock's `over` implementation (if available)
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const stompMock = require('stompjs');
        if (stompMock && stompMock.over && typeof stompMock.over.mockImplementation === 'function') {
            stompMock.over.mockImplementation(() => globalThis.__TEST_MOCKS__!._stompClient);
        }
    } catch (e) {
        // ignore; some environments may not allow require here
    }

    // Register a simple sockjs-client mock via Jest if available
    if (typeof jest !== 'undefined' && typeof jest.mock === 'function') {
        jest.mock('sockjs-client', () => jest.fn().mockImplementation((url: string) => ({
            url,
            readyState: 1,
            close: jest.fn(),
            send: jest.fn(),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn(),
        })));
    }

    // Expose factory to tests via global, in case tests need to access default client shape
    globalThis.__TEST_MOCKS__!.createStompClient = mockClientFactory;
}

export default registerStompMocks;
