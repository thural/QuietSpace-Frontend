import React, { useState } from "react";
import styles from "./styles/messageStyles";

import { MESSAGE_PATH } from "../../constants/ApiPath";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { fetchDeleteMessage } from "../../api/messageRequests";

const Message = ({ message }) => {

    const queryClient = useQueryClient();

    const user = queryClient.getQueryData("user");
    const auth = queryClient.getQueryData("auth");
    const { id, sender, text } = message;

    const [isHovering, setIsHovering] = useState(false);

    const handleMouseOver = () => {
        setIsHovering(true);
    };

    const handleMouseOut = () => {
        setIsHovering(false);
    };


    const deleteMessageMutation = useMutation({
        mutationFn: async () => {
            const response = await fetchDeleteMessage(MESSAGE_PATH, auth["token"], id);
            return response.json();
        },
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries(["chats"], { id }, { exact: true });
            console.log("delete message sucess");
        },
        onError: (error, variables, context) => {
            console.log("error on deleting message: ", error.message);
        },
    })

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
            <div className={classes.text}><p>{"sample message text for testing messages section"}</p></div>
        </div>
    )

}

export default Message