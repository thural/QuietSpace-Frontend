import sockjs from "sockjs-client/dist/sockjs"
import { over } from "stompjs";

export const useSocket = () => {

    const createClient = () => {
        const socket = new sockjs('http://localhost:8080/ws');
        const client = over(socket);
        return client;
    }

    const setAutoReconnect = (delay = 5000) => {
        client.reconnect_delay = delay;
    }

    const onConnect = (frame, callbackFn) => {
        if (callbackFn) return callbackFn(frame);
        console.log("frame on connect: ", frame);
    }

    const onError = (error, callbackFn) => {
        if (callbackFn) return callbackFn(error);
        console.log("error on connect: ", error, error.headers.message);
    };

    const onClose = (callbackFn) => {
        if (callbackFn) return callbackFn();
        console.log("connection has been closed");
    }

    const openConnection = (client, headers, onConnect) => {
        console.log("STOMP client is being connected...");
        client.connect(
            headers,
            (frame) => onConnect(frame),
        );
    }

    const openConnectionWithLogin = (client, headers, onConnect, onError, closeEventCallback) => {
        console.log("STOMP client is being connected...");

        client.connect(
            headers,
            (frame) => onConnect(frame),
            onError,
            closeEventCallback
        );
    }

    const disconnect = (client, callbackFn) => {
        console.log("STOMP client is being disconnected...");
        client.disconnect(callbackFn);
    }

    const sendMessage = (client, destination, body, headers = {}) => {
        client.send(destination, headers, JSON.stringify(body));
    }

    const subscribe = (client, destination, callbackFn) => {
        client.subscribe(destination, (message) => {
            callbackFn(JSON.parse(message.body))
        });
    }

    const unSubscribe = (client, destination, callbackFn) => {
        client.subscribe(destination, (message) => {
            callbackFn(JSON.parse(message.body))
        });
    }

    const subscribeWithId = (client, destination, callbackFn, subscribtionId) => {
        client.subscribe(
            destination,
            (result) => callbackFn(JSON.parse(result.body)),
            { id: subscribtionId }
        );
    }

    return {
        createClient,
        openConnection,
        disconnect,
        onConnect,
        onError,
        onClose,
        subscribe,
        subscribeWithId,
        unSubscribe,
        sendMessage,
        setAutoReconnect
    };
}