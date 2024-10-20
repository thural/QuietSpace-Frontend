import NotificationList from "@components/notification/components/list/NotificationList";
import { useQueryClient } from "@tanstack/react-query";
import { NotificationType } from "@utils/enumClasses";

const RepostNotifications = () => {
    const queryClient = useQueryClient();
    const { content } = queryClient.getQueryData(["notifications"]);
    const notifications = content.filter(n => n.type === NotificationType.REPOST.name)

    return (
        <NotificationList notifications={notifications} />
    )
}

export default RepostNotifications