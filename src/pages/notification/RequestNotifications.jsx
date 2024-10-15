import NotificationList from "@components/Notification/NotificationList";
import { useQueryClient } from "@tanstack/react-query";
import { NotificationType } from "@utils/enumClasses";
import React from "react";


const RequestNotifications = () => {
    const queryClient = useQueryClient();
    const { content } = queryClient.getQueryData(["notifications"]);
    const notifications = content.filter(n => n.type === NotificationType.FOLLOW_REQUEST.name)

    return (
        <NotificationList notifications={notifications} />
    )
}

export default RequestNotifications