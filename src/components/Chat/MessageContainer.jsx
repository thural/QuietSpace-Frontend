import React, { useMemo, useState } from "react";
import Message from "./Message";
import InputEmoji from "react-input-emoji";
import styles from "./styles/messageContainerStyles";
import ChatMenu from "./ChatMenu";

import { Avatar, Flex, Text, Title } from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteChat, useGetMessagesByChatId } from "../../hooks/useChatData";
import { useAuthStore, useChatStore } from "../../hooks/zustand";
import { toUpperFirstChar } from "../../utils/stringUtils";

const MessageContainer = () => {

    const queryClient = useQueryClient();
    const { data: { userId } } = useAuthStore();
    const chats = queryClient.getQueryData(["chats"]);
    if (!chats?.length) return null;
    const { data: { activeChatId }, clientMethods } = useChatStore();
    const deleteChat = useDeleteChat(activeChatId);


    const currentChat = chats.find(chat => chat.id === activeChatId);
    const { username: recipientName, id: recipientId } = currentChat?.members[0];
    const { data: messages, isError, isLoading, isSuccess } = useGetMessagesByChatId(activeChatId);
    const { sendChatMessage, deleteChatMessage, setMessageSeen, isClientConnected } = clientMethods;



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
        deleteChat.mutate();
    }

    const enabled = useMemo(() => (isSuccess && isClientConnected), [isSuccess, isClientConnected]);



    const classes = styles();

    const MessagesList = ({ messages, deleteChatMessage, setMessageSeen, isClientConnected }) => (
        <div className={classes.messages}>
            {messages.map(message => (
                <Message
                    key={message.id}
                    message={message}
                    handleDeleteMessage={() => deleteChatMessage(message.id)}
                    setMessageSeen={setMessageSeen}
                    isClientConnected={isClientConnected}
                />
            ))}
        </div>
    );

    if (!chats.length) return <Text style={{ margin: "1rem" }} ta="center">there's no messages yet</Text>
    if (isLoading) return <Text className="system-message" ta="center">loading messages ...</Text>;
    if (isError) return <Text className="system-message" ta="center">error loading messages</Text>;
    if (activeChatId === null) return <Text className="system-message" ta="center">you have no messages yet</Text>;
    if (messages.length === 0) {
        return <Text className="system-message" ta="center">{`send your first message to `}<strong>{recipientName}</strong></Text>;
    }

    return (
        <div className={classes.chatboard}>

            <Flex className={classes.chatHeadline}>
                <Avatar color="black" radius="10rem">{toUpperFirstChar(recipientName)}</Avatar>
                <Title className="title" order={5}>{recipientName}</Title>
                <ChatMenu handleDeleteChat={handleDeleteChat} isMutable={true} />
            </Flex>

            <MessagesList
                messages={messages}
                deleteChatMessage={deleteChatMessage}
                setMessageSeen={setMessageSeen}
                isClientConnected={isClientConnected}
            />

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
                        onEnter={() => sendChatMessage(inputData)}
                        theme="light"
                        placeholder="write a message"
                        enabled={enabled}
                    />
                </form>
            </div>
        </div>
    )
}

export default MessageContainer