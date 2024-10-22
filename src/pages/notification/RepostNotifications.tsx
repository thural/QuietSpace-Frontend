
import { PagedResponse } from "@/api/schemas/common";
import { NotificationSchema, NotificationType } from "@/api/schemas/notification";
import NotificationList from "@/components/notification/components/list/NotificationList";
import FullLoadingOverlay from "@/components/shared/FullLoadingOverlay";
import { getEnumValueFromString } from "@/utils/enumUtils";
import { useQueryClient } from "@tanstack/react-query";

const RepostNotifications = () => {
    const queryClient = useQueryClient();
    const notificationData: PagedResponse<NotificationSchema> | undefined = queryClient.getQueryData(["notifications"]);

    if (notificationData === undefined) return <FullLoadingOverlay />;

    const notifications = notificationData?.content.filter(n => getEnumValueFromString(NotificationType, n.type) === NotificationType.REPOST)

    return (
        <NotificationList notifications={notifications} />
    )
}

export default RepostNotifications