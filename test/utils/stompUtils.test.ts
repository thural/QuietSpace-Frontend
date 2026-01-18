import { jest } from '@jest/globals';
import SockJS from 'sockjs-client';
import * as StompJS from 'stompjs';
import {
    createStompClient,
    handleStompError,
    openStompConnection,
    sendStompMessage,
    subscribeToDestination,
    disconnectStompClient,
    setStompAutoReconnect,
    ExtendedClient
} from '@/utils/stomptUtils';

// Use shared mocks loaded from jest.setup; ensure mocked module exposes `over`

describe('STOMP Utilities', () => {
    let mockSocket: any;
    let mockClient: ExtendedClient;

    beforeEach(() => {
        // Reset mocks before each test
        jest.clearAllMocks();

        // Create mock socket and client with a default URL (call the mock factory)
        mockSocket = SockJS('http://localhost:8080/ws');
        mockClient = {
            connected: true,
            connect: jest.fn(),
            send: jest.fn(),
            subscribe: jest.fn(),
            disconnect: jest.fn()
        } as any;
        // Ensure the imported `over` mock returns our per-test mockClient
        try {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (StompJS && StompJS.over) StompJS.over._impl = () => mockClient;
        } catch (e) {
            // ignore
        }
        // Use the shared test mock's client so the mocked `over` returns this object
        // Tests set the shared client instance rather than attempting to mutate the imported module
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (globalThis.__TEST_MOCKS__) globalThis.__TEST_MOCKS__._stompClient = mockClient;

        // Also wire the mapped stompjs mock's `over` implementation to return our per-test client
        try {
            // Use the imported StompJS instead of require
            if (StompJS && typeof StompJS.over === 'function') {
                // prefer mockImplementation
                if (typeof StompJS.over.mockImplementation === 'function') {
                    StompJS.over.mockImplementation(() => mockClient);
                } else {
                    // fallback: set internal implementation used by our lightweight mocks
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    StompJS.over._impl = () => mockClient;
                }
            }
        } catch (e) {
            // ignore in environments where require isn't available
        }
    });

    describe('createStompClient', () => {
        it('should create a STOMP client with default URL', () => {
            // debug: inspect shared test mocks
            // eslint-disable-next-line no-console
            console.log('DEBUG __TEST_MOCKS__ before createStompClient:', globalThis.__TEST_MOCKS__);
            const client = createStompClient();

            expect(client).toBeDefined();
        });

        it('should create a STOMP client with custom URL', () => {
            const customUrl = 'http://test.com/ws';
            const client = createStompClient(customUrl);

            expect(client).toBeDefined();
        });
    });

    describe('handleStompError', () => {
        it('should handle string error message', () => {
            const errorMessage = 'Test error';
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

            const error = handleStompError(errorMessage);

            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe(errorMessage);
            expect(consoleSpy).toHaveBeenCalledWith(errorMessage);

            consoleSpy.mockRestore();
        });

        it('should handle Frame error with custom error handler', () => {
            const mockFrame = new (StompJS.Frame as any)('ERROR', {}, 'Frame error');
            const mockErrorHandler = jest.fn();

            const error = handleStompError(mockFrame, mockErrorHandler);

            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe(mockFrame.toString());
            expect(mockErrorHandler).toHaveBeenCalledWith(mockFrame);
        });
    });

    describe('openStompConnection', () => {
        it('should open a connection successfully', async () => {
            const mockFrame = new (StompJS.Frame as any)('CONNECTED', {}, '');
            const mockOnConnect = jest.fn();

            (mockClient.connect as jest.Mock).mockImplementation(
                (headers, connectCallback) => {
                    connectCallback(mockFrame);
                }
            );

            const result = await openStompConnection(mockClient, {
                onConnect: mockOnConnect
            });

            expect(result).toBe(mockFrame);
            expect(mockClient.connect).toHaveBeenCalled();
            expect(mockOnConnect).toHaveBeenCalledWith(mockFrame);
        });

        it('should handle connection error', async () => {
            const mockError = new (StompJS.Frame as any)('ERROR', {}, 'Connection failed');
            const mockOnError = jest.fn().mockReturnValue(mockError);

            (mockClient.connect as jest.Mock).mockImplementation(
                (headers, connectCallback, errorCallback) => {
                    errorCallback(mockError);
                }
            );

            await expect(
                openStompConnection(mockClient, { onError: mockOnError })
            ).rejects.toMatchObject({ body: 'Connection failed', command: 'ERROR', headers: {} });

            expect(mockOnError).toHaveBeenCalledWith(mockError);
        });
    });

    describe('sendStompMessage', () => {
        it('should send a message successfully', () => {
            const destination = '/test/destination';
            const body = { message: 'Hello' };
            const headers = { custom: 'header' };

            sendStompMessage(mockClient, destination, body, headers);

            expect(mockClient.send).toHaveBeenCalledWith(
                destination,
                headers,
                JSON.stringify(body)
            );
        });

        it('should throw an error if client is not connected', () => {
            mockClient.connected = false;

            expect(() =>
                sendStompMessage(mockClient, '/test', { message: 'test' })
            ).toThrow('Cannot send message, client not connected');
        });
    });

    describe('subscribeToDestination', () => {
        it('should subscribe to a destination', () => {
            const destination = '/test/topic';
            const mockCallback = jest.fn();

            subscribeToDestination(mockClient, destination, mockCallback);

            expect(mockClient.subscribe).toHaveBeenCalledWith(
                destination,
                mockCallback,
                undefined
            );
        });

        it('should use default callback if no callback provided', () => {
            const destination = '/test/topic';
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

            subscribeToDestination(mockClient, destination);

            expect(mockClient.subscribe).toHaveBeenCalledWith(
                destination,
                expect.any(Function),
                undefined
            );

            consoleSpy.mockRestore();
        });

        it('should throw error if client is not ready', () => {
            expect(() =>
                subscribeToDestination(null as any, '/test')
            ).toThrow('Cannot subscribe, client not ready');
        });
    });

    describe('disconnectStompClient', () => {
        it('should disconnect successfully', () => {
            const mockCallback = jest.fn();

            disconnectStompClient(mockClient, mockCallback);

            expect(mockClient.disconnect).toHaveBeenCalledWith(mockCallback);
        });

        it('should use default disconnect callback', () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

            disconnectStompClient(mockClient);

            expect(mockClient.disconnect).toHaveBeenCalledWith(expect.any(Function));

            consoleSpy.mockRestore();
        });

        it('should throw error if client is not connected', () => {
            mockClient.connected = false;

            expect(() =>
                disconnectStompClient(mockClient)
            ).toThrow('Client already disconnected');
        });
    });

    describe('setStompAutoReconnect', () => {
        it('should set reconnect delay', () => {
            const delay = 10000;

            setStompAutoReconnect(mockClient, delay);

            expect(mockClient.reconnect_delay).toBe(delay);
        });

        it('should use default delay', () => {
            setStompAutoReconnect(mockClient);

            expect(mockClient.reconnect_delay).toBe(5000);
        });
    });
});
