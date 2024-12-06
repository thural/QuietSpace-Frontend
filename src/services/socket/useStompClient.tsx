import { useEffect, useState } from "react";
import SockJS from 'sockjs-client';
import { Client, Frame, over } from "stompjs";
import { useAuthStore, useStompStore } from "@/services/store/zustand";
import {
    Headers,
    StompHeaders,
    StompClientProps,
    ConnectCallback,
    SubscribeCallback,
    DisconnectCallback
} from "@/api/schemas/native/websocket";
import { ResId } from "@/api/schemas/native/common";
import { ClientContextType } from "@/types/stompStoreTypes";

export const useStompClient = ({ onConnect, onSubscribe, onError, onDisconnect }: StompClientProps) => {
    const { setClientContext } = useStompStore();
    const { isAuthenticated, data } = useAuthStore();

    const [stompClient, setStompClient] = useState<Client | null>(null);
    const [isClientConnected, setIsClientConnected] = useState<boolean>(false);
    const [isConnecting, setIsConnecting] = useState<boolean>(true);
    const [isDisconnected, setIsDisconnected] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const handleError = (message: string) => {
        const errorHandler = onError || ((msg: Frame | string) => console.error(msg));
        setError(new Error(message));
        setIsError(true);
        errorHandler(message);
        console.log(message);
    }

    const createStompClient = (): Client => {
        const socket = new SockJS('http://localhost:8080/ws');
        const client = over(socket);
        return client;
    }

    const setAutoReconnect = (delay: number = 5000) => {
        if (stompClient) {
            stompClient.reconnect_delay = delay;
        }
    }

    const openConnection = ({ headers = { "Authorization": "Bearer " + data?.accessToken } }) => {
        if (stompClient === null) {
            return handleError("error on opening connection, client is not ready");
        }

        const defaultConnect: ConnectCallback = (frame) =>
            console.log("stomp client has been connected: ", frame);

        stompClient.connect(
            headers,
            (frame) => {
                setError(null);
                setIsError(false);
                setIsConnecting(false);
                setIsClientConnected(true);
                (onConnect || defaultConnect)(frame);
            }
        );
    }

    const disconnect = () => {
        if (!isClientConnected) {
            return handleError("error, client is already disconnected");
        }

        const defaultDisconnect: DisconnectCallback = () =>
            console.log("client has been disconnected");

        stompClient?.disconnect(
            () => {
                setIsDisconnected(true);
                (onDisconnect || defaultDisconnect)();
            }
        );
    }

    const sendMessage = (destination: string, body: any, headers: StompHeaders | Headers = {}) => {
        if (!isClientConnected) {
            return handleError("error on sending message, client is not ready");
        }
        stompClient?.send(destination, headers, JSON.stringify(body));
    }

    const subscribe = (destination: string, callback?: SubscribeCallback) => {
        if (stompClient === null) {
            return handleError("error on subscribing, client is not ready");
        }

        const defaultCallback: SubscribeCallback = (message) => {
            console.log(`received message at ${destination}, ${message}`)
        };

        stompClient.subscribe(destination, callback || defaultCallback);
    }

    const subscribeWithId = (destination: string, subscriptionId: ResId) => {
        if (stompClient === null) {
            return handleError("error on subscribing, client is not ready");
        }

        const defaultSubscribe: SubscribeCallback = (message) => {
            if (message?.body) {
                const messageBody = JSON.parse(message.body);
                console.log(`received message at ${destination}, ${messageBody}`)
            }
        };

        stompClient.subscribe(destination, onSubscribe || defaultSubscribe, { id: subscriptionId });
    }

    const unSubscribe = (destination: string) => {
        if (stompClient === null) {
            return handleError("error on unsubscribing, client is not ready");
        }
        stompClient.unsubscribe(destination);
    }

    const methods = {
        subscribe,
        disconnect,
        unSubscribe,
        sendMessage,
        subscribeWithId,
        setAutoReconnect
    };

    const recentContext = {
        isClientConnected,
        isDisconnected,
        isConnecting,
        isError,
        error
    };

    const setContext = (recentContext: ClientContextType) => setClientContext({ ...methods, ...recentContext });

    const onAuthenticated = () => {
        if (!isAuthenticated) return;
        const newClient = createStompClient();
        setStompClient(newClient);
        setContext(recentContext);
    }

    const onClientChange = () => {
        if (!stompClient) return;
        setIsConnecting(true);
        openConnection({});
        setContext(recentContext);
    }

    const onConnnectionChange = () => {
        if (!isClientConnected) return;
        setContext(recentContext);
    }

    useEffect(onAuthenticated, [isAuthenticated])
    useEffect(onClientChange, [stompClient])
    useEffect(onConnnectionChange, [isClientConnected]);

    return {
        stompClient,
        isClientConnected,
        isConnecting,
        isError,
        error,
        ...methods
    };
};