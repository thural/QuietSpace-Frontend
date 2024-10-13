import React from "react";
import { NotificationType } from "../../utils/enumClasses";
import Typography from "../Shared/Typography";
import CommentNotification from "./CommentNotification";
import FollowNotification from "./FollowNotification";
import PostNotification from "./PostNotification";


const NotificationList = ({ notifications }) => {

    if (!notifications.length) return <Typography ta="center">You have no Notifications yet</Typography>

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

            case COMMENT_REACTION.name:
                return <CommentNotification key={id} notification={notification} />;
            case COMMENT_REPLY.name:
                return <CommentNotification key={id} notification={notification} />;
            case FOLLOW_REQUEST.name:
                return <FollowNotification key={id} notification={notification} />;
            case POST_REACTION.name:
                return <PostNotification key={id} notification={notification} />;
            case COMMENT.name:
                return <PostNotification key={id} notification={notification} />;
            case REPOST.name:
                return <PostNotification key={id} notification={notification} />;
            case MENTION:
                return <PostNotification key={id} notification={notification} />;
            default:
                throw new Error("invalid notification type");
        }
    }

    return notifications.map(notification => getNotificationCard(notification));
}

export default NotificationList