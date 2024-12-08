import { useEffect, useState, useCallback, useMemo } from 'react';
import { useAuthStore, useStompStore } from "@/services/store/zustand";
import {
    createStompClient,
    openStompConnection,
    handleStompError,
    sendStompMessage,
    subscribeToDestination,
    disconnectStompClient,
    setStompAutoReconnect,
    ExtendedClient
} from '@/utils/stomptUtils';
import {
    StompHeaders,
    StompClientProps,
    ConnectCallback,
    SubscribeCallback,
    DisconnectCallback,
    StompMessage,
    Headers
} from "@/api/schemas/native/websocket";
import { ResId } from "@/api/schemas/native/common";
import { UseStompClientReturn } from '@/types/stompStoreTypes';
import { Frame } from 'stompjs'; // Add explicit import for Frame

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
        const newError = handleStompError(
            errorMessage,
            onError || ((msg) => {
                console.error(msg);
                return undefined; // Explicitly return undefined to match ErrorCallback
            })
        );

        setError(newError);
        setIsError(true);

        return newError;
    }, [onError]);

    /**
     * Open a connection with authentication headers.
     *
     * @param {object} [params] - The parameters including headers.
     * @param {StompHeaders} [params.headers] - The connection headers.
     */
    const openConnection = useCallback(
        ({ headers = {
            Authorization: `Bearer ${data?.accessToken}`,
            login: '', // Add required empty login 
            passcode: '' // Add required empty passcode
        } } = {}) => {
            if (!stompClient) {
                return handleError("Client is not ready");
            }

            const defaultConnect: ConnectCallback = (frame) =>
                console.log("STOMP client connected", frame);

            openStompConnection(stompClient, {
                headers,
                onConnect: (frame) => {
                    setError(null);
                    setIsError(false);
                    setIsConnecting(false);
                    setIsClientConnected(true);
                    (onConnect || defaultConnect)(frame);
                },
                onError: (error) => {
                    handleError(error);
                    return undefined; // Explicitly return undefined
                }
            });
        },
        [stompClient, data?.accessToken, onConnect]
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

        if (stompClient) {
            disconnectStompClient(stompClient, () => {
                setIsDisconnected(true);
                (onDisconnect || defaultDisconnect)();
            });
        }
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

        if (stompClient) {
            sendStompMessage(stompClient, destination, body, headers);
        }
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

        subscribeToDestination(stompClient, destination, callback || defaultCallback);
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

        subscribeToDestination(
            stompClient,
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

    /**
     * Set automatic reconnection with a delay.
     *
     * @param {number} [delay=5000] - The reconnection delay in milliseconds.
     */
    const setAutoReconnect = useCallback((delay = 5000) => {
        if (stompClient) {
            setStompAutoReconnect(stompClient, delay);
        }
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
    }, [isAuthenticated]);

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