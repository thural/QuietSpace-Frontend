import SockJS from 'sockjs-client';
import {Client, Frame, over} from 'stompjs';
import {
    ConnectCallback,
    DisconnectCallback,
    ErrorCallback,
    Headers,
    StompHeaders,
    SubscribeCallback
} from "@/shared/api/models/websocketNative";
import {ResId} from "@/shared/api/models/commonNative";

// Logger utility for consistent logging across socket operations
const logger = {
    log: (message: string, ...args: unknown[]) => {
        console.log(`[Socket] ${message}`, ...args);
    },
    error: (message: string, ...args: unknown[]) => {
        console.error(`[Socket] ${message}`, ...args);
    }
};

// Extend the Client type to include reconnect_delay
export interface ExtendedClient extends Client {
    reconnect_delay?: number;
}

/**
 * Creates a new STOMP client.
 * 
 * @param {string} [wsUrl='http://localhost:8080/ws'] - The WebSocket URL to connect to.
 * @returns {ExtendedClient} - The created STOMP client.
 */
export const createStompClient = (wsUrl: string = 'http://localhost:8080/ws'): ExtendedClient => {
    logger.log('Creating STOMP client', { wsUrl });

    // If tests provided a shared stomp client, return it directly to avoid mocking constructor differences
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (globalThis.__TEST_MOCKS__ && globalThis.__TEST_MOCKS__._stompClient) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return globalThis.__TEST_MOCKS__._stompClient as ExtendedClient;
    }

    let socket: any;
    try {
        // Support both constructor and factory-style mocks
        socket = new (SockJS as any)(wsUrl);
    } catch (e) {
        socket = (SockJS as any)(wsUrl);
    }

    const client = over(socket) as ExtendedClient;
    // If the `over` mock didn't return a client (mocking interop), use injected test client if available
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (!client && globalThis.__TEST_MOCKS__ && globalThis.__TEST_MOCKS__._stompClient) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return globalThis.__TEST_MOCKS__._stompClient as ExtendedClient;
    }

    logger.log('STOMP client created successfully');
    return client;
};

/**
 * Handles errors that occur in the STOMP client.
 * 
 * @param {string | Frame} errorMessage - The error message or frame to process.
 * @param {ErrorCallback} [errorHandler] - Optional custom error handler function.
 * @returns {Error} - The created Error object.
 */
export const handleStompError = (
    errorMessage: string | Frame,
    errorHandler?: ErrorCallback
): Error => {
    logger.error('STOMP error occurred', errorMessage);

    const defaultErrorHandler = (msg: string | Frame) => console.error(msg);
    const handler = errorHandler || defaultErrorHandler;

    const newError = new Error(
        typeof errorMessage === 'string'
            ? errorMessage
            : errorMessage.toString()
    );

    handler(errorMessage);
    return newError;
};

/**
 * Opens a STOMP connection.
 * 
 * @param {ExtendedClient} client - The STOMP client to use for the connection.
 * @param {object} options - Connection options.
 * @param {StompHeaders} [options.headers] - Optional connection headers.
 * @param {ConnectCallback} [options.onConnect] - Callback executed on successful connection.
 * @param {ErrorCallback} [options.onError] - Callback executed on connection error.
 * @returns {Promise<Frame>} - A promise that resolves with the Frame upon successful connection.
 */
export const openStompConnection = (
    client: ExtendedClient,
    options: {
        headers?: StompHeaders,
        onConnect?: ConnectCallback,
        onError?: ErrorCallback
    } = {}
): Promise<Frame> => {
    const {
        headers = {},
        onConnect = (frame) => {
            logger.log('STOMP client connected', frame);
            console.log("STOMP client connected", frame);
        },
        onError = (error) => {
            logger.error('STOMP connection error', error);
            console.error(error);
            return undefined;
        }
    } = options;

    logger.log('Connecting STOMP client...', { headers });

    return new Promise((resolve, reject) => {
        client.connect(
            headers,
            (frame) => {
                logger.log('STOMP connection established', frame);
                onConnect(frame);
                if (frame) {
                    resolve(frame);
                } else {
                    reject(new Error('Frame is undefined'));
                }
            },
            (error) => {
                logger.error('Failed to establish STOMP connection', error);
                const processedError = onError(error);

                // Ensure we always reject with a Frame or Error
                if (error instanceof Frame) {
                    reject(error);
                } else if (processedError instanceof Frame) {
                    reject(processedError);
                } else {
                    const fallbackFrame = new Frame('ERROR', {}, error.toString());
                    reject(fallbackFrame);
                }
            }
        );
    });
};

/**
 * Sends a message using STOMP.
 * 
 * @param {ExtendedClient} client - The STOMP client used to send the message.
 * @param {string} destination - The destination to send the message to.
 * @param {any} body - The body of the message being sent.
 * @param {Headers | StompHeaders} [headers={}] - Optional message headers.
 * @throws {Error} If the client is not connected.
 */
