import React, { useEffect } from "react";
import MessageContainer from "../../components/Chat/MessageContainer";
import ContactContainer from "../../components/Chat/ContactContainer";
import styles from "./styles/chatPageStyles";
import { useQueryClient } from "@tanstack/react-query";
import { Container, LoadingOverlay } from "@mantine/core";
import { useGetChats } from "../../hooks/useChatData";
import { useChatStore } from "../../hooks/zustand";

const ChatPage = () => {

    const queryClient = useQueryClient();
    const user = queryClient.getQueryData(["user"]);
    const { data: chats, isLoading, isError, isSuccess } = useGetChats(user.id);

    const { data: chatDataFromStore } = useChatStore();
    const activeChatId = chatDataFromStore.activeChatId;
    const { setActiveChatId } = useChatStore();


    useEffect(
        () => {
            console.log("chat state on useEffect: ", chats);
            const initialState = chats?.length > 0 ? chats[0]["id"] : null;
            setActiveChatId(initialState);
            console.log("activeChatId on initial state setup: ", activeChatId);
        }, [isLoading]
    )


    const classes = styles();


    return (
        <Container className={classes.container} size="600px" >
            {isLoading && <LoadingOverlay visible={true} overlayProps={{ radius: "sm", blur: 2 }} />}
            {isError && <h1>{'Could not fetch chat data! 🔥'}</h1>}
            {isSuccess &&
                <>
                    <ContactContainer />
                    <MessageContainer />
                </>
            }
        </Container>
    )
}

export default ChatPage