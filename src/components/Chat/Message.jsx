import React, { useEffect, useState } from "react";
import styles from "./styles/messageStyles";
import { useQueryClient } from "@tanstack/react-query";
import useWasSeen from "../../hooks/useWasSeen";

const Message = ({ message, handleDeleteMessage, setMessageSeen, isClientConnected }) => {

    const classes = styles();

    const { id, senderId, text } = message;
    const queryClient = useQueryClient();
    const user = queryClient.getQueryData(["user"]);
    const [isHovering, setIsHovering] = useState(false);
    const [wasSeen, ref] = useWasSeen();

    const appliedStyle = senderId !== user.id ? {
        marginRight: "auto",
        borderRadius: '1.25rem 1.25rem 1.25rem 0rem',
    } : {
        marginLeft: "auto",
        color: "white",
        borderColor: "blue",
        backgroundColor: "#3c3cff",
        borderRadius: '1rem 1rem 0rem 1rem'
    };

    const handleMouseOver = () => {
        setIsHovering(true);
    };

    const handleMouseOut = () => {
        setIsHovering(false);
    };

    const handleSeenMessage = () => {
        if (!isClientConnected || message.senderId === user.id) return;
        if (message.isSeen || !wasSeen) return;
        setMessageSeen(id);
    };

    useEffect(handleSeenMessage, [wasSeen, isClientConnected]);


    return (
        <div id={id} ref={ref} className={classes.message}
            style={appliedStyle}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}>
            {
                senderId === user.id && isHovering &&
                <div className={classes.delete} onClick={handleDeleteMessage}>delete</div>
            }
            <div className={classes.text}><p>{text}</p></div>
        </div>
    )
}

export default Message