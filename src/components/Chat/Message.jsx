import React, { useState } from "react";
import styles from "./styles/messageStyles";

import { useQueryClient } from "@tanstack/react-query";
import { useDeleteMessage } from "../../hooks/useChatData";

const Message = ({ message }) => {

    const queryClient = useQueryClient();
    const user = queryClient.getQueryData("user");
    const deleteMessageMutation = useDeleteMessage(id);

    const { id, sender, text } = message;

    const [isHovering, setIsHovering] = useState(false);


    const handleMouseOver = () => {
        setIsHovering(true);
    };

    const handleMouseOut = () => {
        setIsHovering(false);
    };


    const handleDeleteMessage = async () => {
        deleteMessageMutation.mutate();
    }

    const appliedStyle = sender.username !== user.username ? { marginRight: "auto" } : {
        marginLeft: "auto",
        backgroundColor: '#f1f1f1'
    };

    const classes = styles();
    return (
        <div id={id} className={classes.message}
            style={appliedStyle}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}>
            {
                sender.username === user.username && isHovering &&
                <>
                    <div className={classes.delete} onClick={handleDeleteMessage}>delete</div>
                    <div className={classes.sender}>{"sender name"}</div>
                </>
            }
            <div className={classes.text}><p>{text}</p></div>
        </div>
    )

}

export default Message