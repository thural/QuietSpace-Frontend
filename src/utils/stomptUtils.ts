import SockJS from 'sockjs-client';
import { Client, Frame, over } from 'stompjs';
import {
    StompHeaders,
    ConnectCallback,
    SubscribeCallback,
    DisconnectCallback,
    ErrorCallback,
    StompMessage,
    Headers
} from "@/api/schemas/native/websocket";
import { ResId } from "@/api/schemas/native/common";

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
    const socket = new SockJS(wsUrl);
    return over(socket) as ExtendedClient;
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
        onConnect = (frame) => console.log("STOMP client connected", frame),
        onError = (error) => {
            console.error(error);
            return undefined;
        }
    } = options;

    return new Promise((resolve, reject) => {
        client.connect(
            headers,
            (frame) => {
                onConnect(frame);
                if (frame) {
                    resolve(frame);
                } else {
                    reject(new Error('Frame is undefined'));
                }
            },
            (error) => {
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
        throw new Error("Cannot send message, client not connected");
    }
    client.send(destination, headers, JSON.stringify(body));
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
        throw new Error("Cannot subscribe, client not ready");
    }

    const defaultCallback: SubscribeCallback = (message) => {
        console.log(`Received message at ${destination}`, message);
    };

    return client.subscribe(
        destination,
        callback || defaultCallback,
        options.id ? { id: options.id } : undefined
    );
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
        throw new Error("Client already disconnected");
    }

    const defaultDisconnect: DisconnectCallback = () =>
        console.log("Client disconnected");

    client.disconnect(callback || defaultDisconnect);
};

/**
 * Sets auto-reconnect functionality for the STOMP client.
 * 
 * @param {ExtendedClient} client - The STOMP client to configure.
 * @param {number} [delay=5000] - Reconnection delay in milliseconds.
 */
export const setStompAutoReconnect = (
    client: ExtendedClient,
    delay = 5000
): void => {
    client.reconnect_delay = delay;
};