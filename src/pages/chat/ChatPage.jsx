import React, { useEffect, useState } from "react";
import MessageContainer from "../../components/Chat/MessageContainer";
import ContactContainer from "../../components/Chat/ContactContainer";
import styles from "./styles/chatPageStyles";
import { useQueryClient } from "@tanstack/react-query";
import { Container } from "@mantine/core";
import { useGetChats } from "../../hooks/useChatData";

const ChatPage = () => {

    const queryClient = useQueryClient();
    const user = queryClient.getQueryData(["user"]);
    const chatsQuery = useGetChats(user.id);

    const chats = chatsQuery.data;

    const initialState = chats?.length > 0 ? chats[0]["id"] : null;
    const [currentChatId, setCurrentChatId] = useState(initialState);

    const classes = styles();

    return (
        <Container className={classes.container} size="600px" >
            {chatsQuery.isLoading && <h1>Loading...</h1>}
            {chatsQuery.isError && <h1>{'Could not fetch chat data! 🔥'}</h1>}
            {chatsQuery.isSuccess &&
                <>
                    <ContactContainer
                        currentChatId={currentChatId}
                        setCurrentChatId={setCurrentChatId}
                    />
                    <MessageContainer
                        currentChatId={currentChatId}
                        setCurrentChatId={setCurrentChatId}
                    />
                </>
            }
        </Container>
    )
}

export default ChatPage