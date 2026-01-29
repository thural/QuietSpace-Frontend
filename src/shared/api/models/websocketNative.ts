import { Frame } from "stompjs";

// Keep existing definitions
export type Headers = Record<string, string>;

export interface StompMessage {
    headers: Headers;
    body: string;
}

export interface StompHeaders {
    login: string;
    passcode: string;
    host?: string | undefined;
    Authorization?: string; // Added for bearer token support
}

// Enhanced enum with potential additional events if needed
export enum SocketEventType {
    CONNECT = "CONNECT",
    DISCONNECT = "DISCONNECT",
    DELETE_MESSAGE = "DELETE_MESSAGE",
    SEEN_MESSAGE = "SEEN_MESSAGE",
    SEEN_NOTIFICATION = "SEEN_NOTIFICATION",
    JOINED_CHAT = "JOINED_CHAT",
    LEFT_CHAT = "LEFT_CHAT",
    EXCEPTION = "EXCEPTION",
    // Potential additional events
    ERROR = "ERROR",
    RECONNECT = "RECONNECT"
}

// More explicit return types for callbacks
export type ConnectCallback = (frame?: Frame) => void | Promise<void>;
export type ErrorCallback = (error: Frame | string) => void | Promise<void>;
export type SubscribeCallback = (message: Frame) => void | Promise<void>; // Changed to require message
export type CloseCallback = () => void | Promise<void>;
export type DisconnectCallback = () => void | Promise<void>;

// Recreate the full type definitions from the original file
export interface StompClientProps {
    onConnect?: ConnectCallback;
    onSubscribe?: SubscribeCallback;
    onError?: ErrorCallback;
    onDisconnect?: DisconnectCallback;
}

// Optional: Create a type for WebSocket connection configuration
export interface WebSocketConfig {
    url: string;
    protocols?: string | string[];
}