import React from "react";
import NotificationList from "../../components/Notification/NotificationList";
import { NotificationType } from "../../utils/enumClasses";
import { useQueryClient } from "@tanstack/react-query";


const MentionNotifications = () => {
    const queryClient = useQueryClient();
    const { content } = queryClient.getQueryData(["notifications"]);
    const notifications = content.filter(n => n.type === NotificationType.MENTION.name)
    console.log("notifications on MentionNotifications: ", notifications);

    return (
        <NotificationList notifications={notifications} />
    )
}

export default MentionNotifications