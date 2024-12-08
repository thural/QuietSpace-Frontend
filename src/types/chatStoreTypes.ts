import { MessageRequest } from "@/api/schemas/inferred/chat";
import { ResId } from "@/api/schemas/inferred/common";

export type ActiveChatId = ResId | null;

export interface ChatClientMethods {
    sendChatMessage: (inputData: MessageRequest) => void;
    deleteChatMessage: (messageId: ResId) => void;
    setMessageSeen: (messageId: ResId) => void;
    isClientConnected: boolean | undefined;
}

export interface ChatStoreProps {
    data: {
        activeChatId: ActiveChatId;
        messageInput: Record<string, string>;
    };
    clientMethods: ChatClientMethods;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    setActiveChatId: (activeChatId: ActiveChatId) => void;
    setMessageInput: (messageInput: Record<string, string>) => void;
    setClientMethods: (methods: ChatClientMethods) => void;
    setIsLoading: (isLoading: boolean) => void;
    setIsError: (isError: boolean) => void;
    setError: (error: Error) => void;
}