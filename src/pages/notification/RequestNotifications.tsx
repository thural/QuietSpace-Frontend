import NotificationList from "@components/notification/components/list/NotificationList";
import { useQueryClient } from "@tanstack/react-query";
import { NotificationType } from "@utils/enumClasses";


const RequestNotifications = () => {
    const queryClient = useQueryClient();
    const { content } = queryClient.getQueryData(["notifications"]);
    const notifications = content.filter(n => n.type === NotificationType.FOLLOW_REQUEST.name)

    return (
        <NotificationList notifications={notifications} />
    )
}

export default RequestNotifications