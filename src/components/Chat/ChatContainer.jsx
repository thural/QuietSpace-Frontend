import { Text } from "@mantine/core";
import Chat from "./Chat";
import styles from "./styles/contactContainerStyles";
import QueryContainer from "./QueryContainer";
import { useQueryClient } from "@tanstack/react-query";
import {useChatStore} from "../../hooks/zustand";
import {useEffect} from "react";

const ChatContainer = () => {

    const queryClient = useQueryClient();
    const chats = queryClient.getQueryData(["chats"]);
    const { setActiveChatId } = useChatStore();

    useEffect(() => {
        setActiveChatId(chats[0]["id"]);
    }, [chats]);


    const classes = styles();
    return (
        <div className={classes.contacts}>
            <QueryContainer />
            {
                (chats?.length > 0) ?
                    chats.map((chat, index) => <Chat key={index} chat={chat}/>)
                    : <Text ta="center">there's no chat yet</Text>
            }
        </div>
    )
}

export default ChatContainer