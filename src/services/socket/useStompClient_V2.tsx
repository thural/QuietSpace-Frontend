import SockJS from 'sockjs-client';
import { useEffect, useState, useCallback } from "react";
import { Client, Frame, over } from "stompjs";
import { useAuthStore, useStompStore } from "../store/zustand";
import { StompHeaders, Headers, StompClientProps } from "@/api/schemas/native/websocket";
import { AnyFunction } from "@/types/genericTypes";
import { ResId } from "@/api/schemas/native/common";

/**
 * Custom hook to manage a STOMP client using SockJS for WebSocket connections.
 * 
 * @param {StompClientProps} props - The STOMP client properties including callbacks.
 * @returns {Object} - An object containing client state and methods.
 * @returns {Client | null} client - The STOMP client instance.
 * @returns {boolean} isConnecting - Indicates if the client is currently connecting.
 * @returns {boolean} isError - Indicates if there was an error.
 * @returns {Error | null} error - The error encountered, if any.
 * @returns {function} subscribe - Function to subscribe to a destination.
 * @returns {function} disconnect - Function to disconnect the client.
 * @returns {function} unSubscribe - Function to unsubscribe from a destination.
 * @returns {function} sendMessage - Function to send a message.
 * @returns {function} subscribeWithId - Function to subscribe to a destination with a specific ID.
 */
export const useStompClient = ({
    onConnect,
    onSubscribe,
    onError,
    onDisconnect
}: StompClientProps) => {

    const { setClientContext } = useStompStore();
    const { isAuthenticated, data } = useAuthStore();

    const [client, setClient] = useState<Client | null>(null);
    const [isConnecting, setIsConnecting] = useState(true);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    /**
     * Create a new STOMP client.
     * 
     * @returns {Client} - The STOMP client instance.
     */
    const createStompClient = useCallback((): Client => {
        return over(new SockJS('http://localhost:8080/ws'));
    }, []);

    /**
     * Handle errors.
     * 
     * @param {string} message - The error message.
     */
    const handleError = useCallback((message: string) => {
        const errorHandler = onError || ((message: Frame | string) => console.error(message));
        setError(new Error(message));
        setIsError(true);
        errorHandler(message);
        console.log(message);
    }, [onError]);

    /**
     * Handle successful connection.
     * 
     * @param {Frame | undefined} frame - The connection frame.
     * @param {NonNullable<StompClientProps['onConnect']>} callBackFn - The connection callback function.
     */
    const handleConnect = useCallback((frame: Frame | undefined, callBackFn: NonNullable<StompClientProps['onConnect']>) => {
        setError(null);
        setIsError(false);
        callBackFn(frame);
        setIsConnecting(false);
    }, []);

    /**
     * Open a WebSocket connection.
     * 
     * @param {Object} params - Parameters for opening the connection.
     * @param {StompHeaders} params.headers - Connection headers.
     */
    const openConnection = useCallback(({
        headers = { "Authorization": "Bearer " + data?.accessToken }
    }) => {
        if (!client) {
            console.error("client is not ready");
            return;
        }
        if (!client.connected) {
            handleError("error on opening connection, client is not ready");
            return;
        }

        const connectCallback = onConnect || ((frame: Frame | undefined) =>
            console.log("stomp client has been connected: ", frame));

        client.connect(headers, (frame) => handleConnect(frame, connectCallback));
    }, [client, data?.accessToken, handleConnect, handleError, onConnect]);

    /**
     * Disconnect the STOMP client.
     */
    const disconnect = useCallback(() => {
        if (!client) {
            console.error("client is not ready");
            return;
        }
        if (!client.connected) {
            handleError("error, client is already disconnected");
            return;
        }

        const disconnectCallback = onDisconnect || (() =>
            console.log("client has been disconnected"));

        client.disconnect(disconnectCallback);
    }, [client, handleError, onDisconnect]);

    /**
     * Send a message via WebSocket.
     * 
     * @param {string} destination - The destination to send the message to.
     * @param {any} body - The message body.
     * @param {StompHeaders | Headers} [headers={}] - Optional message headers.
     */
    const sendMessage = useCallback((destination: string, body: any, headers: StompHeaders | Headers = {}) => {
        if (!client) {
            console.error("client is not ready");
            return;
        }
        if (!client.connected) {
            handleError("error on sending message, client is not ready");
            return;
        }
        client.send(destination, headers, JSON.stringify(body));
    }, [client, handleError]);

    /**
     * Subscribe to a destination.
     * 
     * @param {string} destination - The subscription destination.
     * @param {AnyFunction} subscribeCallback - The callback to handle messages.
     */
    const subscribe = useCallback((destination: string, subscribeCallback: AnyFunction) => {
        if (!client) {
            console.error("client is not ready");
            return;
        }
        if (!client.connected) {
            handleError("error on subscribing: client is not ready");
            return;
        }

        const callback = subscribeCallback || ((message: Frame) =>
            console.log(`received message at ${destination}, ${message}`));

        client.subscribe(destination, callback);
    }, [client, handleError]);

    /**
     * Subscribe to a destination with a specific ID.
     * 
     * @param {string} destination - The subscription destination.
     * @param {ResId} subscriptionId - The unique subscription identifier.
     */
    const subscribeWithId = useCallback((destination: string, subscriptionId: ResId) => {
        if (!client) {
            console.error("client is not ready");
            return;
        }
        if (!client.connected) {
            handleError("error on subscribing, client is not ready");
            return;
        }

        const callback = onSubscribe || ((message: Frame | undefined) =>
            console.log(`received message: ${message}, at: ${destination}`));

        client.subscribe(destination, callback, { id: subscriptionId });
    }, [client, handleError, onSubscribe]);

    /**
     * Unsubscribe from a destination.
     * 
     * @param {string} destination - The subscription destination to unsubscribe from.
     */
    const unSubscribe = useCallback((destination: string) => {
        if (!client) {
            console.error("client is not ready");
            return;
        }
        if (!client.connected) {
            handleError("error on unsubscribing, client is not ready");
            return;
        }
        client.unsubscribe(destination);
    }, [client, handleError]);

    const methods = {
        subscribe,
        disconnect,
        unSubscribe,
        sendMessage,
        subscribeWithId
    };

    useEffect(() => {
        if (!isAuthenticated) return;

        const newClient = createStompClient();
        setClient(newClient);

        return () => {
            if (newClient?.connected) {
                newClient.disconnect(() => console.log("client disconnected"));
            }
        };
    }, [isAuthenticated, createStompClient]);

    useEffect(() => {
        if (!client || !client.connected) return;

        setIsConnecting(true);
        openConnection({});

        const recentContext = {
            isClientConnected: client.connected,
            isDisconnected: !client.connected,
            isConnecting,
            isError,
            error
        };

        setClientContext({ ...methods, ...recentContext });
    }, [client, methods, isConnecting, isError, error, openConnection]);

    return {
        client,
        isConnecting,
        isError,
        error,
        ...methods
    };
};
