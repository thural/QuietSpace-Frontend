import SockJS from 'sockjs-client';
import { Client, Frame, over } from "stompjs";
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
 * Create a new STOMP client
 * 
 * @param {string} [wsUrl='http://localhost:8080/ws'] - WebSocket URL
 * @returns {ExtendedClient} - The created STOMP client
 */
export const createStompClient = (wsUrl: string = 'http://localhost:8080/ws'): ExtendedClient => {
    const socket = new SockJS(wsUrl);
    return over(socket) as ExtendedClient;
};

/**
 * Handle STOMP client errors
 * 
 * @param {string | Frame} errorMessage - The error message or frame
 * @param {ErrorCallback} [errorHandler] - Optional custom error handler
 * @returns {Error} - The created Error object
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
 * Open a STOMP connection
 * 
 * @param {ExtendedClient} client - The STOMP client
 * @param {object} options - Connection options
 * @param {StompHeaders} [options.headers] - Connection headers
 * @param {ConnectCallback} [options.onConnect] - Connection success callback
 * @param {ErrorCallback} [options.onError] - Connection error callback
 * @returns {Promise<Frame>} - A promise that resolves when connection is established
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
        onError = (error) => handleStompError(error)
    } = options;

    return new Promise((resolve, reject) => {
        client.connect(
            headers,
            (frame) => {
                onConnect(frame);
                resolve(frame);
            },
            (error) => {
                const processedError = onError(error);
                reject(processedError);
            }
        );
    });
};

/**
 * Send a message via STOMP
 * 
 * @param {ExtendedClient} client - The STOMP client
 * @param {string} destination - Message destination
 * @param {any} body - Message body
 * @param {Headers | StompHeaders} [headers={}] - Message headers
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
 * Subscribe to a STOMP destination
 * 
 * @param {ExtendedClient} client - The STOMP client
 * @param {string} destination - Subscription destination
 * @param {SubscribeCallback} [callback] - Message receive callback
 * @param {object} [options] - Subscription options
 * @param {ResId} [options.id] - Optional subscription ID
 * @returns {any} - The subscription object
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
 * Disconnect from STOMP
 * 
 * @param {ExtendedClient} client - The STOMP client
 * @param {DisconnectCallback} [callback] - Disconnect callback
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
 * Set auto-reconnect for STOMP client
 * 
 * @param {ExtendedClient} client - The STOMP client
 * @param {number} [delay=5000] - Reconnection delay in milliseconds
 */
export const setStompAutoReconnect = (
    client: ExtendedClient,
    delay = 5000
): void => {
    client.reconnect_delay = delay;
};