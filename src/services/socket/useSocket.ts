import {
    ConnectCallback,
    ErrorCallback,
    Headers,
    StompHeaders
} from '@/api/schemas/native/websocket';
import { AnyFunction } from '@/types/genericTypes';
import { useCallback, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client, Frame, over } from 'stompjs';

interface SocketHookReturn {
    createClient: () => Client;
    openConnection: (
        client: Client,
        headers: StompHeaders,
        onConnectCallback?: ConnectCallback,
        onErrorCallback?: ErrorCallback
    ) => void;
    disconnect: (client: Client, onDisconnectCallback?: AnyFunction) => void;
    sendMessage: (
        client: Client,
        destination: string,
        body: unknown,
        headers?: StompHeaders | Headers
    ) => void;
    subscribe: (
        client: Client,
        destination: string,
        callback: (message: unknown) => void
    ) => void;
    subscribeWithId: (
        client: Client,
        destination: string,
        callback: (message: unknown) => void,
        subscriptionId: string
    ) => void;
    unsubscribe: (client: Client, subscriptionId: string) => void;
}

export const useSocket = (): SocketHookReturn => {
    // Create a logger that can be easily configured or disabled
    const logger = useRef({
        log: (message: string, ...args: unknown[]) => {
            console.log(`[Socket] ${message}`, ...args);
        },
        error: (message: string, ...args: unknown[]) => {
            console.error(`[Socket] ${message}`, ...args);
        }
    });

    /**
     * Create a new SockJS WebSocket client
     * @param url - WebSocket server URL
     * @returns Stomp client instance
     */
    const createClient = useCallback((url: string = 'http://localhost:8080/ws'): Client => {
        try {
            const socket = new SockJS(url);
            return over(socket);
        } catch (error) {
            logger.current.error('Failed to create WebSocket client', error);
            throw error;
        }
    }, []);

    /**
     * Handle connection success
     * @param frame - Connection frame
     * @param callback - Optional callback function
     */
    const onConnect = useCallback((frame: Frame, callback?: ConnectCallback) => {
        logger.current.log('Connected to WebSocket', frame);
        if (callback) callback(frame);
    }, []);

    /**
     * Handle connection errors
     * @param error - Connection error
     * @param callback - Optional error callback function
     */
    const onError = useCallback((error: Frame | string, callback?: ErrorCallback) => {
        logger.current.error('WebSocket connection error', error);
        if (callback) callback(error);
    }, []);

    /**
     * Open a WebSocket connection
     * @param client - Stomp client
     * @param headers - Connection headers
     * @param onConnectCallback - Optional connection success callback
     * @param onErrorCallback - Optional error callback
     */
    const openConnection = useCallback((
        client: Client,
        headers: StompHeaders,
        onConnectCallback?: ConnectCallback,
        onErrorCallback?: ErrorCallback
    ) => {
        logger.current.log('Connecting STOMP client...');

        try {
            client.connect(
                headers,
                (frame) => onConnect(frame, onConnectCallback),
                (error) => onError(error, onErrorCallback)
            );
        } catch (error) {
            logger.current.error('Failed to open WebSocket connection', error);
            throw error;
        }
    }, [onConnect, onError]);

    /**
     * Disconnect from WebSocket
     * @param client - Stomp client
     * @param onDisconnectCallback - Optional disconnect callback
     */
    const disconnect = useCallback((
        client: Client,
        onDisconnectCallback?: AnyFunction
    ) => {
        logger.current.log('Disconnecting STOMP client...');

        try {
            client.disconnect(() => {
                logger.current.log('WebSocket disconnected');
                if (onDisconnectCallback) onDisconnectCallback();
            });
        } catch (error) {
            logger.current.error('Failed to disconnect WebSocket', error);
            throw error;
        }
    }, []);

    /**
     * Send a message via WebSocket
     * @param client - Stomp client
     * @param destination - Message destination
     * @param body - Message body
     * @param headers - Optional message headers
     */
    const sendMessage = useCallback((
        client: Client,
        destination: string,
        body: unknown,
        headers: StompHeaders | Headers = {}
    ) => {
        try {
            client.send(destination, headers, JSON.stringify(body));
            logger.current.log('Message sent', { destination, body });
        } catch (error) {
            logger.current.error('Failed to send message', error);
            throw error;
        }
    }, []);

    /**
     * Subscribe to a WebSocket destination
     * @param client - Stomp client
     * @param destination - Subscription destination
     * @param callback - Message handling callback
     */
    const subscribe = useCallback((
        client: Client,
        destination: string,
        callback: (message: unknown) => void
    ) => {
        try {
            client.subscribe(destination, (message) => {
                try {
                    const parsedBody = JSON.parse(message.body);
                    callback(parsedBody);
                } catch (parseError) {
                    logger.current.error('Failed to parse message', parseError);
                }
            });
            logger.current.log('Subscribed to destination', destination);
        } catch (error) {
            logger.current.error('Failed to subscribe', error);
            throw error;
        }
    }, []);

    /**
     * Subscribe to a WebSocket destination with a specific ID
     * @param client - Stomp client
     * @param destination - Subscription destination
     * @param callback - Message handling callback
     * @param subscriptionId - Unique subscription identifier
     */
    const subscribeWithId = useCallback((
        client: Client,
        destination: string,
        callback: (message: unknown) => void,
        subscriptionId: string
    ) => {
        try {
            client.subscribe(
                destination,
                (message) => {
                    try {
                        const parsedBody = JSON.parse(message.body);
                        callback(parsedBody);
                    } catch (parseError) {
                        logger.current.error('Failed to parse message', parseError);
                    }
                },
                { id: subscriptionId }
            );
            logger.current.log('Subscribed to destination with ID', { destination, subscriptionId });
        } catch (error) {
            logger.current.error('Failed to subscribe with ID', error);
            throw error;
        }
    }, []);

    /**
     * Unsubscribe from a WebSocket destination
     * @param client - Stomp client
     * @param subscriptionId - Subscription identifier to unsubscribe
     */
    const unsubscribe = useCallback((
        client: Client,
        subscriptionId: string
    ) => {
        try {
            client.unsubscribe(subscriptionId);
            logger.current.log('Unsubscribed from destination', subscriptionId);
        } catch (error) {
            logger.current.error('Failed to unsubscribe', error);
            throw error;
        }
    }, []);

    return {
        createClient,
        openConnection,
        disconnect,
        sendMessage,
        subscribe,
        subscribeWithId,
        unsubscribe,
    };
};