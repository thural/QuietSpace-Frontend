import { useEffect, useState } from "react";
import sockjs from "sockjs-client/dist/sockjs"
import { over } from "stompjs";

export const useStompClient = ({
    onConnect,
    onSubscribe,
    onClose,
    onError,
    onDisconnect,
    reconnectDelay
}) => {

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


    const openConnection = (headers = {}) => {
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
        if (stompClient === null) {
            console.log("error on sending message, client is not ready");
            return;
        }
        stompClient.send(destination, headers, JSON.stringify(body));
    }


    const subscribe = (destination) => {
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


    useEffect(() => {
        const newclient = createStompClient();
        setStompClient(newclient);
    }, [])


    useEffect(() => {
        console.log("STOMP CLIENT is created: ", !!stompClient);
        if (!stompClient) return;
        if (reconnectDelay) setAutoReconnect(reconnectDelay);
        setIsConnecting(true);
        openConnection();
    }, [stompClient])



    return {
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
}