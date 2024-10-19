import NotificationList from "@components/notification/components/list/NotificationList";
import { useQueryClient } from "@tanstack/react-query";
import { NotificationType } from "@utils/enumClasses";
import React from "react";


const ReplyNotifications = () => {
    const queryClient = useQueryClient();
    const { content } = queryClient.getQueryData(["notifications"]);
    const notifications = content.filter(n => n.type === NotificationType.COMMENT_REPLY.name)

    return (
        <NotificationList notifications={notifications} />
    )
}

export default ReplyNotifications