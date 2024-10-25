import SockJS from 'sockjs-client';
import { useEffect, useState } from "react";
import { Client, Frame, over } from "stompjs";
import { useAuthStore, useStompStore } from "./zustand";
import { StompHeaders, Headers, StompClientProps } from "@/api/schemas/native/websocket";
import { AnyFunction } from "@/types/genericTypes";
import { ResId } from "@/api/schemas/native/common";
import { ClientContextType } from "@/types/stompStoreTypes";

export const useStompClient = ({ onConnect, onSubscribe, onError, onDisconnect }: StompClientProps) => {

    const initClient = over(new SockJS('http://localhost:8080/ws'));


    const { setClientContext } = useStompStore();
    const { isAuthenticated, data } = useAuthStore();
    const [client, setClient] = useState<Client>(initClient);
    const [isConnecting, setIsConnecting] = useState(true);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<Error | null>(null);


    const createStompClient = (): Client => over(new SockJS('http://localhost:8080/ws'));

    const handleError = (message: string) => {
        setError(new Error(message));
        setIsError(true);
        onError(message);
        console.log(message);
    }

    const handleConnect = (frame: Frame | undefined, callBackFn: AnyFunction) => {
        setError(null);
        setIsError(false);
        callBackFn(frame);
        setIsConnecting(false);
    }


    const openConnection = ({ headers = { "Authorization": "Bearer " + data.accessToken } }) => {
        if (!client.connected) return handleError("error on opening connection, client is not ready");
        if (!onConnect) onConnect = (frame: Frame | undefined) => console.log("stomp client has been connected: ", frame);
        client.connect(headers, (frame) => handleConnect(frame, onConnect));
    }

    const disconnect = () => {
        if (!client.connected) return handleError("error, client is already disconnected");
        if (!onDisconnect) onDisconnect = () => console.log("client has been disconnected");
        client.disconnect(onDisconnect);
    }

    const sendMessage = (destination: string, body: any, headers: StompHeaders | Headers = {}) => {
        if (!client.connected) return handleError("error on sending message, client is not ready");
        client.send(destination, headers, JSON.stringify(body));
    }

    const subscribe = (destination: string, onSubscribe: AnyFunction) => {
        if (!client.connected) return handleError("error on subsbcribing: client is not ready");
        if (!onSubscribe) onSubscribe = (message: Frame) => console.log(`received message at ${destination}, ${message}`);
        client.subscribe(destination, onSubscribe);
    }

    const subscribeWithId = (destination: string, subscribtionId: ResId) => {
        if (!client.connected) return handleError("error on subscribing, client is not ready");
        if (!onSubscribe) onSubscribe = (message: Frame | undefined) => console.log(`received message: ${message}, at: ${destination}`);
        client.subscribe(destination, onSubscribe, { id: subscribtionId });
    }

    const unSubscribe = (destination: string) => {
        if (!client.connected) return handleError("error on unsubsbcribing, client is not ready");
        client.unsubscribe(destination);
    }


    const methods = { subscribe, disconnect, unSubscribe, sendMessage, subscribeWithId };
    const recentContext = { isClientConnected: client.connected, isDisconnected: !client.connected, isConnecting, isError, error }
    const setContext = (recentContext: ClientContextType) => setClientContext({ ...methods, ...recentContext });


    const onAuthenticationChange = () => {
        if (!isAuthenticated) return;
        setClient(createStompClient());
        setContext(recentContext);
    }

    const onClientChange = () => {
        if (!client.connected) return;
        setIsConnecting(true);
        openConnection({});
        setContext(recentContext);
    }

    const onConnectionChange = () => {
        if (!client.connected) return;
        setContext(recentContext);
    }

    useEffect(onAuthenticationChange, [isAuthenticated])
    useEffect(onClientChange, [client]);
    useEffect(onConnectionChange, [client.connected]);
}