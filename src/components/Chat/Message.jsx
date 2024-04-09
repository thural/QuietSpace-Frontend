import React, { useState } from "react";
import styles from "./styles/messageStyles";

import { useQueryClient } from "@tanstack/react-query";
import { useDeleteMessage } from "../../hooks/useChatData";
import { useChatStore } from "../../hooks/zustand";

const Message = ({ message }) => {

    const { id, senderId, text } = message;

    const queryClient = useQueryClient();
    const user = queryClient.getQueryData(["user"]);

    const { data: storeChatData } = useChatStore();
    const activeChatId = storeChatData.activeChatId;

    const deleteMessageMutation = useDeleteMessage(activeChatId);

    const [isHovering, setIsHovering] = useState(false);


    const handleMouseOver = () => {
        setIsHovering(true);
    };

    const handleMouseOut = () => {
        setIsHovering(false);
    };

    const handleDeleteMessage = async () => {
        deleteMessageMutation.mutate(id);
    }


    const appliedStyle = senderId !== user.id ? { marginRight: "auto",
     borderRadius: '1.25rem 1.25rem 1.25rem 0rem',
     } : {
        marginLeft: "auto",
        color: "white",
        borderColor: "blue",
        backgroundColor: "#3c3cff",
        borderRadius: '1rem 1rem 0rem 1rem'
    };


    const classes = styles();

    return (
        <div id={id} className={classes.message}
            style={appliedStyle}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}>
            {
                senderId === user.id && isHovering &&
                <>
                    <div className={classes.delete} onClick={handleDeleteMessage}>delete</div>
                </>
            }
            <div className={classes.text}><p>{text}</p></div>
        </div>
    )
}

export default Message