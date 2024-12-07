import { useEffect, useState, useCallback, useMemo } from 'react';
import SockJS from 'sockjs-client';
import { Client, Frame, over } from "stompjs";
import { useAuthStore, useStompStore } from "@/services/store/zustand";
import {
    StompHeaders,
    StompClientProps,
    ConnectCallback,
    SubscribeCallback,
    DisconnectCallback,
    ErrorCallback,
    StompMessage,
    Headers
} from "@/api/schemas/native/websocket";
import { ResId } from "@/api/schemas/native/common";
import { UseStompClientReturn } from '@/types/stompStoreTypes';

// Extend the Client type to include reconnect_delay
interface ExtendedClient extends Client {
    reconnect_delay?: number;
}

/**
 * Custom hook to handle STOMP client connection and operations.
 *
 * @param {StompClientProps} props - The callbacks for various STOMP client events.
 * @returns {UseStompClientReturn} - An object with the client and connection states and methods.
 */
export const useStompClient = ({
    onConnect,
    onSubscribe,
    onError,
    onDisconnect
}: StompClientProps = {}): UseStompClientReturn => {
    const { setClientContext } = useStompStore();
    const { isAuthenticated, data } = useAuthStore();

    const [stompClient, setStompClient] = useState<ExtendedClient | null>(null);
    const [isClientConnected, setIsClientConnected] = useState<boolean>(false);
    const [isConnecting, setIsConnecting] = useState<boolean>(true);
    const [isDisconnected, setIsDisconnected] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    /**
     * Handle errors and update state.
     *
     * @param {string | Frame} errorMessage - The error message or frame.
     * @returns {Error} - The created Error object.
     */
    const handleError = useCallback((errorMessage: string | Frame) => {
        const errorHandler = onError || ((msg) => console.error(msg));

        const newError = new Error(
            typeof errorMessage === 'string'
                ? errorMessage
                : errorMessage.toString()
        );

        setError(newError);
        setIsError(true);
        errorHandler(errorMessage);

        return newError;
    }, [onError]);

    /**
     * Create a new STOMP client.
     *
     * @returns {ExtendedClient} - The created STOMP client.
     */
    const createStompClient = useCallback((): ExtendedClient => {
        const socket = new SockJS('http://localhost:8080/ws');
        return over(socket) as ExtendedClient;
    }, []);

    /**
     * Set automatic reconnection with a delay.
     *
     * @param {number} [delay=5000] - The reconnection delay in milliseconds.
     */
    const setAutoReconnect = useCallback((delay = 5000) => {
        if (stompClient) {
            (stompClient as ExtendedClient).reconnect_delay = delay;
        }
    }, [stompClient]);

    /**
     * Open a connection with authentication headers.
     *
     * @param {object} [params] - The parameters including headers.
     * @param {StompHeaders} [params.headers] - The connection headers.
     */
    const openConnection = useCallback(
        ({ headers = { "Authorization": `Bearer ${data?.accessToken}` } } = {}) => {
            if (!stompClient) {
                return handleError("Client is not ready");
            }

            const defaultConnect: ConnectCallback = (frame) =>
                console.log("STOMP client connected", frame);

            stompClient.connect(
                headers,
                (frame) => {
                    setError(null);
                    setIsError(false);
                    setIsConnecting(false);
                    setIsClientConnected(true);
                    (onConnect || defaultConnect)(frame);
                },
                (error) => handleError(error)
            );
        },
        [stompClient, data?.accessToken, onConnect, handleError]
    );

    /**
     * Disconnect the STOMP client.
     */
    const disconnect = useCallback(() => {
        if (!isClientConnected) {
            return handleError("Client already disconnected");
        }

        const defaultDisconnect: DisconnectCallback = () =>
            console.log("Client disconnected");

        stompClient?.disconnect(
            () => {
                setIsDisconnected(true);
                (onDisconnect || defaultDisconnect)();
            }
        );
    }, [stompClient, isClientConnected, onDisconnect]);

    /**
     * Send a message using the STOMP client.
     *
     * @param {string} destination - The destination to send the message to.
     * @param {any} body - The message body.
     * @param {Headers | StompHeaders} [headers={}] - The message headers.
     */
    const sendMessage = useCallback((
        destination: string,
        body: any,
        headers: Headers | StompHeaders = {}
    ) => {
        if (!isClientConnected) {
            return handleError("Cannot send message, client not connected");
        }
        stompClient?.send(destination, headers, JSON.stringify(body));
    }, [stompClient, isClientConnected]);

    /**
     * Subscribe to a destination.
     *
     * @param {string} destination - The subscription destination.
     * @param {SubscribeCallback} [callback] - The callback for received messages.
     */
    const subscribe = useCallback((
        destination: string,
        callback?: SubscribeCallback
    ) => {
        if (!stompClient) {
            return handleError("Cannot subscribe, client not ready");
        }

        const defaultCallback: SubscribeCallback = (message) => {
            console.log(`Received message at ${destination}`, message);
        };

        stompClient.subscribe(destination, callback || defaultCallback);
    }, [stompClient]);

    /**
     * Subscribe to a destination with a specific subscription ID.
     *
     * @param {string} destination - The subscription destination.
     * @param {ResId} subscriptionId - The subscription ID.
     */
    const subscribeWithId = useCallback((
        destination: string,
        subscriptionId: ResId
    ) => {
        if (!stompClient) {
            return handleError("Cannot subscribe, client not ready");
        }

        const defaultSubscribe: SubscribeCallback = (message) => {
            if (message?.body) {
                const messageBody: StompMessage = JSON.parse(message.body);
                console.log(`Received message at ${destination}`, messageBody);
            }
        };

        stompClient.subscribe(
            destination,
            onSubscribe || defaultSubscribe,
            { id: subscriptionId }
        );
    }, [stompClient, onSubscribe]);

    /**
     * Unsubscribe from a destination.
     *
     * @param {string} destination - The subscription destination.
     */
    const unSubscribe = useCallback((destination: string) => {
        if (!stompClient) {
            return handleError("Cannot unsubscribe, client not ready");
        }
        stompClient.unsubscribe(destination);
    }, [stompClient]);

    // Memoized context for store
    const clientContext = useMemo(() => ({
        isClientConnected,
        isDisconnected,
        isConnecting,
        isError,
        error,
        subscribe,
        disconnect,
        unSubscribe,
        sendMessage,
        subscribeWithId,
        setAutoReconnect
    }), [
        isClientConnected,
        isDisconnected,
        isConnecting,
        isError,
        error,
        subscribe,
        disconnect,
        unSubscribe,
        sendMessage,
        subscribeWithId,
        setAutoReconnect
    ]);

    // Authentication effect
    useEffect(() => {
        if (!isAuthenticated) return;
        const newClient = createStompClient();
        setStompClient(newClient);
    }, [isAuthenticated, createStompClient]);

    // Client change effect
    useEffect(() => {
        if (!stompClient) return;
        setIsConnecting(true);
        openConnection();
    }, [stompClient, openConnection]);

    // Connection change effect
    useEffect(() => {
        if (!isClientConnected) return;
        setClientContext(clientContext);
    }, [isClientConnected, clientContext, setClientContext]);

    // Return hook methods and states
    return {
        stompClient,
        isClientConnected,
        isConnecting,
        isError,
        error,
        subscribe,
        unSubscribe,
        sendMessage,
        disconnect,
        subscribeWithId,
        setAutoReconnect
    };
};