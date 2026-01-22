import {useCallback, useEffect, useMemo, useState} from 'react';
import {useAuthStore, useStompStore} from "@/core/store/zustand";
import {
    createStompClient,
    disconnectStompClient,
    ExtendedClient,
    handleStompError,
    openStompConnection,
    parseStompMessage,
    sendStompMessage,
    setStompAutoReconnect,
    subscribeToDestination,
    unsubscribeFromDestination
} from '@/core/network/socket/utils/stomptUtils';
import {
    ConnectCallback,
    DisconnectCallback,
    Headers,
    StompClientProps,
    StompHeaders,
    SubscribeCallback
} from "@/shared/api/models/websocketNative";
import {ResId} from "@/shared/api/models/commonNative";
import {UseStompClientReturn} from '@shared/types/stompStoreTypes';
import {Frame} from 'stompjs';

/**
 * Custom hook to handle STOMP client connection and operations.
 *
 * This hook manages the STOMP client for WebSocket communications, handling 
 * connection, subscription, message sending, and error management.
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
     * This function processes error messages and updates the error state.
     *
     * @param {string | Frame} errorMessage - The error message or frame.
     * @returns {Error} - The created Error object.
     */
    const handleError = useCallback((errorMessage: string | Frame) => {
        const newError = handleStompError(
            errorMessage,
            onError || ((msg: Frame | string) => {
                console.error(msg);
                return undefined;
            })
        );

        setError(newError);
        setIsError(true);

        return newError;
    }, [onError]);

    /**
     * Open a connection with authentication headers.
     *
     * This function establishes a STOMP connection using the provided headers,
     * including authentication tokens.
     *
     * @param {object} [params] - The parameters including headers.
     * @param {StompHeaders} [params.headers] - The connection headers.
     */
    const openConnection = useCallback(
        ({ headers = {
            Authorization: `Bearer ${data?.accessToken}`,
            login: '',
            passcode: ''
        } } = {}) => {
            if (!stompClient) {
                return handleError("Client is not ready");
            }

            const defaultConnect: ConnectCallback = (frame) =>
                console.log("STOMP client connected", frame);

            openStompConnection(stompClient, {
                headers,
                onConnect: (frame: Frame) => {
                    setError(null);
                    setIsError(false);
                    setIsConnecting(false);
                    setIsClientConnected(true);
                    (onConnect || defaultConnect)(frame);
                },
                onError: (error: Frame | string) => {
                    handleError(error);
                    return undefined;
                }
            }).catch((error) => {
                handleError(error);
            });
        },
        [stompClient, data?.accessToken, onConnect, handleError]
    );

    /**
     * Disconnect the STOMP client.
     *
     * This function safely disconnects the STOMP client and updates the connection state.
     */
    const disconnect = useCallback(() => {
        if (!isClientConnected || !stompClient) {
            return handleError("Client already disconnected or not ready");
        }

        const defaultDisconnect: DisconnectCallback = () =>
            console.log("Client disconnected");

        try {
            disconnectStompClient(stompClient, () => {
                setIsDisconnected(true);
                setIsClientConnected(false);
                (onDisconnect || defaultDisconnect)();
            });
        } catch (error) {
            handleError((error as Error).message);
        }
    }, [stompClient, isClientConnected, onDisconnect, handleError]);

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
        try {
            sendStompMessage(stompClient!, destination, body, headers);
        } catch (error) {
            handleError((error as Error).message);
        }
    }, [stompClient, handleError]);

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
        try {
            const defaultCallback: SubscribeCallback = (message) => {
                console.log(`Received message at ${destination}`, message);
            };

            subscribeToDestination(stompClient!, destination, callback || defaultCallback);
        } catch (error) {
            handleError((error as Error).message);
        }
    }, [stompClient, handleError]);

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
        try {
            const defaultSubscribe: SubscribeCallback = (message) => {
                const parsedBody = parseStompMessage(message);
                if (parsedBody) {
                    console.log(`Received message at ${destination}`, parsedBody);
                }
            };

            subscribeToDestination(
                stompClient!,
                destination,
                onSubscribe || defaultSubscribe,
                { id: subscriptionId }
            );
        } catch (error) {
            handleError((error as Error).message);
        }
    }, [stompClient, onSubscribe, handleError]);

    /**
     * Unsubscribe from a destination.
     *
     * @param {string} subscriptionId - The subscription ID to unsubscribe.
     */
    const unSubscribe = useCallback((subscriptionId: string) => {
        try {
            unsubscribeFromDestination(stompClient!, subscriptionId);
        } catch (error) {
            handleError((error as Error).message);
        }
    }, [stompClient, handleError]);

    /**
     * Set automatic reconnection with a delay.
     *
     * @param {number} [delay=5000] - The reconnection delay in milliseconds.
     */
    const setAutoReconnect = useCallback((delay = 5000) => {
        try {
            setStompAutoReconnect(stompClient!, delay);
        } catch (error) {
            handleError((error as Error).message);
        }
    }, [stompClient, handleError]);

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

        try {
            const newClient = createStompClient();
            setStompClient(newClient);
        } catch (error) {
            handleError((error as Error).message);
        }
    }, [isAuthenticated, handleError]);

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

export default useStompClient;