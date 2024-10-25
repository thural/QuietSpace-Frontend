import { AnyFunction } from "@/types/genericTypes";
import { Frame } from "stompjs";

export interface StompMessage {
    headers: Record<string, string>;
    body: string;
}

export type Headers = Record<string, string>;

export interface StompHeaders {
    login: string;
    passcode: string;
    host?: string | undefined;
}

export type ConnectCallback = (frame?: Frame) => any;
export type ErrorCallback = (error: Frame | string) => any;
export type SubscribeCallback = (frame?: Frame) => any;
export type CloseCallback = AnyFunction;
export type DisconnectCallback = AnyFunction;


export interface StompClientProps {
    onConnect: ConnectCallback,
    onSubscribe: SubscribeCallback
    onClose: CloseCallback
    onError: ErrorCallback
    onDisconnect: DisconnectCallback
}