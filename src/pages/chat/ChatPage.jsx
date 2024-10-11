import { Container } from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import ChatContainer from "../../components/Chat/ChatContainer";
import MessageContainer from "../../components/Chat/MessageContainer";
import FullLoadingOverlay from "../../components/Shared/FillLoadingOverlay";
import { useGetChatsByUserId } from "../../hooks/useChatData";
import { useChatStore } from "../../hooks/zustand";
import styles from "./styles/chatPageStyles";

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



    if (isLoading) return <FullLoadingOverlay />;
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