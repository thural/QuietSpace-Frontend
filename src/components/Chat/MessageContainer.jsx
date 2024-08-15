import React, { useEffect, useState } from "react";
import Message from "./Message";
import InputEmoji from "react-input-emoji";
import styles from "./styles/messageContainerStyles";
import ChatMenu from "./ChatMenu";

import { Avatar, Flex, Text, Title } from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteChat, useGetMessagesByChatId } from "../../hooks/useChatData";
import { useAuthStore, useChatStore } from "../../hooks/zustand";
import { generatePfp } from "../../utils/randomPfp";
import { useStompClient } from "../../hooks/useStompClient";
import { ChatEventType } from "../../utils/enumClasses";

import {
    handleChatDelete,
    handleChatException,
    handleDeleteMessage,
    handleLeftChat,
    handleOnlineUser,
    handleSeenMessage
} from "./misc/messageHandler";


const MessageContainer = () => {

    const queryClient = useQueryClient();



    const { data: { activeChatId } } = useChatStore();
    console.log("active chat id: ", activeChatId);
    const { data: { userId } } = useAuthStore();
    const user = queryClient.getQueryData(["user"]);
    console.log("current user", user);
    const chats = queryClient.getQueryData(["chats"]);
    console.log("loaded chats: ", chats);



    if (activeChatId === null) return (<Text className="system-message" ta="center">loading messages ...</Text>)
    const { data: messages, isError, isLoading, isSuccess, refetch } = useGetMessagesByChatId(activeChatId);
    const currentChat = chats.find(chat => chat.id === activeChatId);
    console.log("current chat: ", currentChat);
    const chatMembers = currentChat?.members[0];
    console.log("chat members: ", chatMembers);
    const { username: recipientName, id: recipientId } = currentChat?.members[0];
    console.log("CURRENT CHAT in message container: ", recipientName);



    const [inputData, setInputData] = useState({
        chatId: activeChatId,
        senderId: userId,
        recipientId,
        text: ''
    });

    const handleInputChange = (event) => {
        setInputData({ ...inputData, text: event });
    }

    const handleDeleteChat = (event) => {
        event.preventDefault();
        console.log("delete chat was clicked");
        useDeleteChat(activeChatId).mutate();
    }

    const handleReceivedMessage = (message) => {
        const messageBody = JSON.parse(message.body);

        queryClient.setQueryData(['messages', { id: activeChatId }], (oldData) => {
            return { ...oldData, content: [messageBody, ...oldData.content] };
        });
    }



    const onSubscribe = (message) => {
        console.log("message on subscription:", message);

        const {
            EXCEPTION,
            CONNECT,
            DISCONNECT,
            DELETE,
            DELETE_MESSAGE,
            SEEN_MESSAGE,
            LEFT_CHAT
        } = ChatEventType;

        switch (message.type) {
            case CONNECT:
                return handleOnlineUser(message);
            case DISCONNECT:
                return handleOnlineUser(message);
            case DELETE:
                return handleChatDelete(message);
            case DELETE_MESSAGE:
                return handleDeleteMessage(message);
            case SEEN_MESSAGE:
                return handleSeenMessage(message);
            case LEFT_CHAT:
                return handleLeftChat(message);
            case EXCEPTION:
                return handleChatException(message);
            default:
                return handleReceivedMessage(message);
        }
    }



    const {
        disconnect,
        subscribe,
        subscribeWithId,
        unSubscribe,
        sendMessage,
        setAutoReconnect,
        isClientConnected,
        isConnecting,
        isDisconnected,
        isError: isSocketError,
        error
    } = useStompClient({ onSubscribe });

    useEffect(() => {
        if (isClientConnected) {
            subscribe(`/user/${user.username}/private/chat/event`);
            subscribe(`/user/${user.username}/private/chat`);
        }
    }, [isClientConnected]);



    const handleSubmit = () => {
        console.log("message data on submit: ", inputData);
        if (inputData.text.length === 0) return;
        inputData.chatId = activeChatId;
        sendMessage("/app/private/chat", inputData);
    }



    const classes = styles();

    if (!chats.length) return <Text style={{ margin: "1rem" }} ta="center">there's no messages yet</Text>

    return (
        <div className={classes.chatboard}>
            <Flex className={classes.chatHeadline}>
                <Avatar color="black" radius="10rem" src={generatePfp("marble")}>{recipientName?.charAt(0).toUpperCase()}</Avatar>
                <Title className="title" order={5}>{recipientName}</Title>
                <ChatMenu handleDeletePost={handleDeleteChat} isMutable={true} />
            </Flex>
            {isLoading ? (<Text className="system-message" ta="center">loading messages ...</Text>) :
                isError ? (<Text className="system-message" ta="center">error loading messages</Text>) :
                    activeChatId === null ? (<Text className="system-message" ta="center">you have no messages yet</Text>) :
                        messages.length === 0 ? (
                            <Text className="system-message" ta="center">{`send your first message to `}<strong>{recipientName}</strong></Text>) :
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