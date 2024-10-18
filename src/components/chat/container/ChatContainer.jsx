import { useGetChatsByUserId } from "@hooks/useChatData";
import { useChatStore } from "@hooks/zustand";
import DefaultContainer from "@shared/DefaultContainer";
import FullLoadingOverlay from "@shared/FullLoadingOverlay";
import Typography from "@shared/Typography";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import ChatPanel from "../components/message/panel/ChatPanel"
import ChatSidebar from "../components/sidebar/panel/ChatSidebar"
import styles from "./styles/chatContainerStyles";

const ChatContainer = () => {

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
            <ChatSidebar className={classes.contacts} />
            <ChatPanel className={classes.messages} />
        </DefaultContainer>
    )
}

export default ChatContainer