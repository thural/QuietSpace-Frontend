import { ResId } from "@/api/schemas/inferred/common";
import { useDeleteChat, useGetChats, useGetMessagesByChatId } from "@/services/data/useChatData";
import { useAuthStore } from "@/services/store/zustand";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { useChatMessaging } from "./useChatMessaging";

export const useChat = (chatId: ResId) => {
    const { data: { userId: senderId } } = useAuthStore();
    const { sendMessage, isClientConnected } = useChatMessaging();

    const chats = useGetChats();
    const currentChat = chats.data?.find(chat => chat.id === chatId);
    if (currentChat === undefined) throw new Error("currentChat is undefined");

    const { username: recipientName, id: recipientId } =
        currentChat.members.find(member => member.id !== senderId) || {};

    const {
        data: messages,
        isError,
        isLoading,
        isSuccess,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage
    } = useGetMessagesByChatId(chatId);

    const [text, setText] = useState<string>("");

    const handleInputChange = useCallback((value: string) => {
        setText(value);
    }, []);

    const handeSendMessgae = () => {
        if (!recipientId) throw new Error("recipientId is undefined");
        sendMessage({ recipientId, text });
        console.log("message sent: ", { recipientId, text })
        setText('');
    };

    const queryClient = useQueryClient();

    const onSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ["chats"] })
            .then(() => console.log("chat cache was invalidated"));
    }

    const onError = (error: Error) => {
        console.log("error on deleting chat: ", error.message);
    }

    const deleteChat = useDeleteChat({ chatId, onSuccess, onError });
    const handleDeleteChat = (event: React.ChangeEvent) => {
        event.preventDefault();
        deleteChat.mutate();
    };

    const isInputEnabled: boolean = isSuccess && !!isClientConnected;

    return {
        text,
        chats,
        recipientName,
        recipientId,
        signedUserId: senderId,
        messages,
        messageList: messages,
        messageCount: messages?.length,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
        isError,
        isLoading,
        isInputEnabled,
        handeSendMessgae,
        handleInputChange,
        handleDeleteChat,
    };
};