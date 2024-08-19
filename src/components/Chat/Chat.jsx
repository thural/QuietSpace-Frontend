import { Avatar, Box, Text } from "@mantine/core";
import styles from "./styles/contactStyles";
import { useQueryClient } from "@tanstack/react-query";
import { useChatStore } from "../../hooks/zustand";
import { generatePfp } from "../../utils/randomPfp";

const Chat = ({ chat }) => {

    const { setActiveChatId } = useChatStore();
    const queryClient = useQueryClient();
    const user = queryClient.getQueryData(["user"]);


    const contactId = chat.userIds.find(userId => userId !== user.id);
    const username = chat.members[0]["username"];
    const recentText = chat.recentMessage ? chat.recentMessage.text : "chat is empty";

    const handleClick = () => {
        setActiveChatId(chat.id);
    }



    const appliedStyle = chat.recentMessage.isSeen ? {} : { fontWeight: 500 }
    const generatedPfpLink = generatePfp("beam");
    const classes = styles();

    return (
        <Box id={contactId} className={classes.contact} onClick={handleClick} >
            <Avatar
                color="black"
                size="2.5rem"
                radius="10rem"
                src={generatedPfpLink}>
                {username.charAt(0).toUpperCase()}
            </Avatar>
            <Box className={classes.text} style={appliedStyle}>
                <Text size="sm" lineClamp={1}>{username}</Text>
                <Text size="xs" lineClamp={1}>{recentText}</Text>
            </Box>
        </Box>
    )
}

export default Chat