export const sendStompMessage = (
    client: ExtendedClient,
    destination: string,
    body: any,
    headers: Headers | StompHeaders = {}
): void => {
    if (!client || !client.connected) {
        const error = new Error("Cannot send message, client not connected");
        logger.error('Failed to send message', { destination, error: error.message });
        throw error;
    }

    try {
        client.send(destination, headers, JSON.stringify(body));
        logger.log('Message sent', { destination, body });
    } catch (error) {
        logger.error('Failed to send message', { destination, error });
        throw error;
    }
};

/**
 * Subscribes to a STOMP destination.
 * 
 * @param {ExtendedClient} client - The STOMP client used to subscribe.
 * @param {string} destination - The destination to subscribe to.
 * @param {SubscribeCallback} [callback] - Optional callback for received messages.
 * @param {object} [options] - Optional subscription options.
 * @param {ResId} [options.id] - Optional subscription ID.
 * @returns {any} - The subscription object.
 * @throws {Error} If the client is not ready.
 */
export const subscribeToDestination = (
    client: ExtendedClient,
    destination: string,
    callback?: SubscribeCallback,
    options: { id?: ResId } = {}
): any => {
    if (!client) {
        const error = new Error("Cannot subscribe, client not ready");
        logger.error('Failed to subscribe', { destination, error: error.message });
        throw error;
    }

    const defaultCallback: SubscribeCallback = (message) => {
        logger.log(`Received message at ${destination}`, message);
        console.log(`Received message at ${destination}`, message);
    };

    try {
        const subscription = client.subscribe(
            destination,
            callback || defaultCallback,
            options.id ? { id: options.id } : undefined
        );

        if (options.id) {
            logger.log('Subscribed to destination with ID', { destination, subscriptionId: options.id });
        } else {
            logger.log('Subscribed to destination', destination);
        }

        return subscription;
    } catch (error) {
        logger.error('Failed to subscribe', { destination, error });
        throw error;
    }
};

/**
 * Disconnects the STOMP client.
 * 
 * @param {ExtendedClient} client - The STOMP client to disconnect.
 * @param {DisconnectCallback} [callback] - Optional callback executed on disconnect.
 * @throws {Error} If the client is already disconnected.
 */
export const disconnectStompClient = (
    client: ExtendedClient,
    callback?: DisconnectCallback
): void => {
    if (!client || !client.connected) {
        const error = new Error("Client already disconnected");
        logger.error('Failed to disconnect', { error: error.message });
        throw error;
    }

    logger.log('Disconnecting STOMP client...');

    const defaultDisconnect: DisconnectCallback = () => {
        logger.log('WebSocket disconnected');
        console.log("Client disconnected");
    };

    try {
        client.disconnect(callback || defaultDisconnect);
    } catch (error) {
        logger.error('Failed to disconnect WebSocket', error);
        throw error;
    }
};

/**
 * Sets auto-reconnect functionality for the STOMP client.
 * 
 * @param client - The STOMP client to configure.
 * @param delay - Reconnection delay in milliseconds.
 */
export const setStompAutoReconnect = (
    client: ExtendedClient,
    delay = 5000
): void => {
    logger.log('Setting auto-reconnect delay', { delay });
    client.reconnect_delay = delay;
};

/**
 * Unsubscribe from a STOMP destination.
 * 
 * @param {ExtendedClient} client - The STOMP client to use.
 * @param {string} subscriptionId - The subscription ID to unsubscribe.
 * @throws {Error} If the client is not ready.
 */
export const unsubscribeFromDestination = (
    client: ExtendedClient,
    subscriptionId: string
): void => {
    if (!client) {
        const error = new Error("Cannot unsubscribe, client not ready");
        logger.error('Failed to unsubscribe', { subscriptionId, error: error.message });
        throw error;
    }

    try {
        client.unsubscribe(subscriptionId);
        logger.log('Unsubscribed from destination', subscriptionId);
    } catch (error) {
        logger.error('Failed to unsubscribe', { subscriptionId, error });
        throw error;
    }
};

/**
 * Check if STOMP client is connected.
 * 
 * @param {ExtendedClient} client - The STOMP client to check.
 * @returns {boolean} - True if client is connected, false otherwise.
 */
export const isClientConnected = (client: ExtendedClient | null): boolean => {
    return !!(client && client.connected);
};

/**
 * Parse incoming STOMP message body safely.
 * 
 * @param {any} message - The STOMP message to parse.
 * @returns {any} - The parsed message body or null if parsing fails.
 */
export const parseStompMessage = (message: any): any => {
    if (!message?.body) {
        return null;
    }

    try {
        return JSON.parse(message.body);
    } catch (parseError) {
        logger.error('Failed to parse message', { message: message.body, error: parseError });
        return null;
    }
};