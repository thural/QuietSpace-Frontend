import { Client, Frame, over } from 'stompjs';
import { AnyFunction } from '@/types/genericTypes';
import { ConnectCallback, StompHeaders, Headers, ErrorCallback } from '@/api/schemas/native/websocket';
import SockJS from 'sockjs-client';

export const useSocket = () => {

    const createClient = (): Client => {
        const socket = new SockJS('http://localhost:8080/ws');
        return over(socket);
    };

    const onConnect = (frame: Frame, callbackFn: ConnectCallback) => {
        if (callbackFn) return callbackFn(frame);
        console.log("frame on connect: ", frame);
    };

    const onError = (error: Frame | string, callbackFn: ErrorCallback) => {
        if (callbackFn) return callbackFn(error);
        console.log("error on connect: ", error);
    };

    const onClose = (callbackFn: AnyFunction) => {
        if (callbackFn) return callbackFn();
        console.log("connection has been closed");
    };

    const openConnection = (client: Client, headers: StompHeaders, onConnect: ConnectCallback) => {
        console.log("STOMP client is being connected...");
        client.connect(
            headers,
            onConnect
        );
    };

    const disconnect = (client: Client, callbackFn: AnyFunction) => {
        console.log("STOMP client is being disconnected...");
        client.disconnect(callbackFn);
    };

    const sendMessage = (client: Client, destination: string, body: any, headers: StompHeaders | Headers = {}) => {
        client.send(destination, headers, JSON.stringify(body));
    };

    const subscribe = (client: Client, destination: string, callbackFn: AnyFunction) => {
        client.subscribe(destination, (message) => {
            callbackFn(JSON.parse(message.body));
        });
    };

    const unSubscribe = (client: Client, destination: string, callbackFn: AnyFunction) => {
        client.subscribe(destination, (message) => {
            callbackFn(JSON.parse(message.body));
        });
    };

    const subscribeWithId = (client: Client, destination: string, callbackFn: AnyFunction, subscribtionId: string) => {
        client.subscribe(
            destination,
            (result) => callbackFn(JSON.parse(result.body)),
            { id: subscribtionId }
        );
    };

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
    };
};
