import React from "react";
import styles from "./styles/contactStyles";
import UserAvatar from "../Shared/UserAvatar";
import useChat from "./hooks/useChat";
import { Box, Text } from "@mantine/core";
import { toUpperFirstChar } from "../../utils/stringUtils";

const Chat = ({ chat }) => {
    const classes = styles();
    const {
        contactId,
        username,
        recentText,
        handleClick,
        appliedStyle,
    } = useChat(chat);

    return (
        <Box id={contactId} className={classes.contact} onClick={handleClick}>
            <UserAvatar chars={toUpperFirstChar(username)} />
            <Box className={classes.text} style={appliedStyle}>
                <Text size="sm" lineClamp={1}>{username}</Text>
                <Text size="xs" lineClamp={1}>{recentText}</Text>
            </Box>
        </Box>
    );
};

export default Chat;