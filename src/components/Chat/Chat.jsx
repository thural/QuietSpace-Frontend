import React from "react";
import { toUpperFirstChar } from "../../utils/stringUtils";
import BoxStyled from "../Shared/BoxStyled";
import Typography from "../Shared/Typography";
import UserAvatar from "../Shared/UserAvatar";
import useChat from "./hooks/useChat";
import styles from "./styles/contactStyles";

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
        <BoxStyled id={contactId} className={classes.contact} onClick={handleClick}>
            <UserAvatar chars={toUpperFirstChar(username)} />
            <BoxStyled className={classes.text} style={appliedStyle}>
                <Typography size="sm" lineClamp={1}>{username}</Typography>
                <Typography size="xs" lineClamp={1}>{recentText}</Typography>
            </BoxStyled>
        </BoxStyled>
    );
};

export default Chat;