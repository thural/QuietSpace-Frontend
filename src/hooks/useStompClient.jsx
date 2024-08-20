import { useEffect, useState } from "react";
import sockjs from "sockjs-client/dist/sockjs"
import { over } from "stompjs";
import { useAuthStore, useStompStore } from "./zustand";

export const useStompClient = ({
    onConnect,
    onSubscribe,
    onClose,
    onError,
    onDisconnect,
    reconnectDelay
}) => {

    const { setClientContext } = useStompStore();
    const { isAuthenticated, data } = useAuthStore();

    const [stompClient, setStompClient] = useState(null);
    const [isClientConnected, setIsClientConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(true);
    const [isDisconnected, setIsDisconnected] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(null);


    const createStompClient = () => {
        const socket = new sockjs('http://localhost:8080/ws');
        const client = over(socket);
        return client;
    }


    const setAutoReconnect = (delay = 5000) => {
        stompClient.reconnect_delay = delay;
    }


    const openConnection = ({ headers = { "Authorization": "Bearer " + data.accessToken }, setContext }) => {
        if (stompClient === null) {
            console.log("error on opening connection, client is not ready");
            return;
        }
        if (!onConnect) onConnect = (frame) => console.log("stomp client has been connected: ", frame);
        console.log("STOMP client is being connected...");
        stompClient.connect(
            headers,
            (frame) => {
                setIsConnecting(false);
                setIsClientConnected(true);
                onConnect(frame);
                setContext();
            }
        );
    }


    const openConnectionWithLogin = (headers = {}) => {
        if (!onConnect) onConnect = (frame) => console.log("stomp client has been connected: ", frame);
        if (!onClose) onClose = () => console.log("stomp client has been closed");
        if (!onError) onError = (error) => console.log("error on connecting to client: ", error);
        stompClient.connect(
            headers,
            (frame) => {
                setIsConnecting(false);
                setIsClientConnected(true);
                onConnect(frame);
            },
            (error) => {
                setIsError(true);
                setError(error);
                onError(error);
            },
            onClose);
    }


    const disconnect = () => {
        if (!isClientConnected) {
            console.log("error, client is already disconnected");
            return;
        }
        if (!onDisconnect) onDisconnect = () => console.log("client has been disconnected");
        stompClient.disconnect(
            () => {
                setIsDisconnected(true);
                onDisconnect();
            }
        );
    }


    const sendMessage = (destination, body, headers = {}) => {
        if (!isClientConnected) {
            console.log("error on sending message, client is not ready");
            return;
        }
        stompClient.send(destination, headers, JSON.stringify(body));
    }


    const subscribe = (destination, onSubscribe) => {
        if (stompClient === null) {
            console.log("error on subsbcribing, client is not ready");
            return;
        }
        if (!onSubscribe) onSubscribe = (message) => {
            console.log(`received message at ${destination}, ${message}`)
        };
        stompClient.subscribe(destination, onSubscribe);
    }


    const subscribeWithId = (destination, subscribtionId) => {
        if (stompClient === null) {
            console.log("error on subscribing, client is not ready");
            return;
        }
        if (!onSubscribe) onSubscribe = (message) => {
            const messageBody = JSON.parse(message.body);
            console.log(`received message at ${destination}, ${messageBody}`)
        };
        stompClient.subscribe(destination, onSubscribe, { id: subscribtionId });
    }


    const unSubscribe = (destination) => {
        if (stompClient === null) {
            console.log("error on unsubsbcribing, client is not ready");
            return;
        }
        if (!onSubscribe) onSubscribe = (message) => {
            const messageBody = JSON.parse(message.body);
            console.log(`received message at ${destination}, ${messageBody}`)
        };
        stompClient.unSubscribe(destination, onSubscribe);
    }

    const context = {
        disconnect,
        subscribe,
        subscribeWithId,
        unSubscribe,
        sendMessage,
        setAutoReconnect,
        isClientConnected,
        isConnecting,
        isDisconnected,
        isError,
        error
    };

    const setContext = () => {
        setClientContext(context);
    }


    useEffect(() => {
        if (!isAuthenticated) return;
        const newclient = createStompClient();
        setStompClient(newclient);
        console.log("STOMP CLIENT is created: ", !!stompClient);
    }, [isAuthenticated])


    useEffect(() => {
        if (!stompClient) return;
        if (reconnectDelay) setAutoReconnect(reconnectDelay);
        setIsConnecting(true);
        openConnection({ setContext });
        console.log("connection has opened");
    }, [stompClient])



    return context;
}