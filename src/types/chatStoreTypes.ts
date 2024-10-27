import { ResId } from "@/api/schemas/inferred/common";

export type ActiveChatId = ResId | null;

export interface ChatStoreProps {
    data: {
        activeChatId: ActiveChatId;
        messageInput: Record<string, string>;
    };
    clientMethods: Record<string, Function>;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    setActiveChatId: (activeChatId: ActiveChatId) => void;
    setMessageInput: (messageInput: Record<string, string>) => void;
    setClientMethods: (methods: Record<string, Function>) => void;
    setIsLoading: (isLoading: boolean) => void;
    setIsError: (isError: boolean) => void;
    setError: (error: Error) => void;
}