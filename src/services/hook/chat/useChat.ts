import { ResId } from "@/api/schemas/inferred/common";
import { useDeleteChat, useGetChats, useGetMessagesByChatId } from "@/services/data/useChatData";
import { useAuthStore } from "@/services/store/zustand";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { useChatMessaging } from "./useChatMessaging";

/**
 * Custom hook to manage chat functionality.
 * 
 * @param {ResId} chatId - The ID of the chat to manage.
 * @returns {Object} - An object containing chat-related data and methods.
 * @returns {string} text - The current message text.
 * @returns {Object} chats - The list of chats.
 * @returns {string} recipientName - The name of the chat recipient.
 * @returns {ResId} recipientId - The ID of the chat recipient.
 * @returns {ResId} signedUserId - The ID of the signed-in user.
 * @returns {Array} messages - The list of messages in the current chat.
 * @returns {Array} messageList - The list of messages (alias for messages).
 * @returns {number} messageCount - The number of messages.
 * @returns {boolean} hasNextPage - Indicates if there are more messages to fetch.
 * @returns {boolean} isFetchingNextPage - Indicates if more messages are being fetched.
 * @returns {function} fetchNextPage - Function to fetch the next page of messages.
 * @returns {boolean} isError - Indicates if there was an error in fetching messages.
 * @returns {boolean} isLoading - Indicates if messages are currently being loaded.
 * @returns {boolean} isInputEnabled - Indicates if the input is enabled for sending messages.
 * @returns {function} handeSendMessgae - Function to handle sending a message.
 * @returns {function} handleInputChange - Function to handle changes in the message input.
 * @returns {function} handleDeleteChat - Function to handle deleting the current chat.
 */

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

    /**
     * Handles input changes by updating the message text state.
     * @param {string} value - The new value of the input.
     */
    const handleInputChange = useCallback((value: string) => {
        setText(value);
    }, []);

    /**
     * Sends a message to the recipient.
     * @throws {Error} If recipientId is undefined.
     */
    const handeSendMessgae = () => {
        if (!recipientId) throw new Error("recipientId is undefined");
        sendMessage({ recipientId, text });
        console.log("message sent: ", { recipientId, text })
        setText('');
    };

    const queryClient = useQueryClient();

    /**
     * Callback for successful chat deletion.
     */
    const onSuccess = (_data?: Response, _variables?: void) => {
        queryClient.invalidateQueries({ queryKey: ["chats"] })
            .then(() => console.log("chat cache was invalidated"));
    }

    /**
     * Callback for handling errors during chat deletion.
     * @param {Error} error - The error that occurred.
     */
    const onError = (error: Error) => {
        console.log("error on deleting chat: ", error.message);
    }

    const deleteChat = useDeleteChat({ chatId, onSuccess, onError });

    /**
     * Handles the deletion of the current chat.
     * @param {React.ChangeEvent} event - The event triggered by the form submission.
     */
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