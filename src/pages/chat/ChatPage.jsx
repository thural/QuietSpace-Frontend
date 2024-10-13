import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import ChatContainer from "../../components/Chat/ChatContainer";
import MessageContainer from "../../components/Chat/MessageContainer";
import DefaultContainer from "../../components/Shared/DefaultContainer";
import FullLoadingOverlay from "../../components/Shared/FullLoadingOverlay";
import Typography from "../../components/Shared/Typography";
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
    if (isError) return <Typography type="h1">{'Could not fetch chat data! 🔥'}</Typography>
    if ((!isSuccess || activeChatId == null)) return null;

    return (
        <DefaultContainer className={classes.container}>
            <ChatContainer className={classes.contacts} />
            <MessageContainer className={classes.messages} />
        </DefaultContainer>
    )
}

export default ChatPage