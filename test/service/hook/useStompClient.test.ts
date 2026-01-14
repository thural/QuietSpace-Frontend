// test file:

import React from 'react';
import { jest } from '@jest/globals';
import { renderHook, act } from '@testing-library/react';
import { Frame } from 'stompjs';
import * as zustandStore from '@/services/store/zustand';
jest.mock('@/services/store/zustand', () => ({
    useAuthStore: jest.fn(),
    useStompStore: jest.fn()
}));
import * as stomptUtils from '@/utils/stomptUtils';
import { useStompClient } from '@/services/socket/useStompClient';

interface UseAuthStoreProps {
    isAuthenticated: boolean;
    data: { accessToken: string };
}

interface StompStore {
    setClientContext: jest.Mock;
}

type MockStore<T> = jest.Mock & {
    (): T;
    <U>(selector: (state: T) => U): U;
};

describe('useStompClient Hook', () => {
    let mockStompClient: any;
    let mockAuthStore: UseAuthStoreProps;
    let mockStompStore: StompStore;
    let consoleLogSpy: jest.SpyInstance;
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
        jest.clearAllMocks();

        mockStompClient = {
            unsubscribe: jest.fn(),
            connect: jest.fn(),
            disconnect: jest.fn(),
            send: jest.fn(),
            subscribe: jest.fn(),
            connected: false, // Ensure it's false initially
        };

        mockAuthStore = {
            isAuthenticated: true,
            data: { accessToken: 'test-token' }
        };

        mockStompStore = {
            setClientContext: jest.fn()
        };

        try {
            (zustandStore.useAuthStore as jest.Mock).mockReturnValue(mockAuthStore);
            (zustandStore.useStompStore as jest.Mock).mockReturnValue(mockStompStore);
        } catch (e) {
            // Fallback: assign jest functions if the module exports aren't mock functions
            try { (zustandStore as any).useAuthStore = jest.fn(() => mockAuthStore); } catch { }
            try { (zustandStore as any).useStompStore = jest.fn(() => mockStompStore); } catch { }
        }

        jest.spyOn(stomptUtils, 'createStompClient').mockReturnValue(mockStompClient);
        jest.spyOn(stomptUtils, 'openStompConnection').mockImplementation(
            (client, options) => {
                const { onConnect, onError } = options || {};
                return new Promise<Frame>((resolve, reject) => {
                    // Allow tests to trigger onError synchronously; only call onConnect
                    // if an error has not occurred by the time the async tick runs.
                    let errored = false;
                    const originalOnError = onError;
                    const wrappedOnError = (err: Frame) => {
                        errored = true;
                        if (originalOnError) originalOnError(err);
                    };

                    const passedOptions = { ...(options || {}), onError: wrappedOnError };

                    // expose the wrapped onError for tests to invoke directly
                    (stomptUtils.openStompConnection as any).mockLastOnError = wrappedOnError;

                    setTimeout(() => {
                        if (!errored && passedOptions.onConnect) {
                            const mockFrame = new Frame('CONNECTED', {}, '');
                            client.connected = true; // Set to true only after connect
                            passedOptions.onConnect!(mockFrame);
                            resolve(mockFrame);
                        } else if (errored) {
                            // If an error was triggered manually, resolve to avoid an
                            // unhandled rejection in the test environment.
                            client.connected = false;
                            resolve(undefined as any);
                        }
                    }, 0);
                });
            }
        );

        jest.spyOn(stomptUtils, 'sendStompMessage').mockImplementation(() => { });
        jest.spyOn(stomptUtils, 'subscribeToDestination').mockImplementation(() => { });
        jest.spyOn(stomptUtils, 'disconnectStompClient').mockImplementation(() => { });
        jest.spyOn(stomptUtils, 'setStompAutoReconnect').mockImplementation(() => { });

        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => {
        consoleLogSpy.mockRestore();
        consoleErrorSpy.mockRestore();
    });

    test('initializes with default states', () => {
        const { result } = renderHook(() => useStompClient());

        expect(result.current.isClientConnected).toBe(false); // Should be false initially
        expect(result.current.isConnecting).toBe(true); // Assuming it starts connecting
        expect(result.current.isError).toBe(false); // No error initially
        expect(result.current.error).toBe(null); // No error object initially
    });

    test('creates STOMP client when authenticated', () => {
        renderHook(() => useStompClient());

        expect(stomptUtils.createStompClient).toHaveBeenCalled();
        expect(stomptUtils.openStompConnection).toHaveBeenCalled();
    });

    test('sends message when client is connected', async () => {
        const { result } = renderHook(() => useStompClient());

        await act(async () => {
            await (stomptUtils.openStompConnection as jest.Mock).mock.calls[0][1].onConnect(); // Simulate connection
        });

        act(() => {
            result.current.sendMessage('/test/destination', { message: 'test' });
        });

        expect(stomptUtils.sendStompMessage).toHaveBeenCalledWith(
            mockStompClient,
            '/test/destination',
            { message: 'test' },
            {}
        );
    });

    test('handles subscription', () => {
        const mockCallback = jest.fn();
        const { result } = renderHook(() => useStompClient());

        act(() => {
            result.current.subscribe('/test/topic', mockCallback);
        });

        expect(stomptUtils.subscribeToDestination).toHaveBeenCalledWith(
            mockStompClient,
            '/test/topic',
            mockCallback
        );
    });

    test('handles disconnection', async () => {
        const mockDisconnectCallback = jest.fn();
        const { result } = renderHook(() =>
            useStompClient({ onDisconnect: mockDisconnectCallback })
        );

        await act(async () => {
            await (stomptUtils.openStompConnection as jest.Mock).mock.calls[0][1].onConnect();
        });

        act(() => {
            result.current.disconnect();
        });

        await act(async () => {
            await (stomptUtils.disconnectStompClient as jest.Mock).mock.calls[0][1]();
        });

        expect(stomptUtils.disconnectStompClient).toHaveBeenCalledWith(
            mockStompClient,
            expect.any(Function)
        );

        mockStompClient.connected = false;

        expect(mockDisconnectCallback).toHaveBeenCalled();
    });

    test('handles error scenarios', async () => {
        const mockErrorCallback = jest.fn();
        const { result } = renderHook(() =>
            useStompClient({
                onError: (error: Frame | string) => mockErrorCallback(error)
            })
        );

        await act(async () => {
            // invoke the wrapped onError that was exposed by the mock
            await (stomptUtils.openStompConnection as any).mockLastOnError(new Frame('ERROR', {}, 'Test Error'));
        });

        expect(result.current.isError).toBe(true);
        expect(result.current.error).not.toBeNull();
        expect(mockErrorCallback).toHaveBeenCalled();
    });

    test('sets auto reconnect', () => {
        const { result } = renderHook(() => useStompClient());

        act(() => {
            result.current.setAutoReconnect(10000);
        });

        expect(stomptUtils.setStompAutoReconnect).toHaveBeenCalledWith(mockStompClient, 10000);
    });

    test('prevents sending message when not connected', async () => {
        const { result } = renderHook(() => useStompClient());

        // Ensure the client is not connected
        mockStompClient.connected = false;

        act(() => {
            result.current.sendMessage('/test/destination', { message: 'test' });
        });

        expect(stomptUtils.sendStompMessage).not.toHaveBeenCalled(); // Should not have been called
        expect(result.current.isError).toBe(true); // Error state should be true
    });
});