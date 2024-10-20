import { PagedResponse } from "@/api/schemas/common";
import { NotificationResponse, NotificationType } from "@/api/schemas/notification";
import NotificationList from "@/components/notification/components/list/NotificationList";
import FullLoadingOverlay from "@/components/shared/FullLoadingOverlay";
import { getEnumValueFromString } from "@/utils/enumUtils";
import { useQueryClient } from "@tanstack/react-query";


const ReplyNotifications = () => {
    const queryClient = useQueryClient();
    const notificationData: PagedResponse<NotificationResponse> | undefined = queryClient.getQueryData(["notifications"]);

    if (notificationData === undefined) return <FullLoadingOverlay />;

    const notifications = notificationData?.content.filter(n => getEnumValueFromString(NotificationType, n.type) === NotificationType.COMMENT_REPLY)

    return (
        <NotificationList notifications={notifications} />
    )
}

export default ReplyNotifications