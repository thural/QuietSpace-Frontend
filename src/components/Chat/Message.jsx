import React from "react";
import BoxStyled from "../Shared/BoxStyled";
import Conditional from "../Shared/Conditional";
import useMessage from "./hooks/useMessage";
import styles from "./styles/messageStyles";

const Message = ({ message, handleDeleteMessage, setMessageSeen, isClientConnected }) => {

    const classes = styles();

    const {
        user,
        isHovering,
        setIsHovering,
        wasSeen,
        ref,
        appliedStyle,
        handleMouseOver,
        handleMouseOut,
    } = useMessage(message, setMessageSeen, isClientConnected);

    return (
        <BoxStyled id={message.id} ref={ref} className={classes.message}
            style={appliedStyle}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
        >
            <Conditional isEnabled={message.senderId === user.id && isHovering}>
                <BoxStyled className={classes.delete} onClick={handleDeleteMessage}>delete</BoxStyled>
            </Conditional>
            <BoxStyled className={classes.text}><p>{message.text}</p></BoxStyled>
        </BoxStyled>
    );
};

export default Message;