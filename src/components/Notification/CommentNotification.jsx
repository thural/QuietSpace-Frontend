import React from "react";
import NotificationCard from "../Shared/NotificationCard";
import { NotificationType } from "../../utils/enumClasses";

const CommentNotification = ({ notification }) => {



    const handleClick = (event) => {
        event.preventDefault();
        // TODO: navigate to post page
    }

    const getTextContent = () => {
        if (type === NotificationType.COMMENT_REACTION.name)
            return "reacted your comment";
        if (type === NotificationType.COMMENT_REPLY.name)
            return "replied your comment";
    }



    return (
        <NotificationCard notification={notification} onClick={handleClick} text={getTextContent()} />
    )
}

export default CommentNotification