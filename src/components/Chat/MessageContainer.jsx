import React, { useState } from "react";
import Message from "./Message";
import { Text } from "@mantine/core";
import InputEmoji from "react-input-emoji";
import styles from "./styles/messageContainerStyles";
import { useQueryClient } from "@tanstack/react-query";
import { useGetMessagesByChatId, usePostNewMessage } from "../../hooks/useChatData";
import { authStore } from "../../hooks/zustand";


const MessageContainer = ({ currentChatId }) => {

    const { data: authData } = authStore();
    const queryClient = useQueryClient();
    const chats = queryClient.getQueryData(["chats"]);

    const senderId = authData.userId;
    const currentChat = chats?.find(chat => chat.id === currentChatId);

    const [messageData, setMessageData] = useState({ chatId: currentChatId, senderId, text: '' });

    const { data: messages, isError, isLoading, isSuccess } = useGetMessagesByChatId(currentChatId);

    const handleInputChange = (event) => {
        setMessageData({ ...messageData, text: event });
    }

    const newMessageMutation = usePostNewMessage(messageData, setMessageData);

    const handleSubmit = () => {
        if (messageData.text.length === 0) return;
        newMessageMutation.mutate();
    }

    const classes = styles();

    return (
        <div className={classes.chatboard}>
            {isLoading ? (<Text className="system-message" ta="center">loading messages ...</Text>) :
                isError ? (<Text className="system-message" ta="center">error loading messages</Text>) :
                    currentChatId === null ? (<Text className="system-message" ta="center">you have no messages yet</Text>) :
                        messages.length === 0 ? (
                            <Text className="system-message" ta="center">{`send your first message to ${currentChat.users[1].username}`}</Text>) :
                            (
                                <div className={classes.messages}>
                                    {
                                        messages?.map(message =>
                                            <Message
                                                key={message.id}
                                                message={message}
                                                currentChatId={currentChatId}
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
                        value={messageData.text}
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