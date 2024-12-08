import SockJS from 'sockjs-client';
import { over, Frame } from 'stompjs';
import {
    createStompClient,
    handleStompError,
    openStompConnection,
    sendStompMessage,
    subscribeToDestination,
    disconnectStompClient,
    setStompAutoReconnect,
    ExtendedClient
} from '@/utils/stomptUtils'; // Adjust the import path as needed

// Mock dependencies
jest.mock('sockjs-client', () => {
    return jest.fn().mockImplementation((url) => ({
        close: jest.fn(),
        url,
    }));
});
jest.mock('stompjs', () => {
    return {
        over: jest.fn(),
        Frame: jest.fn().mockImplementation((command, headers, body) => ({
            command, headers, body, toString: () => body
        })),
    };
});

describe('STOMP Utilities', () => {
    let mockSocket: any;
    let mockClient: ExtendedClient;

    beforeEach(() => {
        // Reset mocks before each test
        jest.clearAllMocks();

        // Create mock socket and client with a default URL
        mockSocket = new SockJS('http://localhost:8080/ws');
        mockClient = {
            connected: true,
            connect: jest.fn(),
            send: jest.fn(),
            subscribe: jest.fn(),
            disconnect: jest.fn()
        } as any;
        (over as jest.MockedFunction<typeof over>).mockReturnValue(mockClient);
    });

    describe('createStompClient', () => {
        it('should create a STOMP client with default URL', () => {
            const client = createStompClient();

            expect(SockJS).toHaveBeenCalledWith('http://localhost:8080/ws');
            expect(over).toHaveBeenCalledWith(expect.objectContaining({ url: 'http://localhost:8080/ws' }));
            expect(client).toBe(mockClient);
        });

        it('should create a STOMP client with custom URL', () => {
            const customUrl = 'http://test.com/ws';
            const client = createStompClient(customUrl);

            expect(SockJS).toHaveBeenCalledWith(customUrl);
            expect(over).toHaveBeenCalledWith(expect.objectContaining({ url: customUrl }));
            expect(client).toBe(mockClient);
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
            const mockFrame = new Frame('ERROR', {}, 'Frame error');
            const mockErrorHandler = jest.fn();

            const error = handleStompError(mockFrame, mockErrorHandler);

            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe(mockFrame.toString());
            expect(mockErrorHandler).toHaveBeenCalledWith(mockFrame);
        });
    });

    describe('openStompConnection', () => {
        it('should open a connection successfully', async () => {
            const mockFrame = new Frame('CONNECTED', {}, '');
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
            const mockError = new Frame('ERROR', {}, 'Connection failed');
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
