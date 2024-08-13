import React, { useEffect, useState } from "react";
import Message from "./Message";
import { Avatar, Flex, Text, Title } from "@mantine/core";
import InputEmoji from "react-input-emoji";
import styles from "./styles/messageContainerStyles";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteChat, useGetChatById, useGetMessagesByChatId, usePostNewMessage } from "../../hooks/useChatData";
import { useAuthStore, useChatStore } from "../../hooks/zustand";
import ChatMenu from "./ChatMenu";
import { generatePfp } from "../../utils/randomPfp";


const MessageContainer = () => {

    const { data: { activeChatId }, setActiveChatId } = useChatStore();
    const { data: storeUserData } = useAuthStore();

    console.log("ACTIVE CHAT ID: ", activeChatId);

    const queryClient = useQueryClient();
    const chats = queryClient.getQueryData(["chats"]);
    const currentChat = queryClient.getQueryData(["chats"], { id: activeChatId }).find(chat => chat.id === activeChatId);
    // TODO: optimize current chat retrieval
    const receiverName = currentChat?.members[0].username;
    console.log("CURRENT CHAT in message container: ", receiverName);

    if (!chats.length) return <Text style={{ margin: "1rem" }} ta="center">there's no messages yet</Text>

    useEffect(() => {
        setActiveChatId(chats[0]["id"]);
    }, []);

    const [inputData, setInputData] = useState({
        chatId: activeChatId,
        senderId: storeUserData.userId,
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
            <Flex className={classes.chatHeadline}>
                <Avatar color="black" radius="10rem" src={generatePfp("marble")}>{receiverName?.charAt(0).toUpperCase()}</Avatar>
                <Title className="title" order={5}>{receiverName}</Title>
                <ChatMenu handleDeletePost={handleDeleteChat} isMutable={true} />
            </Flex>
            {isLoading ? (<Text className="system-message" ta="center">loading messages ...</Text>) :
                isError ? (<Text className="system-message" ta="center">error loading messages</Text>) :
                    activeChatId === null ? (<Text className="system-message" ta="center">you have no messages yet</Text>) :
                        messages.length === 0 ? (
                            <Text className="system-message" ta="center">{`send your first message to `}<strong>{receiverName}</strong></Text>) :
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