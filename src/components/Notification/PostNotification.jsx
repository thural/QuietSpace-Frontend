import React from "react";
import { NotificationType } from "../../utils/enumClasses";
import NotificationCard from "./NotificationCard";

const PostNotification = ({ notification }) => {

    const { type } = notification;

    const handleClick = (event) => {
        event.preventDefault();
        // TODO: navigate to post page
    }

    const getTextContent = () => {
        switch (type) {
            case NotificationType.POST_REACTION.name:
                return "reacted to your post";
            case NotificationType.COMMENT.name:
                return "commented your post";
            case NotificationType.REPOST.name:
                return "reposted your post";
            default:
                return "mentioned you";
        }
    }


    return (
        <NotificationCard notification={notification} onClick={handleClick} text={getTextContent()} />
    )
}

export default PostNotification