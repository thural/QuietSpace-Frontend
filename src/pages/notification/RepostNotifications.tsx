
import { Page } from "@/api/schemas/inferred/common";
import { Notification } from "@/api/schemas/inferred/notification";
import { NotificationType } from "@/api/schemas/native/notification";
import NotificationList from "@/components/notification/components/list/NotificationList";
import FullLoadingOverlay from "@/components/shared/FullLoadingOverlay";
import { getEnumValueFromString } from "@/utils/enumUtils";
import { useQueryClient } from "@tanstack/react-query";

const RepostNotifications = () => {

    const queryClient = useQueryClient();
    const notificationData: Page<Notification> | undefined = queryClient.getQueryData(["notifications"]);

    if (notificationData === undefined) return <FullLoadingOverlay />;
    const notifications = notificationData?.content.filter(n => getEnumValueFromString(NotificationType, n.type) === NotificationType.REPOST)
    return <NotificationList notifications={notifications} />
}

export default RepostNotifications