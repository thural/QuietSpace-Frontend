import React from 'react';
import { render, act, renderHook } from '@testing-library/react';
import { Client, Frame, over } from 'stompjs';
import SockJS from 'sockjs-client';
import { useSocket } from '@/services/socket/useSocket';

jest.mock('sockjs-client', () => {
    const mockSocket = {
        binaryType: 'blob',
        bufferedAmount: 0,
        extensions: '',
        onclose: null,
        onerror: null,
        onmessage: null,
        onopen: null,
        protocol: '',
        readyState: 1, // OPEN
        url: 'http://localhost',

        close: jest.fn(),
        send: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    };

    return jest.fn(() => mockSocket);
});

jest.mock('stompjs', () => ({
    over: jest.fn(),
    Frame: jest.fn().mockImplementation((command, headers, body) => ({
        command, headers, body, toString: () => body,
    })),
}));

// Mock the logger to prevent console output during tests
jest.mock('@/services/socket/useSocket', () => {
    const originalModule = jest.requireActual('@/services/socket/useSocket');
    return {
        ...originalModule,
        logger: {
            log: jest.fn().mockImplementation(() => { }),
            error: jest.fn().mockImplementation(() => { }),
        },
    };
});

describe('useSocket Hook', () => {
    let mockClient: Partial<Client>;

    beforeEach(() => {
        jest.clearAllMocks();

        mockClient = {
            connect: jest.fn(),
            disconnect: jest.fn(),
            send: jest.fn(),
            subscribe: jest.fn(),
            unsubscribe: jest.fn(),
        };

        // Ensure the mock implementation of SockJS matches the WebSocket interface
        (SockJS as jest.MockedFunction<typeof SockJS>).mockReturnValue({
            ...mockClient,
            close: jest.fn(),
            send: jest.fn(),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn(),
        } as unknown as WebSocket);

        (over as jest.Mock).mockReturnValue(mockClient as Client);
    });

    const TestWrapper: React.FC = () => {
        useSocket();
        return null; // No children needed in this test wrapper
    };

    test('useSocket hook returns correct methods', () => {
        const { result } = renderHook(() => useSocket());
        expect(result.current).toEqual(
            expect.objectContaining({
                createClient: expect.any(Function),
                openConnection: expect.any(Function),
                disconnect: expect.any(Function),
                sendMessage: expect.any(Function),
                subscribe: expect.any(Function),
                subscribeWithId: expect.any(Function),
                unsubscribe: expect.any(Function),
            })
        );
    });

    test('createClient initializes a WebSocket client', () => {
        const { result } = renderHook(() => useSocket());
        const client = result.current.createClient();
        expect(client).toBe(mockClient);
    });

    test('openConnection connects a client successfully', async () => {
        const { result } = renderHook(() => useSocket());
        const client = result.current.createClient();
        const onConnectCallback = jest.fn();
        const headers = { login: 'user', passcode: 'pass' };

        act(() => {
            result.current.openConnection(client, headers, onConnectCallback);
        });

        expect(client.connect).toHaveBeenCalledWith(
            headers,
            expect.any(Function),
            expect.any(Function)
        );

        // Simulate successful connection
        (client.connect as jest.Mock).mock.calls[0][1](new Frame('CONNECTED', {}, ''));

        expect(onConnectCallback).toHaveBeenCalled();
    });

    test('disconnect client successfully', async () => {
        const { result } = renderHook(() => useSocket());
        const client = result.current.createClient();
        const onDisconnectCallback = jest.fn();

        act(() => {
            result.current.disconnect(client, onDisconnectCallback);
        });

        expect(client.disconnect).toHaveBeenCalledWith(expect.any(Function));

        // Simulate successful disconnection
        (client.disconnect as jest.Mock).mock.calls[0][0]();

        expect(onDisconnectCallback).toHaveBeenCalled();
    });

    test('sendMessage sends a message successfully', () => {
        const { result } = renderHook(() => useSocket());
        const client = result.current.createClient();
        const destination = '/test/destination';
        const body = { message: 'test' };
        const headers = {};

        act(() => {
            result.current.sendMessage(client, destination, body, headers);
        });

        expect(client.send).toHaveBeenCalledWith(
            destination,
            headers,
            JSON.stringify(body)
        );
    });

    test('subscribe subscribes to a destination', () => {
        const { result } = renderHook(() => useSocket());
        const client = result.current.createClient();
        const destination = '/test/topic';
        const callback = jest.fn();

        act(() => {
            result.current.subscribe(client, destination, callback);
        });

        expect(client.subscribe).toHaveBeenCalledWith(
            destination,
            expect.any(Function)
        );

        // Simulate message reception
        const message = { body: JSON.stringify({ content: 'test' }) };
        (client.subscribe as jest.Mock).mock.calls[0][1](message as Frame);

        expect(callback).toHaveBeenCalledWith({ content: 'test' });
    });

    test('subscribeWithId subscribes to a destination with ID', () => {
        const { result } = renderHook(() => useSocket());
        const client = result.current.createClient();
        const destination = '/test/topic';
        const callback = jest.fn();
        const subscriptionId = '123';

        act(() => {
            result.current.subscribeWithId(client, destination, callback, subscriptionId);
        });

        expect(client.subscribe).toHaveBeenCalledWith(
            destination,
            expect.any(Function),
            { id: subscriptionId }
        );

        // Simulate message reception
        const message = { body: JSON.stringify({ content: 'test' }) };
        (client.subscribe as jest.Mock).mock.calls[0][1](message as Frame);

        expect(callback).toHaveBeenCalledWith({ content: 'test' });
    });

    test('unsubscribe unsubscribes from a destination', () => {
        const { result } = renderHook(() => useSocket());
        const client = result.current.createClient();
        const subscriptionId = '123';

        act(() => {
            result.current.unsubscribe(client, subscriptionId);
        });

        expect(client.unsubscribe).toHaveBeenCalledWith(subscriptionId);
    });
});
