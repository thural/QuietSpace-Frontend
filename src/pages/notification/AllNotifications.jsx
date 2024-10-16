import NotificationList from "@components/notification/components/list/NotificationList";
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