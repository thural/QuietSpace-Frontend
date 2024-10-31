import { getNotificationsCache } from "@/api/queries/notificationQueries";
import { NotificationType } from "@/api/schemas/native/notification";
import FullLoadingOverlay from "@/components/shared/FullLoadingOverlay";
import { getEnumValueFromString } from "@/utils/enumUtils";
import NotificationList from "@components/notification/components/list/NotificationList";


const MentionNotifications = () => {

    const notificationsData = getNotificationsCache();

    if (notificationsData === undefined) return <FullLoadingOverlay />
    const notifications = notificationsData.content?.filter(n => getEnumValueFromString(NotificationType, n.type) === NotificationType.MENTION)
    return <NotificationList notifications={notifications} />
}

export default MentionNotifications