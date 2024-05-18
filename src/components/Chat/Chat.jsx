import {Avatar, Box, Text} from "@mantine/core";
import styles from "./styles/contactStyles";
import { useQueryClient } from "@tanstack/react-query";
import { useChatStore } from "../../hooks/zustand";
import { generatePfp } from "../../utils/randomPfp";
import { useMemo } from "react";
import {useGetUserById} from "../../hooks/useUserData";
import {useGetMessagesByChatId} from "../../hooks/useChatData";

const Chat = ({ chat }) => {

    const { setActiveChatId } = useChatStore();
    const queryClient = useQueryClient();
    const user = queryClient.getQueryData(["user"])
    const chats = queryClient.getQueryData(["chats"]);

    const contactId = chat.userIds.find(userId => userId !== user.id);

    const { data: userData,
            isLoading: isUserLoading,
            isSuccess: isUserSuccess,
            refetch: refetchUser,
            isError: isUserError
    } = useGetUserById(contactId);

    const messages = useGetMessagesByChatId(chat.id).data;

    // const chatOfThisContact = useMemo(async () => {
    //     console.log("chat of this contact was computed");
    //     const foundChat = chats?.find(chat => chat.userIds.some(userId => userId === contactId));
    //     return await useGetChatById(foundChat.id).data;
    // }, [chats]);

    const recentText = useMemo(() => {
        if(!messages) return "";
        console.log("chat of this text was computed");
        return Array.from(messages).pop()?.text;
    }, [messages]);

    const generatedPfpLink = useMemo(() => generatePfp("beam"), [chats]);

    const handleClick = () => {
        setActiveChatId(chat.id);
    }

    const classes = styles();

    if (isUserLoading) return <p>user is loading ...</p>

    return (
        <Box id={contactId} className={classes.contact} onClick={handleClick} >
            <Avatar
                color="black"
                size="2.5rem"
                radius="10rem"
                src={generatedPfpLink}>
                {userData.username[0].toUpperCase()}
            </Avatar>
            <Box className={classes.text}>
                <Text size="sm" lineClamp={1}>{recentText ? recentText : "chat is empty"}</Text>
                <Text size="xs" lineClamp={1}>seen 1 day ago</Text>
            </Box>
        </Box>
    )
}

export default Chat