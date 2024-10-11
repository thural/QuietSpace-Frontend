import React from "react";
import styles from "./styles/messageStyles";
import useMessage from "./hooks/useMessage";
import Conditional from "../Shared/Conditional";

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
        <div id={message.id} ref={ref} className={classes.message}
            style={appliedStyle}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}>
            <Conditional isEnabled={message.senderId === user.id && isHovering}>
                <div className={classes.delete} onClick={handleDeleteMessage}>delete</div>
            </Conditional>
            <div className={classes.text}><p>{message.text}</p></div>
        </div>
    );
};

export default Message;