import notificationQueries from "@/api/queries/notificationQueries";
import { NotificationType } from "@/api/schemas/native/notification";
import NotificationList from "@/components/notification/list/NotificationList";
import LoaderStyled from "@/components/shared/LoaderStyled";


const RequestNotifications = () => {
    const { getNotificationsCache } = notificationQueries();

    const notificationData = getNotificationsCache();

    if (notificationData === undefined) return <LoaderStyled />;
    const notifications = notificationData?.content.filter(n => n.type === NotificationType.FOLLOW_REQUEST)
    return <NotificationList notifications={notifications} />
}

export default RequestNotifications