import { ResId } from "@/api/schemas/inferred/common";

export interface ChatStoreProps {
    data: {
        activeChatId: ResId | null;
        messageInput: Record<string, string>;
    };
    clientMethods: Record<string, Function>;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    setActiveChatId: (activeChatId: string) => void;
    setMessageInput: (messageInput: Record<string, string>) => void;
    setClientMethods: (methods: Record<string, Function>) => void;
    setIsLoading: (isLoading: boolean) => void;
    setIsError: (isError: boolean) => void;
    setError: (error: Error) => void;
}