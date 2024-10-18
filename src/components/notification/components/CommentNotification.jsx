import { NotificationType } from "@utils/enumClasses";
import React from "react";
import NotificationCard from "../components/base/NotificationCard";

const CommentNotification = ({ notification }) => {

    const { type } = notification;

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