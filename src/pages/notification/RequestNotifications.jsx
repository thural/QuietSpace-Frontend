import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { NotificationType } from "../../utils/enumClasses";
import NotificationList from "../../components/Notification/NotificationList";


const RequestNotifications = () => {
    const queryClient = useQueryClient();
    const { content } = queryClient.getQueryData(["notifications"]);
    const notifications = content.filter(n => n.type === NotificationType.FOLLOW_REQUEST.name)

    return (
        <NotificationList notifications={notifications} />
    )
}

export default RequestNotifications