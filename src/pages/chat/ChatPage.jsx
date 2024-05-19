import React from "react";
import MessageContainer from "../../components/Chat/MessageContainer";
import ChatContainer from "../../components/Chat/ChatContainer";
import styles from "./styles/chatPageStyles";
import { useQueryClient } from "@tanstack/react-query";
import { Container, LoadingOverlay } from "@mantine/core";
import { useGetChatsByUserId } from "../../hooks/useChatData";

const ChatPage = () => {

    const queryClient = useQueryClient();
    const user = queryClient.getQueryData(["user"]);
    const { isLoading, isError, isSuccess } = useGetChatsByUserId(user.id);



    const classes = styles();

    return (
        <Container className={classes.container} size="600px" >
            {isLoading && <LoadingOverlay visible={true} overlayProps={{ radius: "sm", blur: 2 }} />}
            {isError && <h1>{'Could not fetch chat data! 🔥'}</h1>}
            {isSuccess &&
                <>
                    <ChatContainer />
                    <MessageContainer />
                </>
            }
        </Container>
    )
}

export default ChatPage