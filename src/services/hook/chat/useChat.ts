import { ResId } from "@/api/schemas/inferred/common";
import { useDeleteChat, useGetChats, useGetMessagesByChatId } from "@/services/data/useChatData";
import { useAuthStore } from "@/services/store/zustand";
import { useChatMessaging } from "./useChatMessaging";
import useFormInput from "../shared/useFormInput";

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

    const { value: text, handleChange: handleInputChange, setValue: setText } = useFormInput('');

    const handeSendMessgae = () => {
        if (!recipientId) throw new Error("recipientId is undefined");

        sendMessage({
            recipientId,
            text
        });

        setText('');
    };

    const deleteChat = useDeleteChat(chatId);
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