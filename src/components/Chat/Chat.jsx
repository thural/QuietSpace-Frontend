import { Box, Text } from "@mantine/core";
import styles from "./styles/contactStyles";
import { useQueryClient } from "@tanstack/react-query";
import { useChatStore } from "../../hooks/zustand";
import UserAvatar from "../Shared/UserAvatar";

const Chat = ({ chat }) => {

    const classes = styles();

    const { setActiveChatId } = useChatStore();
    const queryClient = useQueryClient();
    const user = queryClient.getQueryData(["user"]);


    const contactId = chat.userIds.find(userId => userId !== user.id);
    const username = chat.members[0]["username"];
    const recentText = chat.recentMessage ? chat.recentMessage.text : "chat is empty";

    const handleClick = () => {
        setActiveChatId(chat.id);
    }



    const isNotseen = !chat?.recentMessage?.isSeen && chat?.recentMessage?.senderId !== user.id;
    const appliedStyle = isNotseen ? { fontWeight: 500 } : {}

    return (
        <Box id={contactId} className={classes.contact} onClick={handleClick} >
            <UserAvatar chars={username.charAt(0).toUpperCase()} />
            <Box className={classes.text} style={appliedStyle}>
                <Text size="sm" lineClamp={1}>{username}</Text>
                <Text size="xs" lineClamp={1}>{recentText}</Text>
            </Box>
        </Box>
    )
}

export default Chat