import React from "react";
import NotificationList from "../../components/Notification/NotificationList";
import { NotificationType } from "../../utils/enumClasses";
import { useQueryClient } from "@tanstack/react-query";


const ReplyNotifications = () => {
    const queryClient = useQueryClient();
    const { content } = queryClient.getQueryData(["notifications"]);
    const notifications = content.filter(n => n.type === NotificationType.COMMENT_REPLY.name)

    return (
        <NotificationList notifications={notifications} />
    )
}

export default ReplyNotifications