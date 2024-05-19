import React, { useState } from "react";
import Message from "./Message";
import { Text } from "@mantine/core";
import InputEmoji from "react-input-emoji";
import styles from "./styles/messageContainerStyles";
import { useQueryClient } from "@tanstack/react-query";
import { useGetMessagesByChatId, usePostNewMessage } from "../../hooks/useChatData";
import {useAuthStore, useChatStore} from "../../hooks/zustand";


const MessageContainer = () => {

    const { data: storeChatData } = useChatStore();
    const { data: storeUserData} = useAuthStore();

    const activeChatId = storeChatData.activeChatId;

    const queryClient = useQueryClient();
    const currentChat = queryClient.getQueryData(["chats"], {id: activeChatId})[0];
    const receiverUser = currentChat.members[0];

    const [inputData, setInputData] = useState({
        chatId: activeChatId,
        senderId: storeUserData.userId,
        text: ''
    });

    const handleInputChange = (event) => {
        setInputData({ ...inputData, text: event });
    }

    const sendMessage = usePostNewMessage(setInputData);

    const handleSubmit = () => {
        console.log("message data on submit: ", inputData);
        if (inputData.text.length === 0) return;
        inputData.chatId = activeChatId;
        sendMessage.mutate(inputData);
    }

    const { data: messages, isError, isLoading, isSuccess, refetch } = useGetMessagesByChatId(activeChatId);

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
                        value={inputData.text}
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