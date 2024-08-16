import { Text } from "@mantine/core";
import React from "react";
import FollowNotification from "./FollowNotification";
import { NotificationType } from "../../utils/enumClasses";


const NotificationList = ({ notifications }) => {



    if (!notifications.length) return <Text ta="center">You have no Notifications yet</Text>

    const getNotificationCard = (notification) => {
        const { type, id } = notification

        const {
            FOLLOW_REQUEST,
            POST_REACTION,
            COMMENT,
            COMMENT_REACTION,
            COMMENT_REPLY,
            MENTION,
            REPOST
        } = NotificationType

        switch (type) {
            case FOLLOW_REQUEST.name:
                return <FollowNotification key={id} notification={notification} />;
            case POST_REACTION.name:
                return "reacted your post";
            case COMMENT.name:
                return "commented your post";
            case COMMENT_REACTION.name:
                return "reacted your comment";
            case COMMENT_REPLY.name:
                return "replied your comment";
            case REPOST.name:
                return "reposted your post";
            case MENTION:
                return "mentioned you"
            default:
                return "invalid notification type";
        }
    }

    return (
        <>
            {
                notifications.map(notification => getNotificationCard(notification))
            }
        </>
    )
}

export default NotificationList