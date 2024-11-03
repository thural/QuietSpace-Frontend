
import notificationQueries from "@/api/queries/notificationQueries";
import { NotificationType } from "@/api/schemas/native/notification";
import NotificationList from "@/components/notification/components/list/NotificationList";
import FullLoadingOverlay from "@/components/shared/FullLoadingOverlay";
import { getEnumValueFromString } from "@/utils/enumUtils";

const RepostNotifications = () => {

    const { getNotificationsCache } = notificationQueries();

    const notificationData = getNotificationsCache();

    if (notificationData === undefined) return <FullLoadingOverlay />;
    const notifications = notificationData?.content.filter(n => getEnumValueFromString(NotificationType, n.type) === NotificationType.REPOST)
    return <NotificationList notifications={notifications} />
}

export default RepostNotifications