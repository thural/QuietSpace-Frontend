import { ResId } from "@/api/schemas/native/common";
import { StompHeaders, SubscribeCallback } from "@/api/schemas/native/websocket";
import { Client } from "stompjs";

export interface ExtendedClient extends Client {
    reconnect_delay?: number;
}

export interface UseStompClientReturn {
    stompClient: ExtendedClient | null;
    isClientConnected: boolean;
    isConnecting: boolean;
    isError: boolean;
    error: Error | null;
    subscribe: (destination: string, callback?: SubscribeCallback) => void;
    unSubscribe: (destination: string) => void;
    sendMessage: (destination: string, body?: any, headers?: StompHeaders) => void;
    disconnect: () => void;
    subscribeWithId: (destination: string, subscriptionId: ResId) => void;
    setAutoReconnect: (delay?: number) => void;
}

export interface StompStore {
    clientContext: Partial<UseStompClientReturn>;
    setClientContext: (methods: Partial<UseStompClientReturn>) => void;
    resetClientContext: () => void;
}