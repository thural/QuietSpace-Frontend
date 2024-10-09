import React, { useEffect } from "react";
import MessageContainer from "../../components/Chat/MessageContainer";
import ChatContainer from "../../components/Chat/ChatContainer";
import styles from "./styles/chatPageStyles";
import { useQueryClient } from "@tanstack/react-query";
import { Container, LoadingOverlay } from "@mantine/core";
import { useGetChatsByUserId } from "../../hooks/useChatData";
import { useChatStore } from "../../hooks/zustand";

const ChatPage = () => {

    const classes = styles();

    const queryClient = useQueryClient();
    const user = queryClient.getQueryData(["user"]);
    const chats = queryClient.getQueryData(["chats"]);
    const { data: { activeChatId }, setActiveChatId } = useChatStore();
    const { isLoading, isError, isSuccess } = useGetChatsByUserId(user.id);


    useEffect(() => {
        if (!isSuccess || activeChatId !== null) return;
        const firstChatId = chats[0]?.id;
        setActiveChatId(firstChatId);
    }, [chats]);


    if (isLoading) return <LoadingOverlay visible={true} overlayProps={{ radius: "sm", blur: 2 }} />;
    if (isError) return <h1>{'Could not fetch chat data! 🔥'}</h1>
    if ((!isSuccess || activeChatId == null)) return null;


    return (
        <Container className={classes.container} size="600px" >
            <ChatContainer />
            <MessageContainer />
        </Container>
    )
}

export default ChatPage