import React, { useEffect, useState } from "react";
import Message from "./Message";
import { Text } from "@mantine/core";
import InputEmoji from "react-input-emoji";
import styles from "./styles/messageContainerStyles";
import { useQueryClient } from "@tanstack/react-query";
import { useGetMessagesByChatId, usePostNewMessage } from "../../hooks/useChatData";
import { authStore, useChatStore } from "../../hooks/zustand";


const MessageContainer = () => {

    const { data: storeAuthData } = authStore();
    const { data: storeChatData } = useChatStore();
    const activeChatId = storeChatData.activeChatId;
    const queryClient = useQueryClient();
    const chats = queryClient.getQueryData(["chats"]);
    const selectedChatId = activeChatId === null ? chats[0]["id"] : activeChatId;

    console.log("ACTIVE CHAT ID: ", activeChatId)

    const senderId = storeAuthData.userId;
    const currentChat = chats?.find(chat => chat.id === selectedChatId); //TODO: optimize by accessing cache

    const receiverId = currentChat.userIds.find(userId => userId !== senderId);

    const receiverUser = queryClient.getQueryData(["users", {id:receiverId}])

    console.log("receiver user: ", receiverUser);

    const [messageInputData, setMessageInputData] = useState({ chatId: activeChatId, senderId, text: '' });

    const { data: messages, isError, isLoading, isSuccess, refetch } = useGetMessagesByChatId(activeChatId);

    const newMessageMutation = usePostNewMessage(setMessageInputData);

    const handleInputChange = (event) => {
        setMessageInputData({ ...messageInputData, text: event });
    }

    const handleSubmit = () => {
        console.log("message data on submit: ", messageInputData);
        if (messageInputData.text.length === 0) return;
        messageInputData.chatId = activeChatId;
        newMessageMutation.mutate(messageInputData);
    }

    const classes = styles();

    return (
        <div className={classes.chatboard}>
            {isLoading ? (<Text className="system-message" ta="center">loading messages ...</Text>) :
                isError ? (<Text className="system-message" ta="center">error loading messages</Text>) :
                    activeChatId === null ? (<Text className="system-message" ta="center">you have no messages yet</Text>) :
                        messages.length === 0 ? (
                            <Text className="system-message" ta="center">{`send your first message to ${receiverUser.username}`}</Text>) :
                            (
                                <div className={classes.messages}>
                                    {
                                        messages?.map(message =>
                                            <Message
                                                key={message.id}
                                                message={message}
                                            />
                                        )
                                    }
                                </div>
                            )
            }

            <div className={classes.inputSection}>
                <form className={classes.chatInput}>
                    <InputEmoji
                        className={classes.messageInput}
                        value={messageInputData.text}
                        onChange={handleInputChange}
                        fontSize={15}
                        maxLength="128"
                        cleanOnEnter
                        buttonElement
                        borderColor="#FFFFFF"
                        onEnter={handleSubmit}
                        theme="light"
                        placeholder="write a message"
                        enabled={isSuccess}
                    />
                </form>
            </div>
        </div>
    )
}

export default MessageContainer