import NotificationList from "@components/Notification/NotificationList";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";


const AllNotifications = () => {

    const queryClient = useQueryClient();
    const { content: notifications } = queryClient.getQueryData(["notifications"]);

    return (
        <NotificationList notifications={notifications} />
    )
}

export default AllNotifications