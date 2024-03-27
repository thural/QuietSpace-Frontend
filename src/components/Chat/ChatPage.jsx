import React, { useState } from "react";
import MessageContainer from "./MessageContainer";
import ContactContainer from "./ContactContainer";
import styles from "./styles/chatPageStyles";
import { CHAT_PATH_BY_MEMBER } from "../../constants/ApiPath";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchChats } from "../../api/chatRequests";

const ChatPage = () => {

    const queryClient = useQueryClient();
    const user = queryClient.getQueryData("user");
    const auth = queryClient.getQueryData("auth");
    const chats = queryClient.getQueryData("chats");

    const initialState = chats.length > 0 ? chats[0]["id"] : null;
    const [currentChatId, setCurrentChatId] = useState(initialState);
    const classes = styles();

    const chatsQuery = useQuery({
        queryKey: ["chats"],
        queryFn: async () => {
            const response = await fetchChats(CHAT_PATH_BY_MEMBER, user.id, auth["token"]);
            return response.json();
        },
        enabled: user.id !== null, // if userQuery could fetch the current user
        staleTime: 1000 * 60 * 6, // keep data fresh up to 6 minutes
        refetchInterval: 1000 * 3, // refetch data after 3 minutes on idle
    });

    return (
        <div className={classes.chat}>
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
        </div>
    )
}

export default ChatPage